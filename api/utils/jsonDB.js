const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(__dirname, "../data");
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DATA_DIR = isServerless ? "/tmp" : SOURCE_DIR;

// Global in-memory store so serverless lambdas preserve writes during their lifecycle
const memoryStore = {};

// Helper to ensure initial data exists in writable target on Vercel
const getTargetFilePath = (fileName) => path.join(DATA_DIR, `${fileName}.json`);

const ensureInitialFile = (fileName) => {
  const targetPath = getTargetFilePath(fileName);
  if (isServerless && !fs.existsSync(targetPath)) {
    const sourcePath = path.join(SOURCE_DIR, `${fileName}.json`);
    if (fs.existsSync(sourcePath)) {
      try {
        fs.copyFileSync(sourcePath, targetPath);
      } catch (err) {
        console.warn("Could not copy initial data to /tmp:", err.message);
      }
    }
  }
  return targetPath;
};

// READING DATA FROM JSON FILE
const readData = (fileName) => {
  if (memoryStore[fileName]) {
    return memoryStore[fileName];
  }

  try {
    const targetPath = ensureInitialFile(fileName);
    if (fs.existsSync(targetPath)) {
      const rawContent = fs.readFileSync(targetPath, "utf-8");
      const data = JSON.parse(rawContent);
      memoryStore[fileName] = data;
      return data;
    }

    const sourcePath = path.join(SOURCE_DIR, `${fileName}.json`);
    if (fs.existsSync(sourcePath)) {
      const rawContent = fs.readFileSync(sourcePath, "utf-8");
      const data = JSON.parse(rawContent);
      memoryStore[fileName] = data;
      return data;
    }

    return [];
  } catch (error) {
    console.error(`Error reading ${fileName}.json:`, error);
    return memoryStore[fileName] || [];
  }
};

// WRITING DATA IN JSON FILE
const writeData = (fileName, data) => {
  // Always update in-memory state so readData immediately sees changes
  memoryStore[fileName] = data;

  try {
    const targetPath = ensureInitialFile(fileName);
    const content = JSON.stringify(data, null, 2);
    fs.writeFileSync(targetPath, content, "utf-8");
  } catch (error) {
    console.warn(`Write to disk failed (preserved in memory):`, error.message);
    // Do not throw EROFS so the API request still succeeds!
  }
};

module.exports = {
  readData,
  writeData,
};
