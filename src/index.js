const express = require('express');
const crypto = require('crypto');
const { readTalkersData, readTalkersDataById, writeTalkersData } = require('./utils/utilsFs');
const { hasEmail, validEmail } = require('./middleware/validateEmail');
const { hasPassword, validPassword } = require('./middleware/validatePassword');
const { 
  tokenValidation, talkValidation, nameValidation,
   ageValidation, watchedAtValidation, rateValidation,
  } = require('./middleware/validateTalkers');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = process.env.PORT || '3001';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
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
