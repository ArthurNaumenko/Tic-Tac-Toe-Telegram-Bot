var express = require('express');
var app = express();
var config = require('./config_real');
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(config.token, {
  polling: true
});

var kbMod = require("./modules/inline_keyboard.js");
var checker = require("./modules/combination_checker.js");

console.log('info', 'Server up and running!');

// A map to store current games data
var currentGames = new Map();


bot.onText(/\/play/, function(msg, match) {
  var chatId = msg.chat.id;
  var text = 'Player 1 play the button under this message:';
  var keyboard = {reply_markup: JSON.parse(kbMod.createKeyboard('first_player'))};
  bot.sendMessage(chatId, text, keyboard);
});

bot.on('callback_query', function (msg) {
  var chatID = msg.message.chat.id;
  var msgID = msg.message.message_id;
  var key = chatID + ',' + msgID;

  if (msg.data === 'first_player') {
    var initialData = JSON.stringify({
      p1: [msg.from.id, msg.from.first_name, msg.from.last_name],
      p2: [],
      layout: [],
      turn: ' ',
      date: ' '
    });
    currentGames.set(key, initialData);
    var text = 'Okay, got it. Now, player 2 hit the button!'
    var keyboard = kbMod.createKeyboard('second_player');
    var idKBoard = {message_id: msgID,
                    chat_id: chatID,
                    reply_markup: JSON.parse(keyboard)};
    bot.editMessageText(text, idKBoard);
    return;
  }


  if (msg.data === 'second_player') {
    // update JSON
    var json = JSON.parse(currentGames.get(key));
    json.p2 = [msg.from.id, msg.from.first_name, msg.from.last_name];
    json.layout = [' ',' ',' ',' ',' ',' ',' ',' ',' ',];
    json.turn = [json.p1[0], json.p1[1]];
    json.date = new Date();

    currentGames.set(key, JSON.stringify(json));

    var text = json.p1[1] + ' vs. ' + json.p2[1] +
              '! Let the battle begin!\n' +
              'It\'s ' + json.turn[1] + '\'s turn';

    var keyboard = kbMod.createKeyboard('gamestart');
    var idKBoard = {message_id: msgID,
                    chat_id: chatID,
                    reply_markup: JSON.parse(keyboard)};

    bot.editMessageText(text, idKBoard);
    return;
  }

  // Prep is over, here we get cells

  // check if key exists
  if (currentGames.get(key) === undefined) {
    bot.answerCallbackQuery(msg.id, 'Don\'t you dare mess their game!', false);
    return;
  }

  var json = JSON.parse(currentGames.get(key));

  // check if the right player hits
  if (json.turn[0] != msg.from.id) {
    bot.answerCallbackQuery(msg.id, 'Not your turn' + msg.from.first_name + '!', false);
    return;
  }

    var currentPlayer = '';
    var nextPlayer = [];
    if (json.turn[0] === json.p1[0]) {
      currentPlayer = '1';
      nextPlayer = json.p2;
    } else {
      currentPlayer = '2';
      nextPlayer = json.p1;
    }

    if (json.layout[msg.data] === ' ') {
      var updatedLayout = updateMoves(json.layout, msg.data, currentPlayer);
    } else {
      bot.answerCallbackQuery(msg.id, 'Uh-uh', false);
      return;
    }

    // update JSON
    json.layout = updatedLayout;

    // check if there's a win combination
    if (checker.checkIfWin(json.layout)) {
      var idKBoard = {message_id: msgID,
                      chat_id: chatID};

      bot.editMessageText(json.turn[1] + ' wins!', idKBoard);
        return;
      } else {
        console.log('I checked. No win');
    }

    json.turn = nextPlayer;
    json.date = new Date();

    currentGames.set(key, JSON.stringify(json));

    var keyboard = kbMod.createKeyboard('', updatedLayout);
    var idKBoard = {message_id: msgID,
                    chat_id: chatID,
                    reply_markup: JSON.parse(keyboard)};

   var text = json.turn[1] + '\'s turn!';

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
