const Joi = require('joi');

// Regras por item do pedido (idItem pode ser string por vir de sistemas externos)
const itemSchema = Joi.object({
  idItem: Joi.string().trim().max(100).required(),
  quantidadeItem: Joi.number().integer().positive().required(),
  valorItem: Joi.number().precision(2).min(0).required(),
});

// unknown(false) = rejeita qualquer campo que não esteja no schema
const createOrderSchema = Joi.object({
  numeroPedido: Joi.string().trim().max(50).required(),
  valorTotal: Joi.number().precision(2).min(0).required(),
  dataCriacao: Joi.string().isoDate().required(),
  items: Joi.array().items(itemSchema).min(1).required(),
}).unknown(false);

const updateOrderSchema = createOrderSchema;

// Query params da listagem (page/limit com defaults)
const listOrdersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
}).unknown(false);

// Factory: gera middleware que valida req[property] e repassa erro pro errorHandler
function buildValidator(schema, property = 'body') {
  return (req, res, next) => {
    const options = {
      abortEarly: false, // junta todos os erros de uma vez
      stripUnknown: true,
      convert: true,
    };

    const { value, error } = schema.validate(req[property], options);

    if (error) {
      error.isJoi = true;
      return next(error);
    }

    req[property] = value;
    return next();
  };
}

const validateCreateOrder = buildValidator(createOrderSchema, 'body');
const validateUpdateOrder = buildValidator(updateOrderSchema, 'body');
const validateListOrdersQuery = buildValidator(listOrdersQuerySchema, 'query');

module.exports = {
  validateCreateOrder,
  validateUpdateOrder,
  validateListOrdersQuery,
};

