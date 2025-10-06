# Deployment Guide - GitHub Actions & Netlify

## Overview

This project is configured for automatic deployment using GitHub Actions and Netlify. The setup includes CI/CD pipeline with linting, testing, and automatic deployments.

## Setup Instructions

### 1. Netlify Setup

1. **Create Netlify Account**
   - Go to [netlify.com](https://netlify.com) and sign up
   - Connect your GitHub account

2. **Create New Site**
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Get Netlify Credentials**
   - Go to Site Settings → General → Site details
   - Copy the **Site ID**
   - Go to User Settings → Applications → Personal access tokens
   - Create a new token and copy the **Auth Token**

### 2. GitHub Secrets Configuration

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```bash
# Netlify Configuration
NETLIFY_AUTH_TOKEN=your-netlify-auth-token
NETLIFY_SITE_ID=your-netlify-site-id

# Application Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://api.your-domain.com/graphql

# Optional: Add your actual API endpoints
NEXTAUTH_URL=https://your-domain.netlify.app
NEXTAUTH_SECRET=your-nextauth-secret
```

### 3. Environment Variables

The project uses different environment configurations:

- **Development**: Uses `.env.local` (create locally)
- **Production**: Uses GitHub Secrets and Netlify environment variables
- **Preview**: Uses GitHub Secrets for PR previews

### 4. GitHub Actions Workflow

The workflow (`.github/workflows/deploy.yml`) includes:

1. **Lint and Test Job**
   - Runs on every push and PR
   - Executes linting and type checking
   - Runs tests (when implemented)

2. **Build and Deploy Job**
   - Runs only on push to main branch (CD enabled)
   - Builds the application
   - Deploys to Netlify production

3. **Build Preview Job**
   - Runs only on pull requests targeting main branch
   - Creates preview deployments
   - Comments on PR with preview URL

## Deployment Process

### Automatic Deployment

1. Push to `main` branch → Automatic production deployment (CD enabled)
2. Push to `develop` branch → CI only (linting, type checking, tests)
3. Create PR targeting `main` → Automatic preview deployment
4. Create PR targeting `develop` → CI only (no deployment)

### Manual Deployment (Optional)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to production
npm run deploy:netlify

# Deploy preview
npm run deploy:preview
```

## Configuration Files

### netlify.toml

- Build configuration
- Redirect rules
- Security headers
- Cache settings

### .github/workflows/deploy.yml

- CI/CD pipeline
- Environment setup
- Deployment steps

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify environment variables are set
   - Review build logs in GitHub Actions

2. **Deployment Failures**
   - Verify Netlify credentials
   - Check site ID and auth token
   - Review Netlify deployment logs

3. **Environment Variables**
   - Ensure all required variables are set
   - Check variable naming conventions
   - Verify values are correct

### Build Optimization

The configuration includes:

- Caching for faster builds
- Security headers
- Optimized redirects
- Static asset caching

## Monitoring

- **GitHub Actions**: Check workflow runs in repository
- **Netlify**: Monitor deployments in Netlify dashboard
- **Analytics**: Set up Google Analytics (optional)

## Security Considerations

- Never commit sensitive data to repository
- Use GitHub Secrets for all sensitive variables
- Enable branch protection rules
- Regularly rotate access tokens
- Review and update dependencies

## Next Steps

1. Set up monitoring and analytics
2. Configure custom domain (if needed)
3. Set up SSL certificates
4. Configure backup strategies
5. Set up error tracking (Sentry, etc.)
