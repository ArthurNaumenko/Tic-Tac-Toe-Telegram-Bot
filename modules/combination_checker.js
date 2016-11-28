var exports = module.exports = {};


exports.checkIfWin = function (a) {
  // 012, 345, 678, 036, 147, 258, 048, 246
  // console.log('Current state:\n');
  // var str = '';
  // for (var i = 0; i < a.length; i++) {
  //   if (i === 2 || i === 6) {
  //     str += a[i] + '\n';
  //   } else {
  //     str += a[i];
  //   }
  // }

  //console.log(str);

  if ((a[0] === 'X' && a[1] === 'X' && a[2] === 'X') ||
      (a[0] === '0' && a[1] === '0' && a[2] === '0')) {
        return true;
  } else if ((a[3] === 'X' && a[4] === 'X' && a[5] === 'X') ||
             (a[3] === '0' && a[4] === '0' && a[5] === '0')) {
    return true;
  } else if ((a[6] === 'X' && a[7] === 'X' && a[8] === 'X') ||
             (a[6] === '0' && a[7] === '0' && a[8] === '0')) {
    return true;
  } else if ((a[0] === 'X' && a[3] === 'X' && a[6] === 'X') ||
             (a[0] === '0' && a[3] === '0' && a[6] === '0')) {
    return true;
  } else if ((a[1] === 'X' && a[4] === 'X' && a[7] === 'X') ||
             (a[1] === '0' && a[4] === '0' && a[7] === '0')) {
    return true;
  } else if ((a[2] === 'X' && a[5] === 'X' && a[8] === 'X') ||
             (a[2] === '0' && a[5] === '0' && a[8] === '0')) {
    return true;
  } else if ((a[0] === 'X' && a[4] === 'X' && a[8] === 'X') ||
             (a[0] === '0' && a[4] === '0' && a[8] === '0')) {
    return true;
  } else if ((a[2] === 'X' && a[4] === 'X' && a[6] === 'X') ||
             (a[2] === '0' && a[4] === '0' && a[6] === '0')) {
    return true;
  } else {
    console.log('doesn\'t look like anything to me');
    return false;
  }
};
