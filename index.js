const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const EventModel = require('./models')

const token = '5727297877:AAHXOLPsFjTNl80Dmmqz7PONLVUQ6e2dXKQ';
const webAppUrl = 'https://unrivaled-zabaione-164aa2.netlify.app/';
const webAppUrlForm = 'https://unrivaled-zabaione-164aa2.netlify.app/form';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Подключение к БД не удалось', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начало работы бота'},
        {command: '/list', description: 'Мероприятия'},
        {command: '/info', description: 'Информация о проекте'},
        {command: '/create', description: 'Создание мероприятия'},
    ])

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === '/start') {
            await bot.sendMessage(chatId, 'Бот находится в разработке, загляните позже');
        }

        if (text === '/list') {
            await bot.sendMessage(chatId, 'Мероприятия можно посмотреть ниже', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Мероприятия', web_app: {url: webAppUrl}}]
                    ]
                }
            })
        }

        if (text === '/info') {
            await bot.sendMessage(chatId, 'Информация о проекте (добавим потом)');
        }

        if (text === '/create') {
            await bot.sendMessage(chatId, 'Введите информацию о мероприятии в форме ниже.', {
                reply_markup: {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: [
                        [{text: 'Форма для создания мероприятий', web_app: {url: webAppUrlForm}}],
                    ]
                }
            })
        }

        if (msg?.web_app_data?.data) {
            try {
                const data = JSON.parse(msg?.web_app_data?.data)
                //console.log(data)

                const newEvent = await EventModel.create({
                    name: data.name,
                    info: data.info,
                    date: data.date,
                    time: data.time,
                    address: data.address,
                    subject: data.subject,
                })
                console.log(newEvent)

                await bot.sendMessage(chatId, 'Вы создали мероприятие!')
                await bot.sendMessage(chatId, 'Информация о созданном мероприятии: ');

                setTimeout(async () => {
                    await bot.sendMessage(chatId, 'Название: ' + data.name);
                    await bot.sendMessage(chatId, 'Информация: ' + data.info);
                    await bot.sendMessage(chatId, 'Дата: ' + data.date);
                    await bot.sendMessage(chatId, 'Время: ' + data.time);
                    //await bot.sendMessage(chatId, 'Ссылка на онлайн мероприятие: ' + data.link);
                    await bot.sendMessage(chatId, 'Адрес: ' + data.address);
                    await bot.sendMessage(chatId, 'Тег: ' + data.subject);
                }, 1000)
            } catch (e) {
                console.log(e);
            }
        }
    });

    /*
    app.post('/web-data', async (req, res) => {
        const {queryId, products = [], totalPrice} = req.body;
        try {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Успешная покупка',
                input_message_content: {
                    message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
                }
            })
            return res.status(200).json({});
        } catch (e) {
            return res.status(500).json({})
        }
    }) */

    const PORT = 8000;

    app.listen(PORT, () => console.log('server started on PORT ' + PORT))
}

start();