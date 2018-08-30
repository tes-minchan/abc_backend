var utils = {
  resSuccess: function(data) {
    return {
      success: true,
      message: data,
    };
  },

  resFail: function(data) {
    return {
      success: false,
      message: data,
    };
  },

};

module.exports = utils;
