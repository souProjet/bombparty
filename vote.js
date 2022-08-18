const votes = [];
const activeVotes = [];

function voteJoin(username, id, room, activeAuthorUsername, activeRound) {
    const voteJSON = { username, id, room, activeAuthorUsername, activeRound };
    activeVotes.push(voteJSON);
    votes.push(voteJSON)

    return voteJSON;
}

function getNbrVotes(room, activeRound) {

    return activeVotes.filter(vote => vote.room === room).filter(voteR => voteR.activeRound === activeRound).length;

}

function getAllVotes(room) {
    return votes.filter(vote => vote.room === room);
}

function deleteVotes(room) {
    votes.filter(vote => vote.room === room).map(key => delete votes[votes.indexOf(key)]);
}

function deleteActiveVotes(room) {
    activeVotes.filter(vote => vote.room === room).map(key => delete activeVotes[activeVotes.indexOf(key)]);

}
module.exports = {
    voteJoin,
    getNbrVotes,
    deleteVotes,
    deleteActiveVotes,
    getAllVotes
}