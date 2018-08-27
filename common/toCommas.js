// export

module.exports = function toCommas(val) {
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
