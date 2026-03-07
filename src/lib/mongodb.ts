import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables if needed
dotenv.config();

// Use directly provided URI if available
const uri = process.env.MONGODB_URI || "mongodb+srv://qdcsrmist:QwikDevClub1234@qwiklabsdeveloperclub.nrrsacw.mongodb.net/qdc";

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log("MongoDB URI available:", !!uri);

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

try {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    let globalWithMongo = global as typeof global & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri);
      globalWithMongo._mongoClientPromise = client.connect()
        .then((client) => {
          console.log("MongoDB development connection established");
          return client;
        })
        .catch((err) => {
          console.error("MongoDB development connection failed:", err);
          throw err;
        });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri);
    clientPromise = client.connect()
      .then((client) => {
        console.log("MongoDB production connection established");
        return client;
      })
      .catch((err) => {
        console.error("MongoDB production connection failed:", err);
        throw err;
      });
  }
} catch (error) {
  console.error("Error initializing MongoDB connection:", error);
  throw error;
}

// Export a module-scoped MongoClient promise
export default clientPromise;
