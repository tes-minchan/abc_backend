var utils = {
  resSuccess: function(data){
    return {
      success:true,
      message:null,
      errors:null,
      data:data
    };
  },

  resFail: function(message, err){
    if(!err&&!message) message = 'data not found';
    return {
      success:false,
      message:message,
      errors:(err)? err: null,
      data:null
    };
  },

}

module.exports = utils;
