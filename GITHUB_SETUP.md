# GitHub Setup Guide 🚀

This guide will help you push your Tetris Finance Fusion project to GitHub.

## Step 1: Create a GitHub Repository

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in
2. **Create New Repository**: Click the "+" icon → "New repository"
3. **Repository Settings**:
   - **Repository name**: `tetris-finance-fusion`
   - **Description**: `A modern, multiplayer Tetris game with real-time analytics and Azure cloud services`
   - **Visibility**: Choose Public or Private
   - **Initialize**: ❌ **Don't** initialize with README (we already have one)
   - **Add .gitignore**: ❌ **Don't** add (we already have one)
   - **Choose a license**: ❌ **Don't** add (we already have MIT license)

4. **Click "Create repository"**

## Step 2: Connect Your Local Repository

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/tetris-finance-fusion.git

# Set the main branch as default
git branch -M main

# Push your code to GitHub
git push -u origin main
```

## Step 3: Verify Your Repository

1. **Check your repository**: Visit `https://github.com/YOUR_USERNAME/tetris-finance-fusion`
2. **Verify files**: You should see all your project files
3. **Check README**: The README should display properly with badges and formatting

## Step 4: Enable GitHub Actions (Optional)

If you want automated deployment to Azure:

1. **Go to Settings**: In your repository → Settings
2. **Secrets and variables**: Actions → Secrets and variables → Actions
3. **Add secrets**:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`: Your Azure deployment token
   - `VITE_API_URL`: Your production API URL

## Step 5: Set Up Branch Protection (Recommended)

1. **Go to Settings**: Repository → Settings → Branches
2. **Add rule**: Click "Add rule"
3. **Branch name pattern**: `main`
4. **Protections**:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging

## Step 6: Create Issues and Projects (Optional)

### Create Initial Issues
1. **Go to Issues**: Click "Issues" tab
2. **Create issues** for:
   - Bug reports
   - Feature requests
   - Documentation improvements

### Set Up Project Board
1. **Go to Projects**: Click "Projects" tab
2. **Create new project**: Choose "Board" or "Table"
3. **Add columns**: To Do, In Progress, Done
4. **Add issues**: Move issues to appropriate columns

## Step 7: Update Documentation

### Update README.md
Replace `yourusername` in the README with your actual GitHub username:

```markdown
# In README.md, update these URLs:
git clone https://github.com/YOUR_USERNAME/tetris-finance-fusion.git

# And these badge URLs:
[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/tetris-finance-fusion?style=social)](https://github.com/YOUR_USERNAME/tetris-finance-fusion)
[![GitHub forks](https://img.shields.io/github/forks/YOUR_USERNAME/tetris-finance-fusion?style=social)](https://github.com/YOUR_USERNAME/tetris-finance-fusion)
[![GitHub issues](https://img.shields.io/github/issues/YOUR_USERNAME/tetris-finance-fusion)](https://github.com/YOUR_USERNAME/tetris-finance-fusion/issues)
```

### Update API Configuration
In `src/services/api.ts`, update the production URL:

```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://YOUR_APP_NAME.azurestaticapps.net/api'
  : 'http://localhost:7071/api';
```

## Step 8: Push Updates

After making changes:

```bash
git add .
git commit -m "docs: update GitHub URLs and configuration"
git push
```

## Step 9: Enable GitHub Pages (Optional)

If you want to host a demo version:

1. **Go to Settings**: Repository → Settings → Pages
2. **Source**: Deploy from a branch
3. **Branch**: `main` → `/docs` or `/dist`
4. **Save**: Your site will be available at `https://YOUR_USERNAME.github.io/tetris-finance-fusion`

## Step 10: Share Your Repository

### Add Topics
In your repository settings, add topics:
- `tetris`
- `react`
- `typescript`
- `azure`
- `game`
- `multiplayer`
- `analytics`

### Create a Release
1. **Go to Releases**: Click "Releases" on the right
2. **Create a new release**: Click "Create a new release"
3. **Tag version**: `v1.0.0`
4. **Release title**: `Initial Release`
5. **Description**: Add release notes
6. **Publish release**

## Troubleshooting

### Common Issues

**"Repository not found"**
- Check the repository URL
- Ensure you have access to the repository
- Verify your GitHub credentials

**"Permission denied"**
- Use SSH keys or personal access tokens
- Check your Git configuration

**"Branch protection"**
- Ensure you're an admin of the repository
- Check branch protection rules

### Useful Commands

```bash
# Check remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/YOUR_USERNAME/tetris-finance-fusion.git

# Check branch status
git status

# View commit history
git log --oneline
```

## Next Steps

1. **Invite collaborators**: Add team members to your repository
2. **Set up CI/CD**: Configure GitHub Actions for automated deployment
3. **Add documentation**: Create wiki pages for detailed guides
4. **Community**: Engage with users through issues and discussions

## Support

- **GitHub Help**: [help.github.com](https://help.github.com)
- **Git Documentation**: [git-scm.com/doc](https://git-scm.com/doc)
- **GitHub Community**: [github.community](https://github.community)

---

**Your Tetris Finance Fusion project is now ready for the world! 🌍🎮** 