const https = require('https');
const TelegramBot = require('node-telegram-bot-api');
const getEuro = require('./functions').getEuro;
const server_port = process.env.PORT || 8080;
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
 
const token = '466727526:AAFIHErebM9LwSPeYURJrCPQIFP8BL0jm0s';
const bot = new TelegramBot(token);
bot.setWebHook('https://git.heroku.com/telegram-bot-roman.git/bot');

const app = new Koa();

const router = Router();
router.post('/bot', ctx => {
    const {body} = ctx.request;
    bot.processUpdate(body);
    ctx.status = 200;
});

app.use(bodyParser());
app.use(router.routes());
app.listen(server_port);
bot.onText(/\/echo (.+)/, (msg, match) => {
 
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever" 
 
  // send back the matched "whatever" to the chat 
  bot.sendMessage(chatId, resp);
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
                bot.sendMessage(chatId, `<b>${result[i].currency.toUpperCase()}</b> \n <b>Покупка: ${result[i].ask} \n </b><b>Продаж: ${result[i].bid}</b>`, {parse_mode : "HTML"});
            }
        }
    });
});