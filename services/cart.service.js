'use strict';

const cartModel = require('../models/cart.model');
const ProductRepository = require('../models/repositories/product.repo');
const { NotFoundError, BadRequestError } = require('../core/error.response');
const { Types } = require('mongoose');

/* Key features
- Add products to cart [user]
- Reduce product quantity by one [user]
- Increase product quantity by one [user]
- Get cart [user]
- Delete cart [user]
- Delete cart item [user]
*/

class CartService {
    static normalizeProductCart(product) {
        const newProduct = {
            ...product,
            productID: new Types.ObjectId(product?.productID ?? ''),
            shopID: new Types.ObjectId(product?.shopID ?? ''),
        }
        return newProduct;
    }

    static async createUserCart({ userID, product }) {
        const query = {
            cart_userID: userID,
            cart_state: 'active'
        }
        const normalizedProduct = CartService.normalizeProductCart(product)
        const updateOrInsert = {
            $addToSet: {
                cart_products: normalizedProduct
            }
        }
        const options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userID, product }) {
        const { productID, quantity } = product;
        console.log(`product id ${productID}; quantity ${quantity}`);
        const query = {
            cart_userID: userID,
            "cart_products.productID": new Types.ObjectId(productID),
            cart_state: 'active'
        }
        const updateSet = {
            $inc: { "cart_products.$.quantity": +quantity }
        }
        const options = { upsert: true, new: true };
        return await cartModel.findOneAndUpdate(query, updateSet, options)

    }

    static async addNewProductToUSerCart({ userID, product }) {
        return await cartModel.updateOne(
            { cart_userID: userID, cart_state: 'active' },
            { $push: { cart_products: product }, $inc: { cart_count_product: 1 } },
            { upsert: true, new: true });
    }

    /* ADD TO CART GUIDELINE
    1 - If user's cart is not yet existed, create a new one
    2 - If user's cart is already existed but is empty
    3 - Check if user's cart does not have that product
    4 - The user's cart is already existed and its product count > 0
    */
    static async addToCart({ userID, product = {} }) {
        // Step 1
        let userCart = await cartModel.findOne({ cart_userID: userID }).lean();
        if (!userCart) {
            return await CartService.createUserCart({ userID, product })
        }

        const normalizedProduct = CartService.normalizeProductCart(product);

        // Step 2
        if (userCart?.cart_count_product === 0) {
            userCart = await cartModel.updateOne({ cart_userID: userID }, {
                cart_products: [normalizedProduct],
                cart_count_product: 1
            })
            return userCart;
        }

        // Step 3
        const existingProductInCart = userCart?.cart_products.find(cartProduct => cartProduct?.productID?.toString() === product?.productID);
        if (!existingProductInCart) {
            return await CartService.addNewProductToUSerCart({ userID, product: normalizedProduct });
        }

        // Step 4
        return await CartService.updateUserCartQuantity({ userID, product: normalizedProduct })
    }


    /* UPDATE CART GUIDELINE
    1- 
    */
    static async addToCartV2({ userID, shop_order_ids = {} }) {
        const { productID, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];

        const existingProduct = await ProductRepository.getProductByID(productID);
        if (!existingProduct) {
            throw new NotFoundError('Invalid product!')
        }

        if (existingProduct?.product_shop?.toString() !== shop_order_ids[0]?.shopID) {
            throw new NotFoundError('Product does not belong to the shop!')
        }

        if (quantity === 0) {
            //TODO: Delete item from the cart
            return await CartService.deleteUserCartItem({ userID, productID })
        }

        return await CartService.updateUserCartQuantity({
            userID,
            product: {
                productID: new Types.ObjectId(productID),
                quantity: +quantity - +old_quantity
            }
        })
    }


    static async deleteUserCartItem({ userID, productID }) {
        const query = { cart_userID: userID, cart_state: 'active' }
        const updateSet = {
            $pull: {
                cart_products: { productID: new Types.ObjectId(productID) }
            },
            $inc: { cart_count_product: -1 }
        }

        console.log("userID: " + userID);
        console.log("productID: " + productID);
        const deletedCart = await cartModel.updateOne(query, updateSet)
        return deletedCart;
    }

    static async getListUserCart({ userID, limit = 50, page = 1 }) {
        const skip = (+page - 1) * +limit;
        const userCart = await cartModel.findOne({ cart_userID: userID })
            .skip(skip)
            .limit(+limit)
            .lean();

        return userCart;
    }
}

module.exports = CartService;