var exports = module.exports = {};

exports.createKeyboard = function (mode, data) {
    if (mode === 'first_player') {
      return JSON.stringify({
          inline_keyboard: [
            [
              {text:'Player 1, press me!',callback_data:'first_player'}
            ]
          ]
      });
    } else if (mode === 'second_player') {
      return JSON.stringify({
          inline_keyboard: [
            [
              {text:'Player 2, press me!',callback_data:'second_player'}
            ]
          ]
      });
    } else if (mode === 'gamestart') {
      return JSON.stringify({
          inline_keyboard: [
            [
              {text:' ',callback_data:'0'},
              {text:' ',callback_data:'1'},
              {text:' ',callback_data:'2'}
            ],
            [
              {text:' ',callback_data:'3'},
              {text:' ',callback_data:'4'},
              {text:' ',callback_data:'5'},
            ],
            [
              {text:' ',callback_data:'6'},
              {text:' ',callback_data:'7'},
              {text:' ',callback_data:'8'},
            ]
          ]
      });
    } else {
      return JSON.stringify({
          inline_keyboard: [
            [
              {text:data[0],callback_data:'0'},
              {text:data[1],callback_data:'1'},
              {text:data[2],callback_data:'2'}
            ],
            [
              {text:data[3],callback_data:'3'},
              {text:data[4],callback_data:'4'},
              {text:data[5],callback_data:'5'},
            ],
            [
              {text:data[6],callback_data:'6'},
              {text:data[7],callback_data:'7'},
              {text:data[8],callback_data:'8'},
            ]
          ]
        });
    }
  }
