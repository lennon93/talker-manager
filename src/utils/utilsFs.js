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

async function readTalkersDataById(id) {
    try {
      const data = await fs.readFile(path.resolve(__dirname, '../talker.json'));
      const talkers = JSON.parse(data);
      const talkerById = talkers.filter((talker) => talker.id === Number(id));
      return talkerById;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
    }
}

module.exports = {
    readTalkersData,
    readTalkersDataById,
};
