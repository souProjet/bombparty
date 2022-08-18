const responses = [];

function responseJoin(response, id, username, room) {
    const responseJSON = { response, id, username, room };
    responses.push(responseJSON);
    return responseJSON;
}

function getResponses(room) {
    return responses.filter(response => response.room === room);
}

function getNbrResponses(room) {
    return responses.filter(response => response.room === room).length;

}

function deleteResponses(room) {
    responses.filter(response => response.room === room).map(key => delete responses[responses.indexOf(key)]);

}
module.exports = {
    responseJoin,
    getResponses,
    getNbrResponses,
    deleteResponses
}