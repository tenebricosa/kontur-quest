const fs = require('fs')

const Telegraf = require('telegraf');
const session = require('telegraf/session')
const Router = require('telegraf/router')
const SocksProxyAgent = require('socks-proxy-agent');
const Markup = require('telegraf/markup');
import job from './utils/job.js';
import level from './utils/level.js';
import workLifeBalance from './utils/workLifeBalance.js';

const TELEGRAM_TOKEN = '757648727:AAHFbd0W5kjWsJ84TQeVnngtYzOc3PjuiHU';
const PROXY = 'socks://naumen:gp_is_the_best_department@g-sh.tech:1080';

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./users.db');

db.serialize(() => {
    db.run("create table if not exists users(user_id INTEGER PRIMARY KEY, info, stats, previous_games)")
})

const bot = new Telegraf(TELEGRAM_TOKEN, {
    telegram: {
        agent: new SocksProxyAgent(PROXY)
    }
});
bot.use(session({ ttl: 10 }))
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
            "good": {
                text: "Good",
                stats:
                {
                    experience: +1,
                    level: +1,
                    karma: +3,
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
            "one": {
                text: "Пройти одну стажировку",
                stats: {
                    experience: +21,
                    level: 0,
                    karma: 5,
                    workLifeBalance: 0
                },
                reaction: "lol",
                reaction_image: "./media/some.jpg"
            },
            "three": {
                text: "Пройти три стажировки",
                stats: {
                    experience: +63,
                    level: 0,
                    karma: 15,
                    workLifeBalance: 0,
                },
                reaction: "kek https://www.youtube.com/watch?v=evL_GkWBb0c",
            }
        }
    }
];

const defaultState = {
    experience: 1,
    level: level.junior,
    job: null,
    karma: 42,
    workLifeBalance: 0,
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
        },

    }
});

const getRandomQuestion = (req) => {
    return questions.slice(1)[Math.floor(Math.random() * (questions.length - 1))];
}

const select_next_question = (ctx) => {
    const allowableQestions = questions.slice(1).filter(question => {
        if (ctx.state.user.asked.indexOf(question.slug) >= 0) { return false }

        return Object.entries(question.filter).every(([state_name, value]) => {
            let result;

            if (state_name == 'job') { result = value.indexOf(job[ctx.state.user.job]) >= 0 }
            if (state_name == 'level') { result = value.indexOf(ctx.state.user.level) >= 0 }
            if (state_name == 'karma') { result = value[0] <= ctx.state.user.karma && ctx.state.user.karma < value[1] }
            if (state_name == 'experience') { result = value[0] <= ctx.state.user.experience && ctx.state.user.experience < value[1] }
            if (state_name == 'workLifeBalance') { result = value[0] <= ctx.state.user.workLifeBalance && ctx.state.user.workLifeBalance < value[1] }

            console.log(question.slug, 'state_name', state_name, ctx.state.user[state_name], value, result)
            return result
        })
    });

    console.log(allowableQestions.map((question) => { return question.slug }))

    if (!allowableQestions.length) {
        return
    }

    return getRandomQuestion(allowableQestions);
};

questions.map((question) => {
    calculator.on(question.slug, (ctx) => {
        db.serialize(() => {
            db.get("select stats from users where user_id = ?", [ctx.from.id], (err, row) => {
                ctx.state.user = JSON.parse(row.stats);
                console.log('reply pressed', ctx.state.lol)
                const user_id = ctx.from.id;

                const answer = question.answers[ctx.state.key];
                Object.entries(answer.stats).forEach(([key, value]) => {
                    console.log(ctx.state.user)
                    if (key == 'job') { ctx.state.user[key] = value; return }

                    ctx.state.user[key] += value;
                    if (ctx.state.user[key] > 100) { ctx.state.user[key] = 100 }
                    if (ctx.state.user[key] < 0) { ctx.state.user[key] = 0 }
                })

                // save to db current user state and what question was asked

                const next_question = select_next_question(ctx)

                if (!next_question) {
                    ctx.editMessageText(answer.reaction)
                    ctx.reply("КОНЕЦ")
                    return;
                }

                ctx.state.user.asked.push(next_question.slug);
                db.run("update users set stats = ? where user_id = ?", [JSON.stringify(ctx.state.user), ctx.from.id], () => {
                    ctx.editMessageText(answer.reaction).then(() => {

                        if (answer.reaction_image) {
                            ctx.replyWithPhoto({ source: fs.createReadStream(answer.reaction_image) })
                                .then(() => {
                                    ask_question(ctx, next_question)
                                })
                            return
                        }
                        ask_question(ctx, next_question)
                    })
                })
            })
        })

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
    db.serialize(() => {
        var stmt = db.prepare("INSERT OR IGNORE INTO users(user_id, info, stats, previous_games) VALUES (?, ?, ?, '[]')");

        stmt.run([ctx.from.id, JSON.stringify(ctx.from), JSON.stringify(defaultState)])
        db.get("select stats, previous_games from users where user_id = ?", [ctx.from.id], (err, row) => {
            ctx.state.user = JSON.parse(row.stats);
            console.log(ctx.state.user)
            console.log('asked', ctx.state.user.asked.length)
            if (ctx.state.user.asked.length) {
                console.log('reset game')
                const previous_game = JSON.parse(row.stats);
                const previous_games = JSON.parse(row.previous_games);
                previous_games.push(previous_game)
                db.run("update users set stats = ?, previous_games = ? where user_id = ?", [JSON.stringify(defaultState), JSON.stringify(previous_games), ctx.from.id], () => {
                    ctx.state.user = defaultState;
                    ask_question(ctx, questions[0])
                });
            }
            else {
                ask_question(ctx, questions[0])
            }
        })
    })
    // users.push(ctx.from.user_id).push(ctx.from)
});

bot.launch();
