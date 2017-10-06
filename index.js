const https = require('https');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
var googleTTS = require('google-tts-api');
const getEuro = require('./functions').getEuro;
const server_port = process.env.PORT || 8080;
 
const token = '466727526:AAFIHErebM9LwSPeYURJrCPQIFP8BL0jm0s';

const bot = new TelegramBot(token, {
    webHook: {
        port: server_port
    }
});

bot.setWebHook('https://telegram-bot-roman.herokuapp.com/bot'+token);

bot.onText(/\/echo (.+)/, (msg, match) => {
 
  const chatId = msg.chat.id;
  const resp = match[1];
 
  bot.sendMessage(chatId, resp);
});

bot.onText(/скажи (.+)/, (msg, match) => {
 
  const chatId = msg.chat.id;
  const resp = match[1];

  googleTtsApi(resp, 'uk', 1)
    .then(function (url) {
        console.log(url);
        const stream = fs.createReadStream(url);
        bot.sendAudio(chatId, stream);
    })
    .catch(function (err) {
        bot.sendMessage(chatId, "Помилка при зверненні до сервера");
    });
});

bot.onText(/курс/i, (msg, match) => {
    const chatId = msg.chat.id;
    getEuro((err, result) =>{
        if(err){
            bot.sendMessage(chatId, `<b> ${err.message} </b>`, {parse_mode : "HTML"});
        }
        else{
            console.log(result);
            for(let i=0; i<3; i++){
                bot.sendMessage(chatId, `<b>${result[i].currency.toUpperCase()}</b> \n <b>Покупка: ${result[i].ask} \n </b><b>Продаж: ${result[i].bid}</b>`, {parse_mode : "HTML"});
            }
        }
    });
});