'use strict';

const { Types } = require("mongoose");
const { BadRequestError } = require("../core/error.response");
const ResourceModel = require("../models/resource.model");
const RoleModel = require("../models/role.model");

class RBACService {
    async createNewResource({slug, name = "profile", description = ''}) {
        const foundResource = await ResourceModel.findOne({
            resrc_slug: slug
        });
        if(foundResource) {
            throw new BadRequestError("Resource with this slug is already existed!")
        }
        
        const newResource = await ResourceModel.create({
            resrc_slug: slug,
            resrc_name: name,
            resrc_description: description
        });

        return newResource;
    }

    async getResourceList({adminId, limit = 30, offset = 0, search = []}) {
        // TODO: Check admin in middleware

        const resources = await ResourceModel.aggregate([{
            $project: {
                _id: 0, 
                name: '$resrc_name', 
                slug: '$resrc_slug', 
                resourceId: '$_id',
                createdAt: 1
            }}
        ])

        return resources;
    }

    async createNewRole({slug, name = 'shop', description = '', grants = []}) {
        const foundRole = await ResourceModel.findOne({
            role_slug: slug,
        });
        if(foundRole) {
            throw new BadRequestError("Role with this slug is already existed!")
        }

        const newGrants = grants.map(grant => {
            return {...grant, resource: new Types.ObjectId(grant.resource)}
        })
        const newRole = await RoleModel.create({
            role_slug: slug,
            role_name: name,
            role_description: description,
            role_grants: newGrants
        });

        return newRole;
    }

    async getRoleList({adminId, limit = 30, offset = 0, search = []}) {
            
        const roles = await RoleModel.aggregate([
            { $unwind: '$role_grants' },
            { $lookup: {
                from: 'Resources', 
                localField: 'role_grants.resource', 
                foreignField: "_id",
                as: 'resource'
                }
            },
            { $unwind: '$resource'},
            { $project: {
                role: '$role_name',
                resource: '$resource.resrc_name',
                action: '$role_grants.actions',
                attributes: '$role_grants.attributes'
            }},
            { $unwind: '$action'},
            { $project: {_id: 0, role: 1, resource: 1, attributes: 1, action: '$action'}}
        ])

        return roles;
    }
}

module.exports = new RBACService();