const hasEmail = (req, res, next) => {
 const { email } = req.body;
 if (!email) {
   res.status(400).send({
    message: 'O campo "email" é obrigatório',
  });
 } else {
     next();
 }
};

const validEmail = (req, res, next) => {
    const { email } = req.body;
    const regex = /\S+@\S+\.\S+/;
    const validateEmail = regex.test(email);
    if (!validateEmail) {
      res.status(400).send({
        message: 'O "email" deve ter o formato "email@email.com"',
      });
    } else {
        next();
    }
   };

module.exports = {
  hasEmail,
  validEmail,
};