const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
router.post('/', (req, res) => {
  const payload = {
    randomValue: Math.random() // Gera um número aleatório entre 0 e 1
  };

  const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  res.json({ accessToken: token });
});

module.exports = router;
