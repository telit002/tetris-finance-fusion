
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad } from 'lucide-react';

interface PlayerData {
  nickname: string;
  email?: string;
  company?: string;
  realName?: string;
}

interface PlayerRegistrationProps {
  onPlayerReady: (playerData: PlayerData) => void;
  playerNumber: number;
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onPlayerReady, playerNumber }) => {
  const [playerData, setPlayerData] = useState<PlayerData>({
    nickname: '',
    email: '',
    company: '',
    realName: ''
  });

  const handleInputChange = (field: keyof PlayerData, value: string) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerData.nickname.trim()) {
      onPlayerReady(playerData);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white border-gray-200 shadow-lg">
      <CardHeader className="text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex justify-center mb-4">
          <img 
            src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=120&h=40&fit=crop&crop=center"
            alt="Valantic Logo"
            className="h-10 w-auto bg-white px-2 py-1 rounded"
          />
        </div>
        <CardTitle className="text-2xl">Player {playerNumber}</CardTitle>
        <CardDescription className="text-purple-100">
          Join the Valantic Digital Finance Tetris Championship
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`nickname-${playerNumber}`} className="text-gray-700 font-medium">
              Nickname *
            </Label>
            <Input
              id={`nickname-${playerNumber}`}
              type="text"
              value={playerData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Enter your gaming nickname"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`email-${playerNumber}`} className="text-gray-700 font-medium">
              Email (Optional)
            </Label>
            <Input
              id={`email-${playerNumber}`}
              type="email"
              value={playerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@company.com"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <Label htmlFor={`company-${playerNumber}`} className="text-gray-700 font-medium">
              Company (Optional)
            </Label>
            <Input
              id={`company-${playerNumber}`}
              type="text"
              value={playerData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your company name"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <Label htmlFor={`realName-${playerNumber}`} className="text-gray-700 font-medium">
              Real Name (Optional)
            </Label>
            <Input
              id={`realName-${playerNumber}`}
              type="text"
              value={playerData.realName}
              onChange={(e) => handleInputChange('realName', e.target.value)}
              placeholder="Your real name"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
            disabled={!playerData.nickname.trim()}
          >
            <Gamepad className="w-5 h-5 mr-2" />
            Ready to Play!
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerRegistration;
