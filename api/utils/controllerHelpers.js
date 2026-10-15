const { readData, writeData } = require("./jsonDB");
const WriteQueue = require("./writeQueue");

// Converts a text value into a consistent form for name comparisons.
// This makes "Team A", " team a ", and "TEAM A" match each other.
function normalizeText(text = "") {
  return text.toLowerCase().trim();
}

// Returns a database collection and creates it if it does not exist yet.
function getCollection(database, collectionName) {
  if (!Array.isArray(database[collectionName])) {
    database[collectionName] = [];
  }

  return database[collectionName];
}

// Creates timestamps for a new database record.
function createTimestamps() {
  const now = new Date().toISOString();

  return {
    createdAt: now,
    updatedAt: now,
  };
}

// Creates the timestamp used when an existing record is updated.
function updateTimestamp() {
  return {
    updatedAt: new Date().toISOString(),
  };
}

// Finds one record by its unique identifier.
function findById(items, id) {
  return items.find((item) => item.id === id);
}

// Checks whether a name is already used in a collection.
//   excludedId is used during updates so the current record is ignored.
function hasDuplicateName(items, name, excludedId = null) {
  const normalizedName = normalizeText(name);

  return items.some(
    (item) =>
      normalizeText(item.name) === normalizedName && item.id !== excludedId,
  );
}

// Runs a database mutation through the write queue.
// The database is saved only when the mutator returns shouldSave: true.async function runDatabaseWrite(mutator) {

async function runDatabaseWrite(mutator) {
  return WriteQueue.enqueue(async () => {
    const database = readData("database");
    const result = await mutator(database);

    if (result.shouldSave) {
      writeData("database", database);
    }

    return result;
  });
}

// Update one graphics section inside a match
async function updateMatchGraphicsData(matchId, graphicsKey, dataToSave) {
  return await runDatabaseWrite(async (database) => {
    const matchIndex = database.matches.findIndex(
      (match) => match.id === matchId,
    );

    if (matchIndex === -1) {
      return {
        status: 404,
        message: "Match not found.",
        shouldSave: false,
      };
    }

    database.matches[matchIndex].graphics[graphicsKey] = dataToSave;

    database.matches[matchIndex].updatedAt = updateTimestamp().updatedAt;

    return {
      status: 200,
      message: "Updated successfully.",
      shouldSave: true,
    };
  });
}

// Remove an item from any collection by ID
async function deleteEntityFromDB(id, collectionName, entityName) {
  return await runDatabaseWrite(async (database) => {
    const collection = database[collectionName] || [];
    const index = collection.findIndex((item) => item.id === id);

    if (index === -1) {
      return {
        status: 404,
        message: `${entityName} not found.`,
        shouldSave: false,
      };
    }

    collection.splice(index, 1);

    return {
      status: 200,
      message: `${entityName} deleted successfully.`,
      shouldSave: true,
    };
  });
}

module.exports = {
  normalizeText,
  getCollection,
  createTimestamps,
  updateTimestamp,
  findById,
  hasDuplicateName,
  runDatabaseWrite,
  updateMatchGraphicsData,
  deleteEntityFromDB,
};
