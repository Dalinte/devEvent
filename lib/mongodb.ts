import mongoose from 'mongoose';

// Define the type for the cached connection
interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global cache for the database connection
declare global {
  var mongoose: CachedConnection | undefined;
}

/**
 * Connects to MongoDB database using Mongoose
 * @returns Promise<typeof mongoose> - Mongoose instance
 */
export async function connectDB(): Promise<typeof mongoose> {
  // Check if we have a cached connection
  if (global.mongoose?.conn) {
    return global.mongoose.conn;
  }

  // Get MongoDB connection string from environment variables
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // Create cached connection if it doesn't exist
  const cached: CachedConnection = global.mongoose || {
    conn: null,
    promise: null,
  };

  // If there's no active connection and no pending promise, create one
  if (!cached.conn && !cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Buffer commands until the connection is established
      bufferCommands: false,
      // Maximum time to try connecting before giving up
      serverSelectionTimeoutMS: 10000,
      // Retry writes on network errors
      retryWrites: true,
      // Write concern for write operations
      w: 'majority',
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    // Wait for the connection to establish
    cached.conn = await cached.promise!;
  } catch (error) {
    // Clear the promise on failure so it can be retried
    cached.promise = null;
    throw error;
  }

  // Cache the connection globally
  global.mongoose = cached;

  return cached.conn;
}

/**
 * Disconnects from MongoDB database
 * Useful for cleanup in serverless environments
 */
export async function disconnectDB(): Promise<void> {
  if (global.mongoose?.conn) {
    await global.mongoose.conn.disconnect();
    global.mongoose.conn = null;
    global.mongoose.promise = null;
  }
}

/**
 * Checks if MongoDB is connected
 * @returns boolean - Connection status
 */
export function isConnected(): boolean {
  return global.mongoose?.conn?.connection.readyState === 1;
}

/**
 * Gets the current connection state as a string
 * @returns string - Connection state description
 */
export function getConnectionState(): string {
  const state = global.mongoose?.conn?.connection.readyState;
  
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'unknown';
  }
}
