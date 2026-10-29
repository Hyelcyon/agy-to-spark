const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Resolves standard system and installation paths for Antigravity and Gemini Spark.
 */
class PathLocator {
  static getLocalAppDir() {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    return path.join(localAppData, 'Programs', 'antigravity');
  }

  static getLiveAsarPath() {
    return path.join(this.getLocalAppDir(), 'resources', 'app.asar');
  }

  static getLiveExePath() {
    return path.join(this.getLocalAppDir(), 'Antigravity.exe');
  }

  static getBackupDir() {
    return path.join(os.homedir(), '.gemini', 'geminispark', 'branding');
  }

  static getBackupAsarPath() {
    return path.join(this.getBackupDir(), 'app.asar');
  }

  static getProjectAsset(relativePath) {
    return path.resolve(__dirname, '..', '..', 'assets', relativePath);
  }
}

module.exports = PathLocator;
