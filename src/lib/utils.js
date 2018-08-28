var utils = {
  resSuccess: function(data) {
    return {
      success: true,
      message: data,
    };
  },

  resFail: function(message) {
    return {
      success: false,
      message: message,
    };
  },

};

module.exports = utils;
