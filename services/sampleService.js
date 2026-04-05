const Sample = require("../models/SampleModel");

const createSample = async (payload) => {
  return Sample.create(payload);
};

module.exports = {
  createSample
};
