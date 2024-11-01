const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
      // You can add other transformer options here if needed
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'db'), // Exclude 'db' from asset extensions if needed
      sourceExts: [...sourceExts, 'cjs'], // Add 'cjs' to the source extensions
    },
    watchFolders: [
      // Add additional watch folders if needed
      // Example: path.resolve(__dirname, 'path/to/your/folder')
    ],
  };
})();
