'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');

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

const removeUndefinedObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key]
        }
    })

    return obj;
}

const updateNestedObject = (obj) => {
    const result = {}

    Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObject(obj[key])

            Object.keys(response).forEach((subKey) => {
                result[`${key}.${subKey}`] = response[subKey];
            })
        } else {
            result[key] = obj[key];
        }
    })
    return result;
}

const convertToObjectIdMongoose = (id) => {
    return new Types.ObjectId(id);
}


module.exports = {
    getIntoData,
    getSelectedData,
    refuseSelectedData,
    removeUndefinedObject,
    updateNestedObject,
    convertToObjectIdMongoose,
}