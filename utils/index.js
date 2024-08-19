'use strict';

const _ = require('lodash');

const getIntoData = (fields = [], object = {}) => {
    return _.pick(object, fields)
}

const getSelectedData = (select = []) => {
    return Object.fromEntries(select.map((ele) => {
        return [ele, 1]
    }))
}

const refuseSelectedData = (select = []) => {
    return Object.fromEntries(select.map((ele) => {
        return [ele, 0]
    }))
}
module.exports = {
    getIntoData,
    getSelectedData,
    refuseSelectedData,
}