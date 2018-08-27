// import

const Color = require('color');

const styleVars = require('./styleVars');

// export

module.exports = function calcGoalColor({words, target}) {
  const pow = 0.5;
  let start, end;

  if (words >= target) {
    words = words - target;
    words = words > target ? target : words;

    start = new Color(styleVars.green4);
    end = new Color(styleVars.blue3);
  } else {
    start = new Color(styleVars.red3);
    end = new Color('#FFFF00');
  }

  const mix = (words ** pow) / (target ** pow);
  const color = start.mix(end, mix).saturationv(100);

  return {
    color: color.hex(),
    colorPale: color.lighten(0.25).hex(),
    colorDark: color.darken(0.25).hex(),
  };
};
