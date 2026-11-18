const syncRepository = require("../repositories/syncRepository");

async function getChanges(userId, since, full) {
  return syncRepository.getChanges(userId, since, full);
}

module.exports = {
  getChanges
};
