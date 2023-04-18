const hasEmail = (req, res, next) => {
 const { email } = req.body;
 if (!email) {
  return res.status(400).send({
    message: 'O campo "email" é obrigatório',
  });
 }
     next();
};

const validEmail = (req, res, next) => {
    const { email } = req.body;
    const regex = /\S+@\S+\.\S+/;
    const validateEmail = regex.test(email);
    if (!validateEmail) {
    return res.status(400).send({
        message: 'O "email" deve ter o formato "email@email.com"',
      });
    }
        next();
   };

module.exports = {
  hasEmail,
  validEmail,
};