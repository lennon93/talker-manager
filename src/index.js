const express = require('express');
const crypto = require('crypto');
const connection = require('./db/connection');

const {
   readTalkersData, readTalkersDataById, writeTalkersData,
    writeTalkersDataById, deleteTalkerData, readTalkersDataByQuery, 
    patchTalkerData, readTalkersDataInDB,
} = require('./utils/utilsFs');
const { hasEmail, validEmail } = require('./middleware/validateEmail');
const { hasPassword, validPassword } = require('./middleware/validatePassword');
const { 
  tokenValidation, talkValidation, nameValidation,
   ageValidation, watchedAtValidation, rateValidation, 
   rateValidationSearch, dateValidation, rateValidationPatch,
  } = require('./middleware/validateTalkers');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, async () => {
  console.log('Online');

  const [result] = await connection.execute('SELECT 1');
  if (result) {
    console.log('MySQL connection OK');
  }
});

app.get('/talker/search',
 tokenValidation, rateValidationSearch, dateValidation,
  async (req, res) => {
  const { q, rate, date } = req.query;

  const talkersByQueryAndRate = await readTalkersDataByQuery(q, Number(rate), date);
  return res.status(200).json(talkersByQueryAndRate);
});

app.get('/talker/db', async (req, res) => {
  const [talkers] = await readTalkersDataInDB();
  const correctTalkers = talkers.map((talker) => (
    {
     age: talker.age,
     id: talker.id,
     name: talker.name,
     talk: {
       rate: talker.talk_rate,
       watchedAt: talker.talk_watched_at,
     },  
   }
  ));
  return res.status(200).json(correctTalkers);
});

app.patch('/talker/rate/:id', tokenValidation, rateValidationPatch, async (req, res) => {
  const { id } = req.params;
  const { rate } = req.body;

  await patchTalkerData(Number(id), Number(rate));
    return res.status(204).end();
});

app.get('/talker', async (req, res) => {
  const talkers = await readTalkersData();
  return res.status(200).json(talkers);
});

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [talkerById] = await readTalkersDataById(id);
    if (!talkerById) {
      throw new Error('Pessoa palestrante não encontrada');
   }
    return res.status(200).json(talkerById);
  } catch (error) { 
    return res.status(404).json({
      message: 'Pessoa palestrante não encontrada',
    });
  }
});

app.post('/login', hasEmail, validEmail, hasPassword, validPassword, (req, res) => {
  const randomToken = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token: randomToken });
});

app.post('/talker', 
tokenValidation, nameValidation, ageValidation,
 talkValidation, watchedAtValidation, rateValidation,
  async (req, res) => {
    const talker = req.body;
    const newTalkers = await writeTalkersData(talker);
    return res.status(201).json(newTalkers);
});

app.put('/talker/:id',
tokenValidation, nameValidation, ageValidation,
 talkValidation, watchedAtValidation, rateValidation,
async (req, res) => {   
      const { id } = req.params;
      const talker = req.body;
      const idTalker = Number(id);
      const updatedTalker = { id: idTalker, ...talker };
      try {
      await writeTalkersDataById(idTalker, talker);
      const oldTalkers = await readTalkersData();     
      if (!oldTalkers.some((oldTalker) => oldTalker.id === idTalker)) {
        throw new Error('Pessoa palestrante não encontrada');
     }
     
     return res.status(200).json(updatedTalker);
    } catch (error) { 
      return res.status(404).json({
        message: 'Pessoa palestrante não encontrada',
      });
    }
  });   

  app.delete('/talker/:id', tokenValidation, async (req, res) => {
      const { id } = req.params;
      await deleteTalkerData(Number(id));
      return res.status(204).end();
  });
