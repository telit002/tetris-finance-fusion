# Tetris Finance Fusion 🎮💰

A modern, multiplayer Tetris game with real-time analytics and financial data visualization, built with React, TypeScript, and Azure cloud services.

![Tetris Finance Fusion](https://img.shields.io/badge/Tetris-Finance%20Fusion-blue?style=for-the-badge&logo=game-controller)
![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Azure](https://img.shields.io/badge/Azure-Functions-blue?style=for-the-badge&logo=microsoft-azure)

## 🎯 Features

### 🎮 Game Features
- **Classic Tetris Gameplay**: Full Tetris implementation with all 7 tetromino pieces
- **Multiplayer Support**: 1-2 player modes with real-time competition
- **Advanced Controls**: Keyboard and gamepad support
- **Real-time Analytics**: Live performance tracking and statistics
- **Responsive Design**: Works on desktop and mobile devices

### 📊 Analytics & Data
- **Performance Tracking**: Reaction time, accuracy, and gameplay intensity
- **Leaderboard System**: Global and local player rankings
- **Real-time Dashboard**: Live game statistics and visualizations
- **Data Export**: Admin tools for data management and export

### ☁️ Cloud Integration
- **Azure Functions**: Serverless API backend
- **Cosmos DB**: Scalable NoSQL database
- **Azure Static Web Apps**: Global hosting and CDN
- **Real-time Updates**: WebSocket integration for live data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Azure account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/telit002/tetris-finance-fusion.git
   cd tetris-finance-fusion
   ```

2. **Install dependencies**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install API dependencies
   cd api && npm install && cd ..
   ```

3. **Configure environment**
   ```bash
   # Copy and configure API settings
   cp api/local.settings.json.example api/local.settings.json
   # Edit api/local.settings.json with your Cosmos DB credentials
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Start frontend
   npm run dev
   
   # Terminal 2: Start API (optional for local development)
   cd api && npm run start
   ```

5. **Open your browser**
   - Frontend: http://localhost:8081
   - API: http://localhost:7071/api

## 🏗️ Project Structure

```
tetris-finance-fusion/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── ui/            # Shadcn/ui components
│   │   ├── TetrisGame.tsx # Main game component
│   │   ├── Leaderboard.tsx # Player rankings
│   │   └── AdminPanel.tsx # Admin interface
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   └── pages/             # Page components
├── api/                   # Azure Functions backend
│   ├── src/               # TypeScript source
│   │   ├── players.ts     # Player API endpoints
│   │   ├── admin.ts       # Admin API endpoints
│   │   └── cosmosClient.ts # Database client
│   └── local.settings.json # Local configuration
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🎮 How to Play

### Controls
- **← →**: Move piece left/right
- **↓**: Soft drop (move down faster)
- **↑ / Space**: Rotate piece
- **Z**: Hard drop (instant placement)
- **Gamepad**: Xbox controller support

### Game Modes
1. **Single Player**: Classic Tetris with analytics
2. **Multiplayer**: 1v1 competitive mode
3. **Practice**: Training mode with detailed stats

### Scoring System
- **Line Clear**: 100 points per line
- **Tetris (4 lines)**: 1000 points bonus
- **Level Progression**: Speed increases with level
- **Accuracy Bonus**: Points for precise placement

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:7071/api
VITE_WS_URL=ws://localhost:7071
```

#### API (api/local.settings.json)
```json
{
  "COSMOSDB_ENDPOINT": "your-cosmosdb-endpoint",
  "COSMOSDB_KEY": "your-cosmosdb-key",
  "COSMOSDB_DATABASE": "tetris-finance-fusion",
  "COSMOSDB_CONTAINER": "players"
}
```

### Admin Access
- **Default Password**: `admin123`
- **Access**: Click "Show Admin Panel" in the app
- **Features**: Statistics, data export, user management

## 🚀 Deployment

### Azure Deployment
Follow the complete deployment guide in [DEPLOYMENT.md](./DEPLOYMENT.md)

Quick deployment commands:
```bash
# Create Azure resources
az group create --name tetris-finance-fusion-rg --location "West Europe"
az cosmosdb create --name tetris-finance-fusion-db --resource-group tetris-finance-fusion-rg

# Deploy to Azure Static Web Apps
az staticwebapp create --name tetris-finance-fusion-app --resource-group tetris-finance-fusion-rg --source .
```

### Other Platforms
- **Vercel**: Connect GitHub repository
- **Netlify**: Deploy from Git
- **AWS**: Use Amplify or S3 + CloudFront

## 📊 API Documentation

### Players API
- `GET /api/players` - Get leaderboard
- `POST /api/players` - Save player score
- `PUT /api/players?id={id}` - Update player
- `DELETE /api/players?id={id}` - Delete player

### Admin API
- `GET /api/admin?action=stats` - Get statistics
- `POST /api/admin?action=export` - Export data
- `DELETE /api/admin?action=clear-all` - Clear all data

Full API documentation: [api/README.md](./api/README.md)

## 🎨 Customization

### Colors
The app uses a custom color palette defined in CSS variables:
```css
--primary: #FF4B4B;
--secondary: #FF744F;
--accent: #3C4BC8;
--background: #100C2A;
```

### Styling
- **Framework**: Tailwind CSS
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commits
- Add tests for new features
- Update documentation

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tetris**: Original game by Alexey Pajitnov
- **React**: UI framework by Meta
- **Azure**: Cloud services by Microsoft
- **Shadcn/ui**: Beautiful component library
- **Valantic**: Digital finance inspiration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/telit002/tetris-finance-fusion/issues)
- **Discussions**: [GitHub Discussions](https://github.com/telit002/tetris-finance-fusion/discussions)
- **Email**: your-email@example.com

## 🗺️ Roadmap

- [ ] **Mobile App**: React Native version
- [ ] **AI Opponents**: Machine learning bots
- [ ] **Tournaments**: Organized competitions
- [ ] **Social Features**: Friends and chat
- [ ] **Advanced Analytics**: Predictive insights
- [ ] **Blockchain Integration**: NFT achievements

---

**Made with ❤️ for the Tetris and finance communities**

[![GitHub stars](https://img.shields.io/github/stars/telit002/tetris-finance-fusion?style=social)](https://github.com/telit002/tetris-finance-fusion)
[![GitHub forks](https://img.shields.io/github/forks/telit002/tetris-finance-fusion?style=social)](https://github.com/telit002/tetris-finance-fusion)
[![GitHub issues](https://img.shields.io/github/issues/telit002/tetris-finance-fusion)](https://github.com/telit002/tetris-finance-fusion/issues)
