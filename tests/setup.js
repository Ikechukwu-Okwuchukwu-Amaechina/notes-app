const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDb, disconnectDb } = require('../config/db');

let mongoServer;

jest.setTimeout(90000);

beforeAll(async () => {
  // Use real Mongo if provided
  const externalUri = process.env.MONGO_URI && process.env.MONGO_URI.trim();
  if (externalUri) {
    await connectDb(externalUri);
    return;
  }

  try {
    mongoServer = await MongoMemoryServer.create({
      binary: { version: '7.0.14' },
      instance: { storageEngine: 'wiredTiger' },
    });
  } catch (e) {
    throw new Error(
      'Failed to start mongodb-memory-server. If this persists, start a local MongoDB and set MONGO_URI=mongodb://localhost:27017/notes-app before running tests.\n' +
        (e && e.message ? e.message : String(e))
    );
  }

  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await connectDb(uri); // pass it explicitly
});

afterAll(async () => {
  await disconnectDb();
  if (mongoServer) await mongoServer.stop();
});
