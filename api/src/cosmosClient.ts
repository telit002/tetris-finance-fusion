import { CosmosClient, Database, Container } from '@azure/cosmos';

// Prefer explicit endpoint/key configuration; this avoids undefined connection string issues
const endpoint = process.env.COSMOSDB_ENDPOINT!;
const key = process.env.COSMOSDB_KEY!;
const databaseId = process.env.COSMOSDB_DATABASE!;
const containerId = process.env.COSMOSDB_CONTAINER!;

const cosmos = new CosmosClient({ endpoint, key });
const database: Database = cosmos.database(databaseId);
const container: Container = database.container(containerId);

export interface Player {
  id: string;
  name: string;
  score: number;
  level: number;
  linesCleared: number;
  gameTime: number;
  timestamp: string;
  gameData?: any;
}

export { cosmos, database, container }; 