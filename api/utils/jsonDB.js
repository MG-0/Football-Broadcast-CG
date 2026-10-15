const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "../data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// READING DATA FROM JSON FILE

const readData = (fileName) => {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);

  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }

    const rawContent = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(rawContent);
  } catch (error) {
    console.error(`Error reading ${fileName}.json:`, error);

    return [];
  }
};

// WRITTING DATA IN JSON FILE

const writeData = (fileName, data) => {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);

  try {
    const content = JSON.stringify(data, null, 2);

    fs.writeFileSync(filePath, content, "utf-8");
  } catch (error) {
    console.error(`Error writing to ${fileName}.json:`, error);
    throw error;
  }
};

module.exports = {
  readData,
  writeData,
};
