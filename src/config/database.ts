import { Pool } from 'pg';
import * as redis from 'redis';

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'agies_maze_vault',
  user: process.env.DB_USER || 'agies',
  password: process.env.DB_PASSWORD || 'secure_password',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Redis configuration
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

// Create PostgreSQL connection pool
export const pgPool = new Pool(dbConfig);

// Create Redis client
export const redisClient = redis.createClient({
  socket: {
    host: redisConfig.host,
    port: redisConfig.port
  },
  database: redisConfig.db
});

// Handle Redis connection events
redisClient.on('connect', () => {
  console.log('🔴 Redis connected successfully');
});

redisClient.on('error', (err: any) => {
  console.error('🔴 Redis connection error:', err);
});

redisClient.on('ready', () => {
  console.log('🔴 Redis ready for commands');
});

// Handle PostgreSQL connection events
pgPool.on('connect', (client) => {
  console.log('🐘 PostgreSQL client connected');
});

pgPool.on('error', (err, client) => {
  console.error('🐘 PostgreSQL client error:', err);
});

// Test database connections
export async function testConnections() {
  try {
    // Test PostgreSQL
    const pgResult = await pgPool.query('SELECT NOW() as current_time');
    console.log('✅ PostgreSQL connection successful:', pgResult.rows[0].current_time);

    // Test Redis
    await redisClient.set('test', 'connection_test');
    const redisResult = await redisClient.get('test');
    await redisClient.del('test');
    console.log('✅ Redis connection successful:', redisResult);

    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnections() {
  try {
    await pgPool.end();
    await redisClient.quit();
    console.log('🔌 Database connections closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
}

// Health check
export async function healthCheck() {
  try {
    const pgHealth = await pgPool.query('SELECT 1 as health');
    const redisHealth = await redisClient.ping();
    
    return {
      postgresql: pgHealth.rows[0]?.health === 1,
      redis: redisHealth === 'PONG',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      postgresql: false,
      redis: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}
