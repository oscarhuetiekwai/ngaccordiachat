const Joi = require('joi');
const jwt = require('jsonwebtoken');
const express = require('express');
const config = require('config');
const router = express.Router();

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // check db got this username //
  //let user = await User.findOne({ email: req.body.email });
  //if (!user) return res.status(400).send('Invalid email or password.');

  //const validPassword = await bcrypt.compare(req.body.password, user.password);
  //if (!validPassword) return res.status(400).send('Invalid email or password.');

 // const token = user.generateAuthToken();
 const token = jwt.sign({ role_id: '2', username: req.body.username }, config.get('jwtPrivateKey'));
  res.send(token);
});

function validate(req) {
  const schema = {
    username: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required()
  };

  return Joi.validate(req, schema);
}

module.exports = router; 
