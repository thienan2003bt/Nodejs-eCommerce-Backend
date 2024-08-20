'use strict';
const Utils = require('../../utils/index');;

const findAllDiscountsCodeUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect = [], model }) => {
    const skip = (+page - 1) * +limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(Utils.refuseSelectedData(unSelect))
        .lean();

    return discounts;
}

const findAllDiscountsCodeSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect = [], model }) => {
    const skip = (+page - 1) * +limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const discounts = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(Utils.getSelectedData(unSelect))
        .lean();

    return discounts;
}

module.exports = {
    findAllDiscountsCodeSelect,
    findAllDiscountsCodeUnSelect,
}