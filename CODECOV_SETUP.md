# Codecov Setup Guide

This guide explains how to set up Codecov for your NBX React project.

## Prerequisites

1. **GitHub Repository**: Your project should be hosted on GitHub
2. **Codecov Account**: You'll need a Codecov account (free for open source projects)
3. **Repository Token**: You'll need to get a Codecov token for your repository

## Setup Steps

### 1. Get Your Codecov Token

1. Go to [codecov.io](https://codecov.io)
2. Sign in with your GitHub account
3. Navigate to your repository settings
4. Copy your repository token

### 2. Add Codecov Token to GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CODECOV_TOKEN`
5. Value: Your Codecov token from step 1
6. Click "Add secret"

### 3. Verify Configuration

The following files have been configured for Codecov integration:

- **`.github/workflows/deploy.yml`**: Updated to upload coverage reports to Codecov
- **`jest.config.js`**: Configured to generate lcov coverage reports
- **`README.md`**: Added Codecov badge and testing documentation

### 4. Test the Integration

Push a commit to your main or develop branch to trigger the CI pipeline. The workflow will:

1. Run tests with coverage
2. Generate coverage reports
3. Upload reports to Codecov
4. Update the coverage badge in your README

## Coverage Configuration

The project is configured with the following coverage thresholds:

```javascript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
}
```

You can adjust these thresholds in `jest.config.js` based on your project requirements.

## Available Test Scripts

- `npm test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ci` - Run tests for CI with coverage

## Coverage Reports

Coverage reports are generated in multiple formats:

- **lcov**: For Codecov integration
- **text**: For console output
- **html**: For detailed HTML reports (view at `coverage/index.html`)

## Troubleshooting

### Codecov Upload Fails

If the Codecov upload fails in CI:

1. Check that your `CODECOV_TOKEN` secret is correctly set
2. Verify the token has the correct permissions
3. Check the GitHub Actions logs for specific error messages

### Coverage Not Showing

If coverage reports aren't being generated:

1. Ensure tests are passing
2. Check that `jest.config.js` has the correct coverage configuration
3. Verify the coverage directory exists after running tests

### Badge Not Updating

If the Codecov badge isn't updating:

1. Check that uploads are successful in CI
2. Verify the repository slug in the badge URL matches your repository
3. Ensure the badge URL uses the correct branch (main/develop)

## Additional Resources

- [Codecov Documentation](https://docs.codecov.com/)
- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#coveragethreshold-object)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
