import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { adminAPI, AdminStats } from '../services/api';

interface AdminPanelProps {
  className?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ className }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const ADMIN_PASSWORD = 'admin123'; // In production, use proper authentication

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
      fetchStats();
    } else {
      setError('Invalid password');
    }
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.getStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminAPI.exportData();
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tetris-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Data exported successfully');
    } catch (err) {
      setError('Failed to export data');
      console.error('Error exporting data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to delete ALL player data? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await adminAPI.clearAllData();
      setSuccess(result.message);
      fetchStats(); // Refresh stats
    } catch (err) {
      setError('Failed to clear data');
      console.error('Error clearing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setStats(null);
    setError(null);
    setSuccess(null);
  };

  if (!isAuthenticated) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            )}
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Panel
          </div>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            Logout
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Database Statistics
            </h3>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg border bg-gradient-to-r from-[#FF4B4B] to-[#FF744F] text-white">
                  <div className="text-2xl font-bold">{stats.totalPlayers}</div>
                  <div className="text-sm opacity-90">Total Players</div>
                </div>
                <div className="p-3 rounded-lg border bg-gradient-to-r from-[#FF4B4B] to-[#FF744F] text-white">
                  <div className="text-2xl font-bold">{stats.totalScore.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Total Score</div>
                </div>
                <div className="p-3 rounded-lg border bg-gradient-to-r from-[#FF4B4B] to-[#FF744F] text-white">
                  <div className="text-2xl font-bold">{Math.round(stats.averageScore)}</div>
                  <div className="text-sm opacity-90">Average Score</div>
                </div>
                <div className="p-3 rounded-lg border bg-gradient-to-r from-[#FF4B4B] to-[#FF744F] text-white">
                  <div className="text-2xl font-bold">{stats.topScore.toLocaleString()}</div>
                  <div className="text-sm opacity-90">Top Score</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No statistics available
              </div>
            )}
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Admin Actions
            </h3>
            <div className="space-y-3">
              <Button 
                onClick={fetchStats} 
                variant="outline" 
                className="w-full"
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Statistics
              </Button>
              
              <Button 
                onClick={handleExportData} 
                variant="outline" 
                className="w-full"
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Data
              </Button>
              
              <Button 
                onClick={handleClearAllData} 
                variant="destructive" 
                className="w-full"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 p-3 rounded-lg border border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="flex items-center gap-2 text-green-600 p-3 rounded-lg border border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminPanel; 