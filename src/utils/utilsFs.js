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

async function writeTalkersData(talker) {
    try {
      const oldTalkers = await readTalkersData();
      const newId = oldTalkers.length + 1;
      const newTalker = { id: newId, ...talker };
      const newTalkers = JSON.stringify([...oldTalkers, newTalker]);  

      await fs.writeFile(path.resolve(__dirname, '../talker.json'), newTalkers);
      return newTalker;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
    }
}
module.exports = {
    readTalkersData,
    readTalkersDataById,
    writeTalkersData,
};
