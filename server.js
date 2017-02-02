var config = require('./config');
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token, {
  polling: true
});

// connect helping modules
var kb = require("./modules/inline_keyboard.js");
var checker = require("./modules/combination_checker.js");

console.log('info', 'Server up and running!');

// A map to store current games' data
var currentGames = new Map();

// react on message /play
bot.onText(/\/play/, function(msg, match) {
  var chatId = msg.chat.id;
  var text = 'Player 1 play the button under this message:';
  // create initial keyboard layout that says "First player"
  var keyboard = {reply_markup: JSON.parse(kb.createKeyboard('first_player'))};
  bot.sendMessage(chatId, text, keyboard);
});

// This method processes queries sent via inline keyboard
bot.on('callback_query', function (msg) {
  var chatID = msg.message.chat.id;
  var msgID = msg.message.message_id;
  // building the key for our currentGames map:
  // as the combo of chat id and message id will be
  // the unique combination to identify a certain game
  var key = chatID + ',' + msgID;

  // if it's the first stage when the first player has been picked
  if (msg.data === 'first_player') {
    /* initialData will be the value for the key in curretGames.
     * It's a JSON object that contains all the data we need to
     * store about a particular game.
     * p1 & p2 vars are arrays with names and ids of players;
     * layout contains an array that represents the state of the
     * game field; The var turn contains info about which player's turn
     * it is at the moment.
     */
    var initialData = JSON.stringify({
      p1: [msg.from.id, msg.from.first_name, msg.from.last_name],
      p2: [],
      layout: [],
      turn: ' ',
      date: ' '
    });
    currentGames.set(key, initialData);
    var text = 'Okay, got it. Now, player 2 hit the button!'
    // create keyboard layout that says "Second player"
    var keyboard = kb.createKeyboard('second_player');
    // build a json object for the method "editMessageText"
    var data = {message_id: msgID,
                chat_id: chatID,
                reply_markup: JSON.parse(keyboard)};
    // this one edits the game message
    bot.editMessageText(text, data);
    return;
  }

  // if it's the second stage when the 2nd player has been picked
  if (msg.data === 'second_player') {
    // extract the value from currentGames
    var json = JSON.parse(currentGames.get(key));
    // update the JSON object the value contains
    json.p2 = [msg.from.id, msg.from.first_name, msg.from.last_name];
    json.layout = [' ',' ',' ',' ',' ',' ',' ',' ',' ',];
    json.turn = [json.p1[0], json.p1[1]];
    json.date = new Date();
    // save updated data
    currentGames.set(key, JSON.stringify(json));

    var text = json.p1[1] + ' vs. ' + json.p2[1] +
              '! Let the battle begin!\n' +
              'It\'s ' + json.turn[1] + '\'s turn';
    // Create 3 by 3 empty gaming field (aka inline keyboard)
    var keyboard = kb.createKeyboard('gamestart');
    var idKBoard = {message_id: msgID,
                    chat_id: chatID,
                    reply_markup: JSON.parse(keyboard)};

    bot.editMessageText(text, idKBoard);
    return;
  }

  // At this point the game initialization is over

  // check if key exists not to let other chat members intrude
  if (currentGames.get(key) === undefined) {
    bot.answerCallbackQuery(msg.id, 'Don\'t you dare mess their game!', false);
    return;
  }

  // extract json value from the currentGames map
  var json = JSON.parse(currentGames.get(key));

  // check if the player hits a button in the right turn
  if (json.turn[0] != msg.from.id) {
    bot.answerCallbackQuery(msg.id, 'Not your turn' + msg.from.first_name + '!', false);
    return;
  }

    // update turn data
    var currentPlayer = '';
    var nextPlayer = [];
    if (json.turn[0] === json.p1[0]) {
      currentPlayer = '1';
      nextPlayer = json.p2;
    } else {
      currentPlayer = '2';
      nextPlayer = json.p1;
    }

    // check if players hit availiable cells
    if (json.layout[msg.data] === ' ') {
      // if the cell has no X nor 0 we update the layout data
      var updatedLayout = updateMoves(json.layout, msg.data, currentPlayer);
    } else {
      // frown
      bot.answerCallbackQuery(msg.id, 'Uh-uh', false);
      return;
    }

    // update JSON object with game data
    json.layout = updatedLayout;

    // check if there's a win combination
    if (checker.checkIfWin(json.layout)) {
      var idKBoard = {message_id: msgID,
                      chat_id: chatID};

      // show a win message
      bot.editMessageText(json.turn[1] + ' wins!', idKBoard);
        return;
      } else {
        console.log('I checked. No win');
    }

    // update turn and date in the json object
    json.turn = nextPlayer;
    json.date = new Date();
    // save updated data
    currentGames.set(key, JSON.stringify(json));

    // update layout with new game data
    var keyboard = kb.createKeyboard('', updatedLayout);
    var idKBoard = {message_id: msgID,
                    chat_id: chatID,
                    reply_markup: JSON.parse(keyboard)};

   var text = json.turn[1] + '\'s turn!';
   // update the message
    bot.editMessageText(text, idKBoard);
});


function updateMoves(layout, cell, player) {
  if (player === '1') {
    layout[cell] = 'X';
    return layout;
  } else {
    layout[cell] = '0';
    return layout;
  }
}
