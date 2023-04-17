const fs = require('fs').promises;
const path = require('path');

async function readTalkersData() {
    try {
      const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
      const talkers = JSON.parse(data);
      return talkers;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
    }
}

module.exports = {
    readTalkersData,
};
