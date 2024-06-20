import fs from 'fs/promises';
import path from 'path';

export class FileManager {
  constructor(basePath) {
    this.basePath = basePath;
    if (!this.directoryExists(basePath)) {
      this.createDirectory(basePath);
    }
  }

  // Recursively list all files in basePath, including their paths and extensions
  async listFiles(dirPath = this.basePath, fileList = []) {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      if (file.isDirectory()) {
        await this.listFiles(filePath, fileList);
      } else {
        fileList.push({
          name: file.name,
          path: filePath,
          extension: path.extname(file.name),
        });
      }
    }
    return fileList;
  }

  // Create a file with content
  async createFile(filePath, content) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      const directoryPath = path.dirname(fullPath);
      await fs.mkdir(directoryPath, { recursive: true });
      await fs.writeFile(fullPath, content);
    } catch (err) {
      console.error(err);
    }
  }

  // Read the content of a file
  async readFile(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      // Check if file exists
      await fs.access(fullPath);
      return fs.readFile(fullPath, 'utf8');
    } catch (err) {
      throw new Error('File not found');
    }
  }

  // Delete a file
  async deleteFile(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      // Check if file exists
      await fs.access(fullPath);
      await fs.unlink(fullPath);
    } catch (err) {
      throw new Error('File not found');
    }
  }

  // Create a directory at a given path (relative to basePath)
  async createDirectory(dirPath) {
    const fullPath = path.join(this.basePath, dirPath);
    try {
      await fs.mkdir(fullPath, { recursive: true });
    } catch (err) {
      console.error(err);
    }
  }

  // Check if a file exists
  async fileExists(filePath) {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.stat(fullPath);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Check if a directory exists
  async directoryExists(dirPath) {
    const fullPath = path.join(this.basePath, dirPath);
    try {
      const stats = await fs.stat(fullPath);
      return stats.isDirectory();
    } catch (err) {
      return false;
    }
  }
}
