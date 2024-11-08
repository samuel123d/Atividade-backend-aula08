const Ajv = require('ajv');
const ajv = new Ajv();
const addFormats = require("ajv-formats")
addFormats(ajv);
const postsesquema = require('../esquema/produto.esquema');

function validarPost(req,res,next){
    const post = req.body
    const validate = ajv.compile(postsesquema)
    const valid = validate(post)
    if(valid){
        next()
    }else{
        res.status(400).json({msg: "Dados inválidos", errors: validate.errors}) 
    }
}
module.exports = validarPost