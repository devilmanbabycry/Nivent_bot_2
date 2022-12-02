const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const EventModel = require('./models')
const {Sequelize} = require("sequelize");
const events = require("events");
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
            await bot.sendMessage(chatId, '1. Инструкция использования бота \n' +
                '2. Общая информация о проекте\n' +
                '3. Обратная связь, сотрудничество', {
                reply_markup: {
                    resize_keyboard: true,
                    keyboard: [
                        [{text: '1', }, {text: '2', }, {text: '3',}]
                    ]
                }
            });
        }

        if (text === '1'){
            await bot.sendMessage(chatId, 'Использование бота осуществялется следующими командами:\n\n' +
                '/list - команда для просмотра запланированных мероприятий.\n' +
                'При нажатии на команду вам выскакивает кнопка "Мероприятия", после нажатия открывается форма со всеми мероприятиями. ' +
                'Вы можете узнать подробную информацию о мероприятии нажав на него и записаться на него нажав на кнопку "+"' +
                'После нажатия на "+" появиться кнопка "Записаться на мероприятие". Она осуществляет вывод информации о мероприятии вам в чат.\n\n' +
                '/create - команда для создания мероприятия.\n' +
                'После нажатия на команду у вас под клавиатурой появляется кнопка "Форма для создания мероприятия. Она открывает форму для заполнения данных по мероприятию.\n' +
                'После заполнения всех пунктов формы появляется кнопка "Создать мероприятие"')
        }
        if (text === '2'){
            await bot.sendMessage(chatId, 'Общая информация о проекте\n' +
                'Телеграмм бот для поиска мероприятий с широким фильтром по вашим интересам. Найди интересующее мероприятие или объяви о своём')
        }
        if (text === '3'){
            await bot.sendMessage(chatId, 'Для связи с администрацей напишите на электронную почту nivent.bot@gmail.com')
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

    app.delete('/web-data/:id', async (req, res) => {
        const userId = req.params.id;
        console.log(userId)

        await Sequelize.Event.destroy({
            where: {
                id: userId,
            }
        })

        res.send(`Удаление успешно ${userId}`)
    })



    app.listen(PORT, () => console.log('server started on PORT ' + PORT));
}

start();