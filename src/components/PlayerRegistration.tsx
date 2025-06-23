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
    <Card className="w-full max-w-md mx-auto bg-white border-gray-200 shadow-xl transform hover:scale-105 transition-transform duration-200">
      <CardHeader className="text-center text-white rounded-t-lg" style={{ background: 'linear-gradient(315deg, #FF4B4B 0%, #FF744F 100%)' }}>
        <div className="flex justify-center mb-4">
          <div className="h-10 w-36 bg-white px-3 py-2 rounded shadow-sm flex items-center justify-center">
            <img 
              src="/valantic-logo.JPG" 
              alt="Valantic Logo" 
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Player {playerNumber}</CardTitle>
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
              className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
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
              className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
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
              className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
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
              className="border-gray-300 focus:border-red-500 focus:ring-red-500 transition-colors"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
            style={{ background: 'linear-gradient(315deg, #FF4B4B 0%, #FF744F 100%)' }}
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
