const users = [];

function isObjEmpty(obj) {
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false;
    }

    return true;
}


function userJoin(id, username, room) {
    let hote = isObjEmpty(users.filter(user => user.room === room)) ? 1 : 0;
    const user = { id, username, room, hote };
    users.push(user);

    return user;
}

function getCurrentUser(id) {
    return users.find(user => user.id === id)
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

function getNbrUser(room) {
    return users.filter(user => user.room === room).length;
}

function getRoomUsers(room) {
    return users.filter(user => user.room === room)
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getNbrUser
}