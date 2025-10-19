#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get the version type from command line argument (patch, minor, major)
const versionType = process.argv[2] || 'patch';

if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('❌ Invalid version type. Use: patch, minor, or major');
  process.exit(1);
}

try {
  // Use npm version to bump the version
  execSync(`npm version ${versionType} --no-git-tag-version`, { stdio: 'inherit' });
  
  // Get the new version
  const newPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const newVersion = newPackageJson.version;
  
  console.log(`🚀 Version bumped to ${newVersion}`);
  console.log(`📝 Next steps:`);
  console.log(`   1. Review the changes`);
  console.log(`   2. Commit: git add package.json && git commit -m "bump version to ${newVersion}"`);
  console.log(`   3. Push to trigger release: git push origin main`);
  
} catch (error) {
  console.error('❌ Error bumping version:', error.message);
  process.exit(1);
}