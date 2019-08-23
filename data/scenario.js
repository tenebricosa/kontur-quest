import { job, isDeveloper } from '../utils/job'

function up(number, coefficient, limit = 1) {
    return Math.min(number * (1 + coefficient), limit)
}

function down(number, coefficient, limit = 0) {
    return Math.max(number * (1 - coefficient), limit)
}

function moreDays(stats) {
    return {
        days: stats.days + 21
    }
}

function moreKarma(stats) {
    return {
        karma: up(stats.karma, 0.05)
    }
}

function muchMoreKarma(stats) {
    return {
        karma: up(stats.karma, 0.10)
    }
}

function lessBalance(stats) {
    return {
        balance: down(stats.balance, 0.10)
    }
}

let job_answers = {}

Object.keys(job).forEach((name) => {
    job_answers[name] = {
        text: job[name],
        reaction: `Класс 🤘\nДержи футболку с каламбуром 🐑`,
        reaction_image: "./media/kontur-sheep.jpg",
        stats: x => merge(x, {
            job: name
        })
    }
})

const questions = [
    {
        slug: "job",
        text: `Это квест про жизнь в Контуре ⛅️\nДавай знакомиться 👋\nСегодня ты...`,
        answers: job_answers
    },
    {
        slug: "bootcamp",
        filter: user => user.days <= 90 && user.job !== job.productManager,
        text: "Как все новички, ты попал в Буткамп. Тебя ждёт командировка в Екатеринбург, две недели обучения, " +
            "а затем — несколько стажировок по выбору, чтобы найти команду мечты",
        answers: {
            "three": {
                text: "Три стажировки? Отлично!",
                reaction: "Оказалось, что так-то просто переключать контекст раз в несколько недель 🤪, " +
                    "но ты справился? Ура, теперь ты в отличной команде 😍",
                stats: x => merge(x, [
                    muchMoreKarma,
                    lessBalance,
                ])
            },
            "one": {
                text: "Хватит и одной стажировки",
                reaction: `Вроде, неплохая команда? 🙂`,
                stats: x => merge(x, [
                    moreKarma
                ])
            }
        }
    }
]

function merge(stats, modifiers = []) {
    const newStats = !Array.isArray(modifiers)
        ? modifiers
        : modifiers.reduce((stats, modifier) => ({
            ...stats,
            ...modifier(stats)
        }), stats)

    return {
        ...stats,
        ...moreDays(stats),
        ...newStats
    }
}

export default questions
