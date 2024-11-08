const Ajv = require('ajv');
const ajv = new Ajv();
const addFormats = require("ajv-formats")
addFormats(ajv);
const usuarioesquema = require('../esquema/usuario.esquema');

function validarUsuario(req,res,next){
    const usuario = req.body
    const validate = ajv.compile(usuarioesquema)
    const valid = validate(usuario)
    if(valid){
        next()
    }else{
        res.status(400).json({msg: "Dados inválidos", errors: validate.errors}) 
    }
}

module.exports = validarUsuario