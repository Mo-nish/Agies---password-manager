"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.pgPool = exports.redisConfig = exports.dbConfig = void 0;
exports.testConnections = testConnections;
exports.closeConnections = closeConnections;
exports.healthCheck = healthCheck;
var pg_1 = require("pg");
var redis_1 = require("redis");
// Database configuration
exports.dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'padhma_vyuham_vault',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
// Redis configuration
exports.redisConfig = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
};
// Create PostgreSQL connection pool
exports.pgPool = new pg_1.Pool(exports.dbConfig);
// Create Redis client
exports.redisClient = redis_1.default.createClient({
    socket: {
        host: exports.redisConfig.host,
        port: exports.redisConfig.port
    },
    database: exports.redisConfig.db
});
// Handle Redis connection events
exports.redisClient.on('connect', function () {
    console.log('🔴 Redis connected successfully');
});
exports.redisClient.on('error', function (err) {
    console.error('🔴 Redis connection error:', err);
});
exports.redisClient.on('ready', function () {
    console.log('🔴 Redis ready for commands');
});
// Handle PostgreSQL connection events
exports.pgPool.on('connect', function (client) {
    console.log('🐘 PostgreSQL client connected');
});
exports.pgPool.on('error', function (err, client) {
    console.error('🐘 PostgreSQL client error:', err);
});
// Test database connections
function testConnections() {
    return __awaiter(this, void 0, void 0, function () {
        var pgResult, redisResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, exports.pgPool.query('SELECT NOW() as current_time')];
                case 1:
                    pgResult = _a.sent();
                    console.log('✅ PostgreSQL connection successful:', pgResult.rows[0].current_time);
                    // Test Redis
                    return [4 /*yield*/, exports.redisClient.set('test', 'connection_test')];
                case 2:
                    // Test Redis
                    _a.sent();
                    return [4 /*yield*/, exports.redisClient.get('test')];
                case 3:
                    redisResult = _a.sent();
                    return [4 /*yield*/, exports.redisClient.del('test')];
                case 4:
                    _a.sent();
                    console.log('✅ Redis connection successful:', redisResult);
                    return [2 /*return*/, true];
                case 5:
                    error_1 = _a.sent();
                    console.error('❌ Database connection test failed:', error_1);
                    return [2 /*return*/, false];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Graceful shutdown
function closeConnections() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, exports.pgPool.end()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, exports.redisClient.quit()];
                case 2:
                    _a.sent();
                    console.log('🔌 Database connections closed gracefully');
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('❌ Error closing database connections:', error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Health check
function healthCheck() {
    return __awaiter(this, void 0, void 0, function () {
        var pgHealth, redisHealth, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, exports.pgPool.query('SELECT 1 as health')];
                case 1:
                    pgHealth = _b.sent();
                    return [4 /*yield*/, exports.redisClient.ping()];
                case 2:
                    redisHealth = _b.sent();
                    return [2 /*return*/, {
                            postgresql: ((_a = pgHealth.rows[0]) === null || _a === void 0 ? void 0 : _a.health) === 1,
                            redis: redisHealth === 'PONG',
                            timestamp: new Date().toISOString()
                        }];
                case 3:
                    error_3 = _b.sent();
                    return [2 /*return*/, {
                            postgresql: false,
                            redis: false,
                            error: error_3 instanceof Error ? error_3.message : 'Unknown error',
                            timestamp: new Date().toISOString()
                        }];
                case 4: return [2 /*return*/];
            }
        });
    });
}
