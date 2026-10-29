const fs = require('fs');
const PathLocator = require('../utils/path-locator');

/**
 * Resolves high-resolution authentic brand assets and prepares base64 data URIs.
 */
class AssetResolver {
  static getSparkPngDataUri() {
    const pngPath = PathLocator.getProjectAsset('icons/gemini_spark.png');
    if (!fs.existsSync(pngPath)) {
      throw new Error(`Asset not found: ${pngPath}`);
    }
    const base64 = fs.readFileSync(pngPath).toString('base64');
    return `data:image/png;base64,${base64}`;
  }

  static getSparkSvgContent() {
    const svgPath = PathLocator.getProjectAsset('spark.svg');
    if (!fs.existsSync(svgPath)) {
      throw new Error(`SVG asset not found: ${svgPath}`);
    }
    return fs.readFileSync(svgPath, 'utf8');
  }
}

module.exports = AssetResolver;
