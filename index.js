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

var firebaseConfig = {
    apiKey: "AIzaSyDl6DGGEslZzt7xDWJ0JZcnqaTzPWtxqrA",
    authDomain: "kontur-quest.firebaseapp.com",
    databaseURL: "https://kontur-quest.firebaseio.com",
    projectId: "kontur-quest",
    storageBucket: "kontur-quest.appspot.com",
    messagingSenderId: "93021058821",
    appId: "1:93021058821:web:7d898b4b76a2b9b7"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.app().database().ref();
const users = database.child('/documents')

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
        asked: 0,
        answers: job_answers
    },
    {   
        slug: "hello",
        text: "hello how are you?",
        filter: {
            experience: [0, 100],
        },
        asked: 0,
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
            level: [level.junior, level.middle],
            job: [job.backend, job.datascientist, job.frontend]
        },
        answers: {
            "one":{
                text: "Пройти одну стажировку",
                stats: {
                    experience: +21,
                    level: 0,
                    karma: 5,
                    workLifeBalance: 0
                },
                reaction: "lol"
            },
            "three": {
                text: "Пройти три стажировки",
                stats: {
                    experience: +63,
                    level: 0,
                    karma: 15,
                    workLifeBalance: 0,
                },
                reaction: "kek"
            }
        }
    }
];

const defaultState = {
    experience: 1,
    level: level.junior,
    job: null,
    karma: 42,
    workLifeBalance: workLifeBalance.perfect,
    asked: []
}

const calculator = new Router(({ callbackQuery }) => {
    if (!callbackQuery.data) {
      return
    }
    const parts = callbackQuery.data.split(':')
    return {
      route: parts[0],
      state: {
        key: parts[1],
        user: defaultState
      },
      
    }
});

const getRandomQuestion = (req) => {
    return questions.slice(1)[Math.floor(Math.random() * (questions.length -1))];
}

const select_next_question = (ctx) => {
    const allowableQestions = questions.slice(1).filter(question => {
        if (question.slug in ctx.state.user.asked) {return false}

        return Object.entries(question.filter).every(([state_name, value]) => {
            let result;

            if (state_name == 'job') { result = job[ctx.state.user.job] in value }
            if (state_name == 'level') { result = ctx.state.user.level in value }
            if (state_name == 'karma') { result = value[0] <= ctx.state.user.karma && ctx.state.user.karma < value[1] }
            if (state_name == 'experience') { result = value[0] <= ctx.state.user.experience && ctx.state.user.experience < value[1] }
            if (state_name == 'workLifeBalance') { result = value[0] <= ctx.state.user.workLifeBalance && ctx.state.user.workLifeBalance < value[1] }

            console.log(question.slug, 'state_name', state_name, ctx.state.user[state_name], value, result)
            return result
        })
    });

    console.log(allowableQestions.map((question) => {return question.slug}))

    if (!allowableQestions.length) {
        return
    }

    return getRandomQuestion(allowableQestions);
};

questions.map((question) => {
    calculator.on(question.slug, (ctx) => {
        console.log('reply pressed', ctx.state.lol)
        const user_id = ctx.from.id;

        const answer = question.answers[ctx.state.key];
        Object.entries(answer.stats).forEach(([key, value]) => {
            console.log(ctx.state.user)
            if (key == 'job') { ctx.state.user[key] = value; return }

            ctx.state.user[key] += value;
            if (ctx.state.user[key] > 100) {ctx.state.user[key] = 100}
            if (ctx.state.user[key] < 0) {ctx.state.user[key] = 0}
        })

        // save to db current user state and what question was asked
        
        const next_question = select_next_question(ctx)
        // return 
        return ctx.editMessageText(answer.reaction).then(() => {
            if (!next_question) {
                ctx.reply("КОНЕЦ")
                return;
            }
            ask_question(ctx, next_question)})
    });
});

const ask_question = (ctx, question) => {
    // ctx.state.user.asked.push(question.slug)
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
    users.push(ctx.from.user_id).push(ctx.from)
    ask_question(ctx, questions[0])
});

bot.launch();