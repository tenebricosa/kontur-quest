const fs = require('fs')

const Telegraf = require('telegraf');
const session = require('telegraf/session')
const Router = require('telegraf/router')
const SocksProxyAgent = require('socks-proxy-agent');
const Markup = require('telegraf/markup');
import questions from './data/scenario'
import level from './utils/level.js';

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

const defaultState = {
    days: 1,
    level: level.junior,
    job: null,
    karma: 0.5,
    balance: 0.5,
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

const getRandomQuestion = questions => {
    return questions.slice(1)[Math.floor(Math.random() * (questions.length - 1))];
}

const select_next_question = (ctx, current_question) => {
    const allowableQestions = questions.slice(1).filter(question => {
        if (question.slug == current_question.slug) { return false }
        if (ctx.state.user.asked.indexOf(question.slug) >= 0) { return false }

        return question.filter === undefined || question.filter(ctx.state.user)
    });

    if (!allowableQestions.length) {
        return;
    }

    return getRandomQuestion(allowableQestions);
};

const names = {
    days: "Стаж",
    level: "Опыт",
    job: "Профессия",
    karma: "Карма",
    balance: "Баланс работы и личной жизни",
}

const show_status = stats => {
    let text = "";

    Object.entries(stats).forEach(([key, value]) => {
        if (!isNaN(value) && value > 0) {
            text += names[key] + ": +" + value
        }
        else {
            text += names[key] + ": " + value
        }
        text += '\n'
    })
    return text
}

questions.map((question) => {
    calculator.on(question.slug, (ctx) => {
        db.serialize(() => {
            db.get("select stats from users where user_id = ?", [ctx.from.id], (err, row) => {
                if (err) {
                    return
                }

                ctx.state.user = JSON.parse(row.stats);

                if (ctx.state.user.asked.indexOf(question.slug) >= 0) { return }

                const user_id = ctx.from.id;

                const answer = question.answers[ctx.state.key];

                if (answer.stats !== undefined) {
                    ctx.state.user = answer.stats(ctx.state.user)
                }
                ctx.state.user.asked.push(question.slug);
                const next_question = select_next_question(ctx, question)

                db.run("update users set stats = ? where user_id = ?", [JSON.stringify(ctx.state.user), ctx.from.id], () => {
                    if (!next_question) {
                        ctx.reply(show_status(ctx.state.user)).then(() => {
                            ctx.editMessageText(answer.reaction)
                            ctx.reply("КОНЕЦ")
                        })

                        return;
                    }

                    ctx.editMessageText(answer.reaction).then(() => {

                        if (answer.reaction_image) {
                            ctx.replyWithPhoto({ source: fs.createReadStream(answer.reaction_image) })
                                .then(() => {
                                    ctx.reply(show_status(ctx.state.user)).then(() => {
                                        ask_question(ctx, next_question)

                                    })

                                })
                            return
                        }
                        ctx.reply(show_status(ctx.state.user)).then(() => {
                            ask_question(ctx, next_question)
                        })
                    })
                })
            })
        })

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

bot.on('callback_query', calculator);

bot.start((ctx) => {
    db.serialize(() => {
        var stmt = db.prepare("INSERT OR IGNORE INTO users(user_id, info, stats, previous_games) VALUES (?, ?, ?, '[]')");

        stmt.run([ctx.from.id, JSON.stringify(ctx.from), JSON.stringify(defaultState)])
        db.get("select stats, previous_games from users where user_id = ?", [ctx.from.id], (err, row) => {
            ctx.state.user = JSON.parse(row.stats);
            if (ctx.state.user.asked.length) {
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
});

bot.launch();
