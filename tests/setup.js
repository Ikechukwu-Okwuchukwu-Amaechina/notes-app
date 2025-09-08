// Common test setup for MongoDB with mongodb-memory-server
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret';

const { MongoMemoryServer } = require('mongodb-memory-server');
const { connectDb, disconnectDb, mongoose } = require('../models/db');

let mongoServer;

// Increase timeout for this test file (download & startup can be slow on Windows/CI)
jest.setTimeout(90000);

beforeAll(async () => {
	// If a real MongoDB URI is provided, use it; otherwise start an in-memory MongoDB
	const externalUri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();
	if (externalUri) {
		await connectDb(externalUri);
		return;
	}

	try {
		// Pin version for consistency; default engine for 7.x is wiredTiger
		mongoServer = await MongoMemoryServer.create({
			binary: { version: '7.0.14' },
			instance: { storageEngine: 'wiredTiger' },
		});
	} catch (e) {
		// Provide a helpful message to use a locally running MongoDB as a fallback
		throw new Error(
			'Failed to start mongodb-memory-server. If this persists, start a local MongoDB and set MONGODB_URI=mongodb://localhost:27017/notes-app before running tests.\n' +
				(e && e.message ? e.message : String(e))
		);
	}
	const uri = mongoServer.getUri();
	process.env.MONGODB_URI = uri; // for index.js if used
	await connectDb(uri);
});

afterAll(async () => {
	await disconnectDb();
	if (mongoServer) await mongoServer.stop();
});

// Note: Do not clear collections after each test since tests build on prior state
// (signup -> verify -> login -> CRUD). If you need isolation for a new suite,
// consider moving cleanup into that suite or using a separate DB.
