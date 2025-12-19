import axios from 'axios';

// In production (Static Web Apps), use the built-in `/api` route of the deployed app:
//   https://black-field-07a75c203.6.azurestaticapps.net/api
// In development, keep using the local Functions host.
// Detect production at runtime based on the deployed hostname instead of using import.meta types.
const isDeployedStaticWebApp =
  typeof window !== 'undefined' &&
  window.location.hostname.endsWith('.azurestaticapps.net');

const API_BASE_URL = isDeployedStaticWebApp ? '/api' : 'http://localhost:7071/api';

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