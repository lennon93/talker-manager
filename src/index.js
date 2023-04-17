const express = require('express');
const { readTalkersData, readTalkersDataById } = require('./utils/utilsFs');

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
