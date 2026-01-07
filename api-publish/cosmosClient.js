"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = exports.database = exports.cosmos = void 0;
const cosmos_1 = require("@azure/cosmos");
// Prefer explicit endpoint/key configuration; this avoids undefined connection string issues
const endpoint = process.env.COSMOSDB_ENDPOINT;
const key = process.env.COSMOSDB_KEY;
const databaseId = process.env.COSMOSDB_DATABASE;
const containerId = process.env.COSMOSDB_CONTAINER;
const cosmos = new cosmos_1.CosmosClient({ endpoint, key });
exports.cosmos = cosmos;
const database = cosmos.database(databaseId);
exports.database = database;
const container = database.container(containerId);
exports.container = container;
//# sourceMappingURL=cosmosClient.js.map