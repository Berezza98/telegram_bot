const TelegramBot = require('node-telegram-bot-api');
const getEuro = require('./functions').getEuro;
 
const token = '466727526:AAFIHErebM9LwSPeYURJrCPQIFP8BL0jm0s';
const bot = new TelegramBot(token, {polling: true});
bot.onText(/\/echo (.+)/, (msg, match) => {
 
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever" 
 
  // send back the matched "whatever" to the chat 
  bot.sendMessage(chatId, resp);
});

bot.onText(/buttons/, (msg, match) => {
 
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome User", {
    "reply_markup": {
        "keyboard": [["Меню"], ["Доставка на дом"], ["Заказ столика"]]
        }
    });
});

bot.onText(/курс/, (msg, match) => {
    const chatId = msg.chat.id;
    getEuro((err, result) =>{
        if(err){
            bot.sendMessage(chatId, `<b> ${err.message} </b>`, {parse_mode : "HTML"});
        }
        else{
            console.log(result);
            for(let i=0; i<3; i++){
                bot.sendMessage(chatId, `<b>${result[i].currency.toUpperCase()}</b> <b>Покупка: ${result[i].ask}; </b><b>Продаж: ${result[i].bid}</b>`, {parse_mode : "HTML"});
            }
        }
    });
});