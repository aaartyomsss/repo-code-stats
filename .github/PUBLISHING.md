# Publishing Setup Guide

This repository is configured for automatic publishing to npm when code is merged to the `main` branch.

## 🚀 How the Pipeline Works

1. **On every push/PR**: Tests run on Node.js 18.x and 20.x
2. **On push to main**: If the version in `package.json` has changed, automatically:
   - Publishes to npm
   - Creates a GitHub release with the new version tag

## 🔧 Initial Setup Required

### 1. NPM Authentication

You need to set up an NPM token for publishing:

1. **Create an NPM account** at [npmjs.com](https://www.npmjs.com)
2. **Generate an access token**:
   ```bash
   npm login
   npm token create --access public
   ```
3. **Add the token to GitHub Secrets**:
   - Go to your repository on GitHub
   - Navigate to Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your NPM token from step 2

### 2. Package Name (if needed)

If the package name `repo-code-stats` is already taken on npm:

1. Update the `name` field in `package/package.json`
2. Choose a unique name (you can check availability with `npm view <package-name>`)

## 📦 Publishing Workflow

### Method 1: Version Bump Scripts (Recommended)

```bash
# For bug fixes
npm run bump:patch

# For new features
npm run bump:minor

# For breaking changes
npm run bump:major
```

Then commit and push:

```bash
git add package.json
git commit -m "bump version to X.X.X"
git push origin main
```

### Method 2: Manual Version Update

1. Edit `package/package.json` and update the `version` field
2. Commit and push to main:
   ```bash
   git add package.json
   git commit -m "release version X.X.X"
   git push origin main
   ```

## 🔍 What Happens Next

1. **GitHub Actions triggers** when you push to main
2. **Tests run** to ensure everything works
3. **Version check** compares package.json version with published version
4. **If version is new**:
   - Package builds and publishes to npm
   - GitHub release is created automatically
5. **If version exists**: Nothing happens (prevents accidental republishing)

## 📋 Pre-Publish Checklist

Before pushing to main, ensure:

- [ ] Version number is updated in `package.json`
- [ ] `README.md` is updated with any new features
- [ ] All tests pass locally: `npm test`
- [ ] Build works: `npm run build`
- [ ] Changes are documented

## 🛠️ Local Testing

Test the build process locally:

```bash
cd package
npm run clean
npm run build
npm pack  # Creates a .tgz file you can inspect
```

## 📚 NPM Scripts Available

- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove dist folder
- `npm test` - Run tests
- `npm run bump:patch/minor/major` - Bump version and get instructions
- `npm run prepublishOnly` - Runs automatically before publishing

## 🚨 Troubleshooting

### Build Fails

- Check TypeScript compilation: `npm run build`
- Verify all dependencies are installed: `npm ci`

### Publish Fails

- Verify NPM_TOKEN is set correctly in GitHub Secrets
- Check if package name is available on npm
- Ensure version number is higher than current published version

### Tests Fail

- Run tests locally: `npm test`
- Check if all dependencies are properly imported
- Verify file paths in test files

## 🔄 Updating Dependencies

To update dependencies:

```bash
npm update
npm audit fix
```

Remember to test after updates and commit the changes to `package-lock.json`.
