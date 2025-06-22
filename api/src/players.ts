import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { container, Player } from './cosmosClient';

app.http('players', {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const playerId = url.searchParams.get('id');

      switch (method) {
        case 'GET':
          if (playerId) {
            // Get specific player
            const { resource } = await container.item(playerId, playerId).read();
            return { jsonBody: resource };
          } else {
            // Get all players (leaderboard)
            const { resources } = await container.items
              .query('SELECT * FROM c ORDER BY c.score DESC')
              .fetchAll();
            return { jsonBody: resources };
          }

        case 'POST':
          // Create new player score
          const newPlayerData = await request.json() as Partial<Player>;
          const newPlayer: Player = {
            id: newPlayerData.id || `player_${Date.now()}`,
            name: newPlayerData.name || 'Anonymous',
            score: newPlayerData.score || 0,
            level: newPlayerData.level || 1,
            linesCleared: newPlayerData.linesCleared || 0,
            gameTime: newPlayerData.gameTime || 0,
            timestamp: new Date().toISOString(),
            gameData: newPlayerData.gameData
          };
          
          const { resource: createdPlayer } = await container.items.create(newPlayer);
          return { jsonBody: createdPlayer, status: 201 };

        case 'PUT':
          // Update player score
          if (!playerId) {
            return { status: 400, body: 'Player ID required' };
          }
          const updatedPlayerData = await request.json() as Partial<Player>;
          const updatedPlayer: Player = {
            ...updatedPlayerData,
            id: playerId,
            timestamp: new Date().toISOString()
          } as Player;
          
          const { resource: updated } = await container.item(playerId, playerId).replace(updatedPlayer);
          return { jsonBody: updated };

        case 'DELETE':
          // Delete player
          if (!playerId) {
            return { status: 400, body: 'Player ID required' };
          }
          await container.item(playerId, playerId).delete();
          return { status: 204 };

        default:
          return { status: 405, body: 'Method not allowed' };
      }
    } catch (error) {
      context.error('Error in players function:', error);
      return { status: 500, body: 'Internal server error' };
    }
  }
}); 