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
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const cosmosClient_1 = require("./cosmosClient");
functions_1.app.http('admin', {
    methods: ['GET', 'POST', 'DELETE'],
    authLevel: 'anonymous',
    handler: (request, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = request.method;
            const url = new URL(request.url);
            const action = url.searchParams.get('action');
            switch (method) {
                case 'GET':
                    if (action === 'stats') {
                        // Get database statistics
                        const { resources: players } = yield cosmosClient_1.container.items
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
                        const { resources: players } = yield cosmosClient_1.container.items
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
                        const { resources: players } = yield cosmosClient_1.container.items
                            .query('SELECT * FROM c')
                            .fetchAll();
                        for (const player of players) {
                            yield cosmosClient_1.container.item(player.id, player.id).delete();
                        }
                        return { jsonBody: { message: `Deleted ${players.length} records` } };
                    }
                    return { status: 400, body: 'Invalid action' };
                default:
                    return { status: 405, body: 'Method not allowed' };
            }
        }
        catch (error) {
            context.error('Error in admin function:', error);
            return { status: 500, body: 'Internal server error' };
        }
    })
});
//# sourceMappingURL=admin.js.map