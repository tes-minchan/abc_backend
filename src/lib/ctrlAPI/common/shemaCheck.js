const Joi = require('joi');



module.exports = {


  apiKeyValidate : (key, secret) => {
    const schema = Joi.object().keys({
      apikey : Joi.string().required(),
      apisecret : Joi.string().required(),
    });
    
    const validateKey = Joi.validate({apikey : key, apisecret : secret}, schema);

    if(validateKey.error) {
      return {
        validated : false,
        message   : "apiKey validate check error"
      }
    }
    else {
      return {
        validated : true,
        message   : validateKey.value
      }
    }
  },

  orderinfoValidate : (orderinfo) => {
    const schema = Joi.object().keys({
      market : Joi.string().required(),
      coin   : Joi.string().required(),
      side   : Joi.string().allow('BUY', 'SELL').required(),
      price  : Joi.number().greater(0).required(),
      volume : Joi.number().greater(0).required()
    });

    const validateKey = Joi.validate({
      market : orderinfo.market,
      coin   : orderinfo.coin,
      side   : orderinfo.side,
      price  : parseInt(orderinfo.price),
      volume : parseFloat(orderinfo.volume)
    }, schema);

    if(validateKey.error) {
      return {
        validated : false,
        message   : "orderinfo validate check error"
      }
    }
    else {
      return {
        validated : true,
        message   : validateKey.value
      }
    }


  }
}