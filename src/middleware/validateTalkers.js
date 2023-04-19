const tokenValidation = (req, res, next) => {
    const { authorization } = req.headers;
 if (!authorization) {
  return res.status(401).json({
    message: 'Token não encontrado',
  });
}
  if (authorization.length !== 16 || !typeof authorization === 'string') {
    return res.status(401).json({
        message: 'Token inválido',
      });
 }
     next();
};

const nameValidation = (req, res, next) => {
    const { name } = req.body;
 if (!name) {
  return res.status(400).json({
    message: 'O campo "name" é obrigatório',
  });
}
  if (name.length < 3) {
    return res.status(400).json({
        message: 'O "name" deve ter pelo menos 3 caracteres',
      });
 }
     next();
};

const ageValidation = (req, res, next) => {
    const { age } = req.body;
 if (!age) {
  return res.status(400).json({
        message: 'O campo "age" é obrigatório',
      });
}
  if (age < 18 || !Number.isInteger(age)) {
    return res.status(400).json({
        message: 'O campo "age" deve ser um número inteiro igual ou maior que 18',
      });
 }
     next();
};

const talkValidation = (req, res, next) => {
    const { talk } = req.body;
 if (!talk) {
  return res.status(400).json({
        message: 'O campo "talk" é obrigatório',
      });
}
     next();
};

const watchedAtValidation = (req, res, next) => {
    const { talk } = req.body;
    const { watchedAt } = talk;
    const regex = /^[0-9]{2}(\/){1}[0-9]{2}(\/){1}[0-9]{4}$/g;
     
  if (!watchedAt) {
    return res.status(400).json({
        message: 'O campo "watchedAt" é obrigatório',
      });
 }
 if (!regex.test(watchedAt)) {
  return res.status(400).json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      });
 }
    next();
};

const dateValidation = (req, res, next) => {
  const { date } = req.query;
  const regex = /^[0-9]{2}(\/){1}[0-9]{2}(\/){1}[0-9]{4}$/g;

if (date && !regex.test(date)) {
return res.status(400).json({
      message: 'O parâmetro "date" deve ter o formato "dd/mm/aaaa"',
    });
}
  next();
};

const rateValidationSearch = (req, res, next) => {
  const { rate } = req.query;
  const numberRate = Number(rate);

    if (rate && (numberRate < 1 || numberRate > 5 || !Number.isInteger(numberRate))) {
      return res.status(400).json({
          message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
        });
    }
  next();
};

const rateValidation = (req, res, next) => {
  const { talk } = req.body;
  const { rate } = talk;

  if (rate === undefined) {
    return res.status(400).json({
        message: 'O campo "rate" é obrigatório',
      });
  }
  if (rate < 1 || rate > 5 || !Number.isInteger(rate)) {
    return res.status(400).json({
        message: 'O campo "rate" deve ser um número inteiro entre 1 e 5',
      });
  }
  next();
};

module.exports = {
  tokenValidation,
  nameValidation,
  ageValidation,
  talkValidation,
  watchedAtValidation,
  rateValidation,
  rateValidationSearch,
  dateValidation,
};