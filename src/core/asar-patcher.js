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
