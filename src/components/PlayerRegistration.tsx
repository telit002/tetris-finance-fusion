
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
    <Card className="w-full max-w-md mx-auto bg-slate-900 border-slate-600">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Gamepad className="h-12 w-12 text-blue-400" />
        </div>
        <CardTitle className="text-2xl text-white">Player {playerNumber}</CardTitle>
        <CardDescription className="text-slate-300">
          Enter your details to start playing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor={`nickname-${playerNumber}`} className="text-white">
              Nickname *
            </Label>
            <Input
              id={`nickname-${playerNumber}`}
              type="text"
              value={playerData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              placeholder="Enter your gaming nickname"
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`email-${playerNumber}`} className="text-white">
              Email (Optional)
            </Label>
            <Input
              id={`email-${playerNumber}`}
              type="email"
              value={playerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@company.com"
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          
          <div>
            <Label htmlFor={`company-${playerNumber}`} className="text-white">
              Company (Optional)
            </Label>
            <Input
              id={`company-${playerNumber}`}
              type="text"
              value={playerData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your company name"
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          
          <div>
            <Label htmlFor={`realName-${playerNumber}`} className="text-white">
              Real Name (Optional)
            </Label>
            <Input
              id={`realName-${playerNumber}`}
              type="text"
              value={playerData.realName}
              onChange={(e) => handleInputChange('realName', e.target.value)}
              placeholder="Your real name"
              className="bg-slate-800 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!playerData.nickname.trim()}
          >
            Ready to Play!
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlayerRegistration;
