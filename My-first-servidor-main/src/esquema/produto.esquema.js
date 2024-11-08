const { format } = require("sequelize/lib/utils");

module.exports = {
    type: "object",
    properties: {
        nome: { type: "string",  },
        descricao: { type: "string", },
        preco: { type: "number" }
    },
    required: ["nome", "descricao", "preco"],
    additionalProperties: false
};