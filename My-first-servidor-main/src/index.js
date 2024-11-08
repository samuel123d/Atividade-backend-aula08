
const express = require('express');
const rotaUsuario = require('./rotas/usuario.rota')
const rotaPost = require('./rotas/posts.rota')
const rotaProduto = require('./rotas/produtos.rota')
const expressLayouts = require('express-ejs-layouts')
const indexRoute = require('./rotas/index.rota')
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./api.yml');
const tokenRouter = require('./rotas/token.rota');


    
const app = express();
app.use(express.json());
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/static', express.static('public'))
app.set('view engine', 'ejs')
app.use('/token', tokenRouter);
app.use('/api/usuario', rotaUsuario)
app.use('/api/posts', rotaPost)
require('dotenv').config()


app.get('/api',(req,res) => {
    res.status(400).send('Sem arquivos ou path errado');
})


app.listen(8080,() => {
    console.log('Servidor de porta 8080')
})