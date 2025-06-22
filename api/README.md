# Tetris Finance Fusion API

This is the Azure Functions API backend for the Tetris Finance Fusion application. It provides RESTful endpoints for managing player data, leaderboards, and administrative functions.

## Architecture

- **Azure Functions**: Serverless API endpoints
- **Cosmos DB**: NoSQL database for player data storage
- **TypeScript**: Type-safe development
- **Azure Static Web Apps**: Hosting and deployment

## API Endpoints

### Players API (`/api/players`)

#### GET `/api/players`
Get all players (leaderboard)
- **Response**: Array of Player objects sorted by score (descending)

#### GET `/api/players?id={playerId}`
Get specific player by ID
- **Parameters**: `id` - Player ID
- **Response**: Player object

#### POST `/api/players`
Create new player score
- **Body**: Player object (Partial<Player>)
- **Response**: Created Player object

#### PUT `/api/players?id={playerId}`
Update player score
- **Parameters**: `id` - Player ID
- **Body**: Player object (Partial<Player>)
- **Response**: Updated Player object

#### DELETE `/api/players?id={playerId}`
Delete player
- **Parameters**: `id` - Player ID
- **Response**: 204 No Content

### Admin API (`/api/admin`)

#### GET `/api/admin?action=stats`
Get database statistics
- **Response**: AdminStats object with totals and averages

#### POST `/api/admin?action=export`
Export all data
- **Response**: ExportData object with timestamp and all player records

#### DELETE `/api/admin?action=clear-all`
Clear all player data
- **Response**: Success message with count of deleted records

## Data Models

### Player
```typescript
interface Player {
  id: string;
  name: string;
  score: number;
  level: number;
  linesCleared: number;
  gameTime: number;
  timestamp: string;
  gameData?: any;
  // Additional fields
  email?: string;
  company?: string;
  realName?: string;
  tetrises?: number;
  piecesPlaced?: number;
  averageReactionTime?: number;
  inputAccuracy?: number;
  gameplayIntensity?: number;
  linesPerMinute?: number;
  piecesPerMinute?: number;
  gameMode?: 'single' | 'multiplayer';
}
```

### AdminStats
```typescript
interface AdminStats {
  totalPlayers: number;
  totalScore: number;
  averageScore: number;
  topScore: number;
}
```

### ExportData
```typescript
interface ExportData {
  timestamp: string;
  totalRecords: number;
  data: Player[];
}
```

## Local Development

### Prerequisites
- Node.js 16+
- Azure Functions Core Tools 4
- Azure CLI (for deployment)

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `local.settings.json`:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "UseDevelopmentStorage=true",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "COSMOSDB_ENDPOINT": "your-cosmosdb-endpoint",
       "COSMOSDB_KEY": "your-cosmosdb-key",
       "COSMOSDB_DATABASE": "tetris-finance-fusion",
       "COSMOSDB_CONTAINER": "players"
     }
   }
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

4. The API will be available at `http://localhost:7071/api/`

### Testing
```bash
# Test players endpoint
curl http://localhost:7071/api/players

# Test admin stats
curl http://localhost:7071/api/admin?action=stats

# Create a test player
curl -X POST http://localhost:7071/api/players \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Player",
    "score": 1000,
    "level": 1,
    "linesCleared": 10,
    "gameTime": 120
  }'
```

## Deployment

### Azure Functions Deployment
1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Azure:
   ```bash
   func azure functionapp publish your-function-app-name
   ```

### Environment Variables
Set these in your Azure Function App configuration:
- `COSMOSDB_ENDPOINT`: Your Cosmos DB endpoint
- `COSMOSDB_KEY`: Your Cosmos DB primary key
- `COSMOSDB_DATABASE`: Database name
- `COSMOSDB_CONTAINER`: Container name

## Security

### Authentication
Currently using anonymous access. For production, consider:
- Azure AD authentication
- API keys
- Function-level authentication

### CORS
Configure CORS in Azure Static Web Apps:
- Allowed origins: Your frontend domain
- Allowed methods: GET, POST, PUT, DELETE
- Allowed headers: Content-Type, Authorization

### Data Validation
- Input validation on all endpoints
- SQL injection protection (Cosmos DB handles this)
- Rate limiting (consider Azure API Management)

## Monitoring

### Application Insights
Enable Application Insights for:
- Request/response monitoring
- Performance metrics
- Error tracking
- Custom telemetry

### Logging
- Function execution logs
- Cosmos DB operation logs
- Custom application logs

## Performance

### Cosmos DB Optimization
- Use appropriate partition keys
- Optimize queries with indexes
- Monitor RU consumption
- Use serverless mode for development

### Caching
Consider implementing:
- Redis Cache for frequently accessed data
- CDN for static assets
- Browser caching headers

## Error Handling

### HTTP Status Codes
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include unit tests
4. Update documentation
5. Follow Azure Functions patterns

## Support

For issues and questions:
- Azure Functions Documentation: [https://docs.microsoft.com/azure/azure-functions/](https://docs.microsoft.com/azure/azure-functions/)
- Cosmos DB Documentation: [https://docs.microsoft.com/azure/cosmos-db/](https://docs.microsoft.com/azure/cosmos-db/)
- Azure Support: [https://azure.microsoft.com/support/](https://azure.microsoft.com/support/) 