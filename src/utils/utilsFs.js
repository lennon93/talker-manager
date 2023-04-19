const fs = require('fs').promises;
const path = require('path');

const PATH_NAME = '../talker.json';

async function readTalkersData() {
    try {
      const data = await fs.readFile(path.resolve(__dirname, PATH_NAME));
      const talkers = JSON.parse(data);
      return talkers;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
    }
}

async function readTalkersDataById(id) {
    try {
      const data = await fs.readFile(path.resolve(__dirname, PATH_NAME));
      const talkers = JSON.parse(data);
      const talkerById = talkers.filter((talker) => talker.id === Number(id));
      return talkerById;
    } catch (error) {
        console.error(`Erro na leitura do arquivo: ${error}`);
    }
}

async function readTalkersDataByQuery(q, rate, date) {
    const data = await fs.readFile(path.resolve(__dirname, PATH_NAME));
    const talkers = JSON.parse(data);
    let talkersByQuery = talkers;
    if (q) {
      talkersByQuery = talkersByQuery
      .filter((talker) => talker.name.toUpperCase().includes(q.toUpperCase()));
    }    
    if (rate) {
      talkersByQuery = talkersByQuery
        .filter((talker) => talker.talk.rate === rate);
    } 
    if (date) {
      talkersByQuery = talkersByQuery
        .filter((talker) => talker.talk.watchedAt === date);
    }   
    return talkersByQuery;
}

async function writeTalkersData(talker) {
    try {
      const oldTalkers = await readTalkersData();
      const newId = oldTalkers.length + 1;
      const newTalker = { id: newId, ...talker };
      const newTalkers = JSON.stringify([...oldTalkers, newTalker]);  

      await fs.writeFile(path.resolve(__dirname, PATH_NAME), newTalkers);
      return newTalker;
    } catch (error) {
        console.error(`Erro na escrita do arquivo: ${error}`);
    }
}
async function writeTalkersDataById(id, talker) {
      const oldTalkers = await readTalkersData();
      const idTalker = Number(id);
      const updatedTalker = { id: idTalker, ...talker };
      const newTalkers = oldTalkers.reduce((talkersList, currentTalker) => {
        if (currentTalker.id === idTalker) return [...talkersList, updatedTalker];
        return [...talkersList, currentTalker];
      }, []);
      const newData = JSON.stringify(newTalkers); 
      try { 
      await fs.writeFile(path.resolve(__dirname, PATH_NAME), newData);
      return updatedTalker;
    } catch (error) {
        console.error(`Erro na escrita do arquivo: ${error}`);
    }
}

async function deleteTalkerData(id) {
  const oldTalkers = await readTalkersData();
  const newTalkers = oldTalkers.filter((talker) => talker.id !== id);

  const newData = JSON.stringify(newTalkers); 
  try { 
    await fs.writeFile(path.resolve(__dirname, PATH_NAME), newData);
  } catch (error) {
      console.error(`Erro na escrita do arquivo: ${error}`);
  }
}

async function patchTalkerData(id, rate) {
  const oldTalkers = await readTalkersData();
  console.log(rate);
  const filtredTalker = oldTalkers.filter((talker) => talker.id === id);
  const updatedTalker = filtredTalker[0];     
  updatedTalker.talk.rate = rate;
  const newTalkers = oldTalkers.reduce((talkersList, currentTalker) => {
    if (currentTalker.id === id) return [...talkersList, updatedTalker];
    return [...talkersList, currentTalker];
  }, []);
  const newData = JSON.stringify(newTalkers); 
  try { 
  await fs.writeFile(path.resolve(__dirname, PATH_NAME), newData);
  return console.log(updatedTalker);
} catch (error) {
    console.error(`Erro na escrita do arquivo: ${error}`);
}
}

module.exports = {
    readTalkersData,
    readTalkersDataById,
    writeTalkersData,
    writeTalkersDataById,
    deleteTalkerData,
    readTalkersDataByQuery,
    patchTalkerData,
};