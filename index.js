const Telegraf = require('telegraf');
const session = require('telegraf/session')
const Router = require('telegraf/router')
const SocksProxyAgent = require('socks-proxy-agent');
const Markup = require('telegraf/markup');
const firebase = require('firebase');
import * as scenario from './data/scenario.js';
import job from './utils/job.js';
import level from './utils/level.js';
import workLifeBalance from './utils/workLifeBalance.js';

const TELEGRAM_TOKEN = '757648727:AAHFbd0W5kjWsJ84TQeVnngtYzOc3PjuiHU';
const PROXY = 'socks://naumen:gp_is_the_best_department@g-sh.tech:1080';

const bot = new Telegraf(TELEGRAM_TOKEN, {
    telegram: {
        agent: new SocksProxyAgent(PROXY)
    }
});
bot.use(session({ ttl: 10 }))

const app = firebase.initializeApp({
    apiKey: "AIzaSyDl6DGGEslZzt7xDWJ0JZcnqaTzPWtxqrA",
    authDomain: "kontur-quest.firebaseapp.com",
    databaseURL: "https://kontur-quest.firebaseio.com",
    projectId: "kontur-quest",
    storageBucket: "",
    messagingSenderId: "93021058821",
    appId: "1:93021058821:web:7d898b4b76a2b9b7"
});

const ref = firebase.database().ref();
// const jobs = ref.child("jobs");

//bot logic

let job_answers = {}

Object.keys(job).forEach((name) => { 

    job_answers[name] = {
        text: job[name],
        reaction: "Мы ололо",
        stats: {
            job: name
        }
    }
});

const questions = [
    {
        slug: "job",
        text: "Где работаешь, пёс?",
        filter: {},
        answers: job_answers
    },
    {   
        slug: "hello",
        text: "hello how are you?",
        filter: {
            experience: [0, 100],
        },
        answers: {
            "good":{
                text: "Good",
                stats:
                {
                    experience: +1,
                    level: +1,
                    karma: +3,
                    job: "test1",
                    workLifeBalance: +3
                },
                reaction: "Ты хорош"
            },
            "bad": {
                text: "Bad",
                stats: {
                    experience: +3,
                    level: +3,
                    karma: -4,
                    job: "test2",
                    workLifeBalance: +0,
                },
                reaction: 'Сэд бад тру'
            }
        }
    },
    {
        slug: "bootcamp",
        text: "Как все новички, ты попал в Буткамп. Тебя ждут две недели обучения и несколько стажировок, чтобы выбрать наиболее подходящую команду...",
        filter: {
            level: [1, 2]
        },
        answers: {
            "one":{
                text: "Пройти одну стажировку",
                stats: {
                    experience: +21,
                    level: 0,
                    karma: 5,
                    workLifeBalance: 0
                }
            },
            "three": {
                text: "Пройти три стажировки",
                stats: {
                    experience: +63,
                    level: 0,
                    karma: 15,
                    workLifeBalance: 0,
                }
            }
        }
    }
];

const defaultState = {
    experience: 1,
    level: level.junior,
    job: null,
    karma: 42,
    workLifeBalance: workLifeBalance.perfect
}

const calculator = new Router(({ callbackQuery }) => {
    if (!callbackQuery.data) {
      return
    }
    const parts = callbackQuery.data.split(':')
    return {
      route: parts[0],
      state: {
        key: parts[1]
      }
    }
});

const select_next_question = (ctx) => {
    // filter by user stats + random
    return questions[1]
};

questions.map((question) => {
    calculator.on(question.slug, (ctx) => {
        console.log('reply pressed')
        const user_id = ctx.from.id;

        const answer = question.answers[ctx.state.key];
        Object.keys(answer.stats).forEach((value) => 
        // if value == ''
            ctx.user[value] += asnwer.stats[value]
        )

        // save to db current user state and what question was asked
        
        const next_question = select_next_question(ctx)

        return ctx.editMessageText(answer.reaction).then(() => {ask_question(ctx, next_question)})
    });
});

const ask_question = (ctx, question) => {
    let buttons = Object.keys(question.answers).map((key) => { 
        const asnwer = question.answers[key];
        return Markup.callbackButton(asnwer.text, question.slug + ":" + key) 
    })

    ctx.reply(question.text, Markup.inlineKeyboard(buttons, { columns: 1 })
        .oneTime()
        .resize()
        .extra()
    )
};

bot.on('callback_query', calculator)

bot.start((ctx) => {
    console.log('started')
    // ctx.user = defaultState.copy();
    ask_question(ctx, questions[0])
});

bot.launch();