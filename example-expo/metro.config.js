const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const root = path.resolve(__dirname, '..');
const config = getDefaultConfig(__dirname);

// Monorepo: watch the library root and resolve from both node_modules
config.watchFolders = [root];
config.resolver.nodeModulesPaths = [
  path.join(__dirname, 'node_modules'),
  path.join(root, 'node_modules'),
];

// Resolve react-native-iroh-spike from its src/ via the package.json
// exports condition (same trick as the vanilla example's monorepo config)
config.resolver.unstable_conditionNames = [
  ...(config.resolver.unstable_conditionNames ?? []),
  'react-native-iroh-spike-source',
];

module.exports = config;
