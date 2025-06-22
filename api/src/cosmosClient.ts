import { CosmosClient, Database, Container } from '@azure/cosmos';

const endpoint = process.env.COSMOSDB_ENDPOINT!;
const key = process.env.COSMOSDB_KEY!;
const databaseId = process.env.COSMOSDB_DATABASE!;
const containerId = process.env.COSMOSDB_CONTAINER!;

const client = new CosmosClient({ endpoint, key });
const database: Database = client.database(databaseId);
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

export { client, database, container }; 