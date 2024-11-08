const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const usuarioMid = require('../midware/validarUsuario.midware');
const { Usuario } = require('../db/models');
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
/// ORM sistema que faz uma mapeamento chamado objeto relacional entre a aplicação e o banco de dados, nós dando funcionalidade para abstrair compexibilidade do banco de dados flexibilizando a aplicação, (sequelize)ORM.
router.post('/', usuarioMid);
router.put('/', usuarioMid);

router.get("/", async (req, res) => {
  const usuarios = await Usuario.findAll();
  const resultado = usuarios.map(user => prepararResultado(user.dataValues))
  res.json({ usuarios: resultado });
});

router.get("/:id", async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (usuario) {
    res.json({ usuario: prepararResultado(usuario.dataValues) });
  } else {
    res.status(400).json({ msg: "Usuário não encontrado!" });
  }
});

router.post("/", async (req, res) => {
    const senha = req.body.senha;
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);
    const usuario = { email: req.body.email, senha: senhaCriptografada };
    const usuarioObj = await Usuario.create(usuario);
    res.json({ msg: "Usuário adicionado com sucesso!", userId: usuarioObj.id });
  });
  router.post("/login", async (req, res) => {

    const email = req.body.email;
    const senha = req.body.senha;
  
    const usuario = await Usuario.findOne({
      where: {
        email: email,
      },
    });
  
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      const payload = {
        sub: usuario.id,
        iss: "imd-backend",
        aud: "imd-frontend",
        email: usuario.email,
      };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '40s'})
      res.json({ accessToken: token })
    } else {
      res.status(403).json({ msg: "usuário ou senha inválidos" })
    }
  });
  

router.delete('/', async (req, res) => {
    const id = req.query.id;
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
        await usuario.destroy();
        res.json({ msg: "Usuário deletado com sucesso!" });
    } else {
        res.status(400).json({ msg: "Usuário não encontrado!" });
    }
});

router.put('/', async (req, res) => {
    const id = req.query.id;
    const usuario = await Usuario.findByPk(id);
    if (usuario) {
        usuario.titulo = req.body.titulo;
        usuario.texto = req.body.texto;
        await usuario.save();
        res.json({ msg: "Usuário atualizado com sucesso!" });
    } else {
        res.status(400).json({ msg: "Usuário não encontrado!" });
    }
});

function prepararResultado(usuario){
  const result = Object.assign({}, usuario)
  if (result.createdAt) delete result.createdAt
  if (result.updatedAt) delete result.updatedAt
  if (result.senha) delete result.senha
  return result
}

module.exports = router;
