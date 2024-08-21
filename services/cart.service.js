'use strict';

const cartModel = require('../models/cart.model');

/* Key features
- Add products to cart [user]
- Reduce product quantity by one [user]
- Increase product quantity by one [user]
- Get cart [user]
- Delete cart [user]
- Delete cart item [user]
*/

class CartService {
    static async createUserCart({ userID, product }) {
        const query = {
            cart_userID: userID,
            cart_state: 'active'
        }
        const updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }
        const options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }

    static async updateUserCartQuantity({ userID, product }) {
        const { productID, quantity } = product;
        const query = {
            cart_userID: userID,
            'cart_products.productID': productID,
            cart_state: 'active'
        }
        const updateSet = {
            $inc: { "cart_product.$.quantity": quantity }
        }
        const options = { upsert: true, new: true }
        return await cartModel.findOneAndUpdate(query, updateSet, options)

    }

    /* ADD TO CART GUIDELINE
    1 - If user's cart is not yet existed, create a new one
    2 - If user's cart is already existed but is empty
    3 - The user's cart is already existed and its product count > 0
    */
    static async addToCart({ userID, product = {} }) {
        // Step 1
        let userCart = await cartModel.findOne({ cart_userID: userID }).lean();
        if (!userCart) {
            return await CartService.createUserCart({ userID, product })
        }

        // Step 2
        if (userCart?.cart_count_product === 0) {
            userCart = await cartModel.updateOne({ cart_userID: userID }, {
                cart_products: [product],
                cart_count_product: 1
            })
        }

        // Step 3
        return await CartService.updateUserCartQuantity({ userID, product })
    }


}