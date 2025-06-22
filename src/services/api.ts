import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-azure-function-app.azurewebsites.net/api'
  : 'http://localhost:7071/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Player {
  id: string;
  name: string;
  score: number;
  level: number;
  linesCleared: number;
  gameTime: number;
  timestamp: string;
  gameData?: any;
  // Additional fields for extended functionality
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

export interface AdminStats {
  totalPlayers: number;
  totalScore: number;
  averageScore: number;
  topScore: number;
}

export interface ExportData {
  timestamp: string;
  totalRecords: number;
  data: Player[];
}

// Player API functions
export const playerAPI = {
  // Get all players (leaderboard)
  getLeaderboard: async (): Promise<Player[]> => {
    const response = await api.get('/players');
    return response.data;
  },

  // Get specific player
  getPlayer: async (id: string): Promise<Player> => {
    const response = await api.get(`/players?id=${id}`);
    return response.data;
  },

  // Create new player score
  createPlayer: async (player: Partial<Player>): Promise<Player> => {
    const response = await api.post('/players', player);
    return response.data;
  },

  // Update player score
  updatePlayer: async (id: string, player: Partial<Player>): Promise<Player> => {
    const response = await api.put(`/players?id=${id}`, player);
    return response.data;
  },

  // Delete player
  deletePlayer: async (id: string): Promise<void> => {
    await api.delete(`/players?id=${id}`);
  },
};

// Admin API functions
export const adminAPI = {
  // Get database statistics
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin?action=stats');
    return response.data;
  },

  // Export all data
  exportData: async (): Promise<ExportData> => {
    const response = await api.post('/admin?action=export');
    return response.data;
  },

  // Clear all data
  clearAllData: async (): Promise<{ message: string }> => {
    const response = await api.delete('/admin?action=clear-all');
    return response.data;
  },
};

export default api; 