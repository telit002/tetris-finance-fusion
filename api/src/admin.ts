import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { container, database } from './cosmosClient';

app.http('admin', {
  methods: ['GET', 'POST', 'DELETE'],
  authLevel: 'anonymous',
  handler: async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
    try {
      const method = request.method;
      const url = new URL(request.url);
      const action = url.searchParams.get('action');

      switch (method) {
        case 'GET':
          if (action === 'stats') {
            // Get database statistics
            const { resources: players } = await container.items
              .query('SELECT * FROM c')
              .fetchAll();
            
            const stats = {
              totalPlayers: players.length,
              totalScore: players.reduce((sum, p) => sum + (p.score || 0), 0),
              averageScore: players.length > 0 ? players.reduce((sum, p) => sum + (p.score || 0), 0) / players.length : 0,
              topScore: players.length > 0 ? Math.max(...players.map(p => p.score || 0)) : 0
            };
            
            return { jsonBody: stats };
          }
          return { status: 400, body: 'Invalid action' };

        case 'POST':
          if (action === 'export') {
            // Export all data
            const { resources: players } = await container.items
              .query('SELECT * FROM c')
              .fetchAll();
            
            const exportData = {
              timestamp: new Date().toISOString(),
              totalRecords: players.length,
              data: players
            };
            
            return { jsonBody: exportData };
          }
          return { status: 400, body: 'Invalid action' };

        case 'DELETE':
          if (action === 'clear-all') {
            // Clear all player data
            const { resources: players } = await container.items
              .query('SELECT * FROM c')
              .fetchAll();
            
            for (const player of players) {
              await container.item(player.id, player.id).delete();
            }
            
            return { jsonBody: { message: `Deleted ${players.length} records` } };
          }
          return { status: 400, body: 'Invalid action' };

        default:
          return { status: 405, body: 'Method not allowed' };
      }
    } catch (error) {
      context.error('Error in admin function:', error);
      return { status: 500, body: 'Internal server error' };
    }
  }
}); 