'use strict';

const profiles = [
    {user_id: 1, username: 'leechongwei', user_avatar: "image.com/user/1"},
    {user_id: 2, username: 'lindan', user_avatar: "image.com/user/2"},
    {user_id: 3, username: 'chenlong', user_avatar: "image.com/user/3"},
]

class ProfileService {
    async viewAny() {
        return profiles;
    }

    async viewOne() {
        return profiles[1];
    }
}

module.exports = new ProfileService();