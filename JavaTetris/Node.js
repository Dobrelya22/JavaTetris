const { Telegraf } = require('telegraf');

const bot = new Telegraf('8049532791:AAEB0x2uDL977-tLMg0hVcfDKDLSRcXv9Hg'); // Замени на токен своего бота

const GAME_SHORT_NAME = 'mytetrisgame'; // Замени на короткое имя твоей игры

bot.start((ctx) => {
  ctx.reply('Добро пожаловать! Нажми кнопку, чтобы начать играть.', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Играть в Тетрис', callback_game: { }, callback_data: 'start_game' }]
      ]
    }
  });
});

bot.action('start_game', (ctx) => {
  ctx.answerCbQuery();
  ctx.replyWithGame(GAME_SHORT_NAME);
});

bot.on('callback_query', (ctx) => {
  ctx.answerGameQuery();
});

bot.launch();
