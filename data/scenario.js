import {
    isDeveloper,
    isManager,
    job,
} from '../utils/job'
import level from '../utils/level'
import balance from '../utils/balance'
import {
    merge,
    lessBalance,
    lessKarma,
    moreBalance,
    moreKarma,
    moreLevel,
    muchLessBalance,
    muchMoreBalance,
    muchMoreKarma,
    muchMoreLevel,
} from '../utils/modifiers'

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

export default questions
