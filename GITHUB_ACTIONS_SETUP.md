# GitHub Actions CI/CD Setup Guide

## 🚀 Pipeline Overview

Your repository now includes comprehensive GitHub Actions workflows for automated CI/CD:

### Workflows Created

1. **`ci.yml`** - Essential CI pipeline
   - Linting with ESLint
   - TypeScript type checking
   - Test execution
   - Next.js build process

2. **`code-quality.yml`** - Code quality checks
   - Prettier formatting
   - Security audits
   - Dependency analysis
   - Bundle size analysis

3. **`deploy.yml`** - Production deployment
   - Pre-deployment testing
   - Build verification
   - Deployment (needs configuration)

4. **`ci-cd.yml`** - Complete pipeline
   - Full CI/CD with preview deployments
   - Production deployment automation

## ⚙️ Required Setup

### 1. GitHub Repository Secrets

Go to your repository: `Settings > Secrets and variables > Actions`

Add these secrets:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=your_sanity_read_token
```

### 2. Choose Deployment Platform

Uncomment the relevant section in `.github/workflows/deploy.yml`:

#### For Vercel (Recommended):
```yaml
# Add these secrets:
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id  
VERCEL_PROJECT_ID=your_project_id
```

#### For Netlify:
```yaml
# Add these secrets:
NETLIFY_AUTH_TOKEN=your_netlify_token
NETLIFY_SITE_ID=your_site_id
```

### 3. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. GitHub Actions should be automatically enabled

## 🔧 Manual Setup Required

Since workflow files require special permissions, you'll need to:

1. **Push the workflow files manually** through GitHub's web interface, or
2. **Update your GitHub token** to include `workflow` scope, or  
3. **Create the workflows directly on GitHub**

### Option 1: GitHub Web Interface
1. Go to your repository on GitHub
2. Create `.github/workflows/` directory
3. Add each workflow file manually

### Option 2: Update Token Permissions
If using a Personal Access Token, ensure it has `workflow` scope enabled.

## 📊 Workflow Status Badges

Once workflows are active, add these to your README.md:

```markdown
![CI](https://github.com/kylerdohmen/k-and-k-designs-website/workflows/Continuous%20Integration/badge.svg)
![Deploy](https://github.com/kylerdohmen/k-and-k-designs-website/workflows/Deploy%20to%20Production/badge.svg)
```

## 🛡️ Branch Protection (Recommended)

Set up branch protection for `main`:

1. Go to `Settings > Branches`
2. Add rule for `main` branch
3. Enable:
   - Require status checks to pass
   - Require pull request reviews
   - Require branches to be up to date

## 🚨 Next Steps

1. **Add the workflow files** to your repository (see manual setup above)
2. **Configure secrets** in GitHub repository settings
3. **Choose and configure deployment platform**
4. **Test the pipeline** by making a small commit
5. **Set up branch protection rules**

The workflows are designed to work with your current project structure and will automatically run when you push code or create pull requests.