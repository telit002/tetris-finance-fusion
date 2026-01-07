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
functions_1.app.http('players', {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    authLevel: 'anonymous',
    handler: (request, context) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const method = request.method;
            const url = new URL(request.url);
            const playerId = url.searchParams.get('id');
            switch (method) {
                case 'GET':
                    if (playerId) {
                        // Get specific player
                        const { resource } = yield cosmosClient_1.container.item(playerId, playerId).read();
                        return { jsonBody: resource };
                    }
                    else {
                        // Get all players (leaderboard)
                        const { resources } = yield cosmosClient_1.container.items
                            .query('SELECT * FROM c ORDER BY c.score DESC')
                            .fetchAll();
                        return { jsonBody: resources };
                    }
                case 'POST':
                    // Create new player score
                    const newPlayerData = yield request.json();
                    const newPlayer = {
                        id: newPlayerData.id || `player_${Date.now()}`,
                        name: newPlayerData.name || 'Anonymous',
                        score: newPlayerData.score || 0,
                        level: newPlayerData.level || 1,
                        linesCleared: newPlayerData.linesCleared || 0,
                        gameTime: newPlayerData.gameTime || 0,
                        timestamp: new Date().toISOString(),
                        gameData: newPlayerData.gameData
                    };
                    const { resource: createdPlayer } = yield cosmosClient_1.container.items.create(newPlayer);
                    return { jsonBody: createdPlayer, status: 201 };
                case 'PUT':
                    // Update player score
                    if (!playerId) {
                        return { status: 400, body: 'Player ID required' };
                    }
                    const updatedPlayerData = yield request.json();
                    const updatedPlayer = Object.assign(Object.assign({}, updatedPlayerData), { id: playerId, timestamp: new Date().toISOString() });
                    const { resource: updated } = yield cosmosClient_1.container.item(playerId, playerId).replace(updatedPlayer);
                    return { jsonBody: updated };
                case 'DELETE':
                    // Delete player
                    if (!playerId) {
                        return { status: 400, body: 'Player ID required' };
                    }
                    yield cosmosClient_1.container.item(playerId, playerId).delete();
                    return { status: 204 };
                default:
                    return { status: 405, body: 'Method not allowed' };
            }
        }
        catch (error) {
            context.error('Error in players function:', error);
            return { status: 500, body: 'Internal server error' };
        }
    })
});
//# sourceMappingURL=players.js.map