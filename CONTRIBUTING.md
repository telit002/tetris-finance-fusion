# Contributing to Tetris Finance Fusion 🎮

Thank you for your interest in contributing to Tetris Finance Fusion! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome contributions in the following areas:

- **🐛 Bug Fixes**: Report and fix bugs
- **✨ New Features**: Add new game features or improvements
- **📊 Analytics**: Enhance data visualization and tracking
- **🎨 UI/UX**: Improve user interface and experience
- **📚 Documentation**: Update docs, add examples, improve guides
- **🧪 Testing**: Add tests, improve test coverage
- **🔧 Infrastructure**: Improve build process, deployment, CI/CD
- **🌐 Localization**: Add translations for different languages

### Before You Start

1. **Check existing issues**: Look for existing issues or discussions
2. **Discuss changes**: Open an issue to discuss major changes
3. **Follow the code style**: Read the development guidelines below

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and Azure

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/tetris-finance-fusion.git
   cd tetris-finance-fusion
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd api && npm install && cd ..
   ```

3. **Set up environment**
   ```bash
   # Copy example settings
   cp api/local.settings.json.example api/local.settings.json
   # Edit with your local settings
   ```

4. **Start development servers**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: API (optional)
   cd api && npm run start
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use strict mode, proper typing
- **React**: Functional components with hooks
- **Naming**: Use descriptive names, follow conventions
- **Comments**: Add comments for complex logic
- **Formatting**: Use Prettier and ESLint

### Commit Messages

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build process, tooling changes

Examples:
```
feat(game): add new tetromino piece
fix(api): resolve CORS issue with Azure Functions
docs(readme): update deployment instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new features
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run test
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link related issues
   - Request reviews from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=TetrisGame
```

### Writing Tests

- Use Jest and React Testing Library
- Test user interactions, not implementation
- Aim for good test coverage
- Write meaningful test descriptions

Example test:
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import TetrisGame from '../TetrisGame';

test('should start game when start button is clicked', () => {
  render(<TetrisGame playerNumber={1} playerName="Test Player" />);
  
  const startButton = screen.getByText('Start Game');
  fireEvent.click(startButton);
  
  expect(screen.getByText('Game Started')).toBeInTheDocument();
});
```

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try to reproduce the bug
3. Check if it's a known issue

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g. Windows 10, macOS 12]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 18.0.0]
- Version: [e.g. 1.0.0]

## Screenshots
Add screenshots if applicable

## Additional Context
Any other context about the problem
```

## 💡 Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Consider if it fits the project scope
3. Think about implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other approaches you considered

## Additional Context
Any other relevant information
```

## 📚 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep documentation up to date

### Areas to Document

- **README.md**: Project overview, setup, usage
- **API Documentation**: Endpoint descriptions, examples
- **Component Documentation**: Props, usage examples
- **Deployment Guides**: Step-by-step deployment instructions

## 🏷️ Issue Labels

We use the following labels:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issues
- `priority: low`: Low priority issues

## 🎯 Getting Help

### Questions and Discussions

- **GitHub Discussions**: For questions and general discussion
- **GitHub Issues**: For bugs and feature requests
- **Discord/Slack**: Join our community channels

### Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🏆 Recognition

Contributors will be recognized in:

- **README.md**: Contributors section
- **Release Notes**: Credit for significant contributions
- **GitHub Profile**: Public contribution graph

## 📄 License

By contributing to Tetris Finance Fusion, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to Tetris Finance Fusion! Your contributions help make this project better for everyone in the Tetris and finance communities.

---

**Happy coding! 🎮💻** 