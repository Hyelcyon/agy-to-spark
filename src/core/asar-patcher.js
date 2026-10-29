const fs = require('fs');
const path = require('path');
const os = require('os');
const asar = require('@electron/asar');
const EngineTemplate = require('./engine-template');
const PathLocator = require('../utils/path-locator');

/**
 * Handles unpacking, patching preload.js, and repacking Electron asar archives.
 */
class AsarPatcher {
  /**
   * Applies the Gemini Spark patch to an asar archive.
   * @param {Object} options
   * @param {string} [options.sourceAsar] - Source app.asar path.
   * @param {string} [options.outputAsar] - Output app.asar path.
   * @param {boolean} [options.backup] - Whether to create an original backup.
   */
  static async applyPatch(options = {}) {
    const sourceAsar = options.sourceAsar || PathLocator.getLiveAsarPath();
    const outputAsar = options.outputAsar || sourceAsar;
    const shouldBackup = options.backup !== false;

    if (!fs.existsSync(sourceAsar)) {
      throw new Error(`Target asar file does not exist: ${sourceAsar}`);
    }

    if (shouldBackup) {
      const origBackup = `${sourceAsar}.original`;
      if (!fs.existsSync(origBackup)) {
        fs.copyFileSync(sourceAsar, origBackup);
      }
    }

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agy-spark-'));

    try {
      // 1. Extract asar archive
      asar.extractAll(sourceAsar, tempDir);

      // 2. Locate dist/preload.js
      const preloadPath = path.join(tempDir, 'dist', 'preload.js');
      if (!fs.existsSync(preloadPath)) {
        throw new Error(`Invalid Antigravity package: dist/preload.js not found in ${sourceAsar}`);
      }

      let content = fs.readFileSync(preloadPath, 'utf8');

      // 3. Strip any prior injection markers
      const marker = '/* ========================================================';
      const cutIdx = content.indexOf(marker);
      if (cutIdx !== -1) {
        content = content.substring(0, cutIdx).trimEnd();
      }

      // 4. Append fresh engine code
      const engineCode = EngineTemplate.getEngineCode();
      fs.writeFileSync(preloadPath, content + '\n' + engineCode, 'utf8');

      // 4.1 Patch dist/loadingOverlay.js with pure white Gemini Spark icon without size pulse
      const loadingOverlayPath = path.join(tempDir, 'dist', 'loadingOverlay.js');
      if (fs.existsSync(loadingOverlayPath)) {
        let overlayContent = fs.readFileSync(loadingOverlayPath, 'utf8');
        // Gemini Spark monochrome path with 64x64 viewBox and pure opacity pulse without scaling
        const sparkSvgPath = 'M57.0667 28.6103C52.1359 26.4878 47.8217 23.576 44.1223 19.8784C40.4247 16.1808 37.5128 11.8649 35.3902 6.9342C34.5754 5.04449 33.9206 3.10204 33.4186 1.11049C33.2549 0.459368 32.6711 0.0010376 32 0.0010376C31.3288 0.0010376 30.745 0.459368 30.5813 1.11049C30.0793 3.10204 29.4246 5.04267 28.6097 6.9342C26.4872 11.8649 23.5753 16.1808 19.8777 19.8784C16.18 23.576 11.864 26.4878 6.93327 28.6103C5.04353 29.4251 3.10105 30.0799 1.10947 30.5819C0.458338 30.7456 0 31.3294 0 32.0005C0 32.6716 0.458338 33.2555 1.10947 33.4191C3.10105 33.9211 5.04172 34.5759 6.93327 35.3907C11.864 37.5132 16.1782 40.4251 19.8777 44.1226C23.5771 47.8202 26.4872 52.1361 28.6097 57.0668C29.4246 58.9565 30.0793 60.899 30.5813 62.8905C30.745 63.5416 31.3288 64 32 64C32.6711 64 33.2549 63.5416 33.4186 62.8905C33.9206 60.899 34.5754 58.9583 35.3902 57.0668C37.5128 52.1361 40.4247 47.822 44.1223 44.1226C47.8199 40.4251 52.1359 37.5132 57.0667 35.3907C58.9564 34.5759 60.8989 33.9211 62.8905 33.4191C63.5416 33.2555 64 32.6716 64 32.0005C64 31.3294 63.5416 30.7456 62.8905 30.5819C60.8989 30.0799 58.9582 29.4251 57.0667 28.6103Z';
        overlayContent = overlayContent.replace(
          /viewBox="0 0 (?:180 180|64 64)"[^>]*>[\s\S]*?<\/svg>/,
          `viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${sparkSvgPath}" fill="white" /></svg>`
        );
        fs.writeFileSync(loadingOverlayPath, overlayContent, 'utf8');
      }

      // 5. Repack archive asynchronously
      const tempOutput = path.join(os.tmpdir(), `patched-${Date.now()}.asar`);
      await asar.createPackage(tempDir, tempOutput);

      // 6. Write to destination
      fs.copyFileSync(tempOutput, outputAsar);
      fs.unlinkSync(tempOutput);

      return {
        success: true,
        source: sourceAsar,
        output: outputAsar
      };
    } finally {
      // Clean up extraction temp directory
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch {}
    }
  }

  /**
   * Restores the original asar archive if an original backup exists.
   */
  static restore(targetAsar = PathLocator.getLiveAsarPath()) {
    const origBackup = `${targetAsar}.original`;
    if (!fs.existsSync(origBackup)) {
      throw new Error(`No original backup found at ${origBackup}`);
    }

    fs.copyFileSync(origBackup, targetAsar);
    return { success: true, restored: targetAsar };
  }
}

module.exports = AsarPatcher;
