const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const EventModel = require('./models')
const {Sequelize} = require("sequelize");
const PORT = 8000;

const token = '5727297877:AAHXOLPsFjTNl80Dmmqz7PONLVUQ6e2dXKQ';
const webAppUrl = 'https://unrivaled-zabaione-164aa2.netlify.app/';
const webAppUrlForm = 'https://unrivaled-zabaione-164aa2.netlify.app/form';

const bot = new TelegramBot(token, {polling: true});
const app = express();

const start = async () => {
    app.use(express.json());
    app.use(cors());

    try {
        await sequelize.authenticate()
        await sequelize.sync()
    } catch (e) {
        console.log('Подключение к БД не удалось', e)
    }

    bot.setMyCommands([
        {command: '/start', description: 'Начало работы бота'},
        {command: '/list', description: 'Мероприятия'},
        {command: '/create', description: 'Создание мероприятия'},
        {command: '/info', description: 'Информация о проекте'},
    ])

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === '/start') {
            await bot.sendPhoto(chatId, './nivent.jpg');
            await bot.sendMessage(chatId, 'Добро пожаловать в бот Nivent! Здесь вы можете найти интересующее мероприятие или объявить о проведении своего события.', {
                reply_markup: {
                    remove_keyboard: true,
                }});
            await bot.sendMessage(chatId, 'Для продолжения нажмите на Menu (кнопка выбора команд для бота)');
            await bot.sendMessage(chatId, 'Для ознакомления с сервисом и командами бота нажмите команду /info');
        }

        if (text === '/list') {
            await bot.sendMessage(chatId, 'Мероприятия можно посмотреть ниже', {
                reply_markup: {
                    inline_keyboard: [
                        [{text: 'Мероприятия', web_app: {url: webAppUrl}}],
                    ]
                }
            })
        }

        if (text === '/info') {
            await bot.sendMessage(chatId, 'Информация о проекте (добавим потом)', {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{text: '1', }, {text: '2', }, {text: '3',}]
                    ]
                }
            });
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
                console.log(data)
                console.log('')
                console.log('')

                const newEvent = await EventModel.create({
                    name: data.name,
                    info: data.info,
                    date_begin: data.date_begin,
                    time_begin: data.time_begin,
                    date_end: data.date_end,
                    time_end: data.time_end,
                    link: data.link,
                    link_tg: data.link_tg,
                    address: data.address,
                    subject: data.subject,
                    price: '1',
                })
                console.log(newEvent)

                await bot.sendMessage(chatId, 'Вы создали мероприятие!')
                await bot.sendMessage(chatId, 'Информация о созданном мероприятии: ');

                setTimeout(async () => {
                    await bot.sendMessage(chatId, `Название: ${data.name}\nИнформация: ${data.info}\nДата начала: ${data.date_begin}\nВремя начала: ${data.time_begin}\nДата окончания: ${data.date_end}\nВремя окончания: ${data.time_end}\nСсылка на мероприятие: ${data.link}\nСсылка на обратную связь: ${data.link_tg}\nАдрес: ${data.address}\nКатегория: ${data.subject}`);
                /*    await bot.sendMessage(chatId, 'Информация: ' + data.info);
                    await bot.sendMessage(chatId, 'Дата начала: ' + data.date_begin);
                    await bot.sendMessage(chatId, 'Время начала: ' + data.time_begin);
                    await bot.sendMessage(chatId, 'Дата окончания: ' + data.date_end);
                    await bot.sendMessage(chatId, 'Время окончания: ' + data.time_end);
                    //await bot.sendMessage(chatId, 'Ссылка на мероприятие: ' + data.link);
                    await bot.sendMessage(chatId, 'Адрес: ' + data.address);
                    await bot.sendMessage(chatId, 'Тег: ' + data.subject); */
                }, 1000)
            } catch (e) {
                console.log(e);
            }
        }
    });

    app.get('/web-data', async (req, res) => {
        const events = await EventModel.findAll()

        res.json(events)
        console.log(events)
    })

    app.post('/web-data', async (req, res) => {
        const {queryId, idEvent, totalPrice} = req.body;
        console.log(idEvent);

        try {
            await bot.answerWebAppQuery(queryId, {
                type: 'article',
                id: queryId,
                title: 'Вы выбрали мероприятия!',
                input_message_content: {
                    message_text: `Выбрано мероприятий: ${totalPrice}\n\nМероприятия:\n\n${idEvent.map(item => "Название мероприятия:\n" + item.name + "\nСсылка на мероприятие:\n " + item.link + "\nСсылка на обратную связь:\n " + item.link_tg + "\nИнформация о мероприятии:\n " + item.info + "\nДата начала:\n " + item.date_begin + "\nВремя начала:\n " + item.time_begin + "\nДата окончания:\n " + item.date_end + "\nВремя окончания:\n " + item.time_end + "\nАдрес:\n " + item.address + "\nКатегория мероприятия:\n " + item.subject + "\n" + "\n").join('')}`
                }
            })
            return res.status(200).json({});
        } catch (e) {
            return res.status(500).json({})
        }
    })

    app.get('/web-data/:subject', async (req, res) => {
        const subjectEvents = req.params.subject;
        const events = await EventModel.findAll({
            where: {
                subject: subjectEvents,
            }
        })

        res.json(events)
        console.log(events)
    })

    app.listen(PORT, () => console.log('server started on PORT ' + PORT));
}

start();