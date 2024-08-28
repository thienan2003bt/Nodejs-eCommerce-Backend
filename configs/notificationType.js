'use strict';

const types = {
    //TODO: add new notification types here
    ADD_NEW_PRODUCT: 'ORDER-001',
    ADD_NEW_DISCOUNT: 'PROMOTION-001',
}

const contents = new Map([
    ['ORDER-001', '@@@ just added new product: @@@@'],
    ['PROMOTION-001', '@@@ just added new discount: @@@@'],
])

module.exports = {
    types, contents
}