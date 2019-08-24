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

export const questions = [
    {
        slug: "job",
        title: "Контуровец",
        text: `Это квест про жизнь в Контуре ⛅️\nДавай знакомиться 👋\nСегодня ты...`,
        answers: job_answers
    },
    {
        slug: "bootcamp",
        title: "Буткамп",
        filter: user => user.days < 180,
        text: "Как все новички, ты попал в Буткамп. Тебя ждёт командировка в Екатеринбург, две недели обучения, " +
            "а затем — несколько стажировок по выбору, чтобы найти команду мечты",
        answers: {
            "three": {
                text: "Три стажировки? Отлично!",
                reaction: "Оказалось, что так-то просто переключать контекст раз в несколько недель 🤪, " +
                    "но ты справился. Ура, теперь ты в отличной команде 😍",
                stats: x => merge(x, [
                    muchMoreKarma,
                    lessBalance,
                ])
            },
            "one": {
                text: "Хватит и одной стажировки",
                reaction: `Вроде, неплохая команда? 🙂`,
                stats: x => merge(x, [
                    moreKarma,
                ])
            }
        }
    },
    {
        slug: "hackathon-org",
        title: "Организация хакатона",
        filter: user => user.days < 1500 && !isManager(user.job),
        text: "Коллега предложил тебе стать одним из организаторов ежегодного хакатона. Год назад там " +
            "[разрабатывали игры](https://habr.com/ru/company/skbkontur/blog/414817/) 🎮, а в этом году вообще была " +
            "[урбанистика](https://tech.kontur.ru/events/urbathon) 😝",
        answers: {
            "yes": {
                text: "Согласиться",
                reaction: "Прикольно, конечно. А куда уходит свободное время? 😕",
                stats: x => merge(x, [
                    moreKarma,
                    lessBalance,
                ])
            },
            "no": {
                text: "Отказаться",
                reaction: `Не очень-то и хотелось 😶`,
                stats: x => merge(x, [
                    lessKarma,
                ])
            }
        }
    },
    {
        slug: "meetup-org",
        title: "Организация митапа",
        filter: user => user.days < 1500 && !isManager(user.job),
        text: "Коллега предложил тебе стать одним из организаторов митапа в " +
            "[следующем месяце](https://eventskbkontur.timepad.ru/events/)",
        answers: {
            "yes": {
                text: "Согласиться",
                reaction: "Прикольно, конечно. Но куда уходит свободное время? 😕",
                stats: x => merge(x, [
                    moreKarma,
                    lessBalance,
                ])
            },
            "no": {
                text: "Отказаться",
                reaction: `Не очень-то и хотелось 😶`,
                stats: x => merge(x, [
                    lessKarma,
                ])
            }
        }
    },
    {
        slug: "community-org",
        title: "Организация сообщества",
        filter: user => user.days < 1500 && !isManager(user.job),
        text: "Ты захотел стать лидером нового сообщества, как " +
            "[тестировщики в Екатеринбурге](https://tech.kontur.ru/friends/utc). Можно встречаться, проводить митапы, " +
            "делать совместные движухи 😌",
        answers: {
            "yes": {
                text: "Решиться",
                reaction: "Ура, меня теперь все знают! 😎",
                stats: x => merge(x, [
                    muchMoreKarma,
                    lessBalance,
                ])
            },
            "no": {
                text: "Передумать",
                reaction: `В другой раз! 😏`,
                stats: x => merge(x, [
                    lessKarma,
                ])
            }
        }
    },
    {
        slug: "konfur",
        title: "КонфУР",
        filter: user => user.days > 45,
        text: "Через месяц будет КонфУР — ежегодная внутренняя конференция инженерного подразделения с докладами, " +
            "мастер-классами, «Что? Где? Когда?», блек-джеком... ну ты понял 😆",
        answers: {
            "miss": {
                text: "Пропустить",
                reaction: "Конференции для бездельников, зато пять тикетов переехали из TODO в DONE 🤘",
                stats: x => merge(x, [
                    muchMoreLevel,
                ])
            },
            "go": {
                text: "Интересно, надо ехать",
                reaction: `Ого, это весело 🥳 Надо в другой раз сделать доклад...`,
                stats: x => merge(x, [
                    moreLevel,
                    moreBalance,
                ])
            },
            "talk": {
                text: "Сделать доклад",
                reaction: `Куда делась рабочая неделя? 😡 Правда, после доклада похлопали, неплохо 🙃`,
                stats: x => merge(x, [
                    moreLevel,
                    muchMoreKarma,
                    muchLessBalance,
                ])
            },
            "workshop": {
                text: "Провести мастер-класс",
                reaction: `Куда делась рабочая неделя? 😡 Вроде, всем понравилось, неплохо 🙃`,
                stats: x => merge(x, [
                    moreLevel,
                    muchMoreKarma,
                    muchLessBalance,
                ])
            }
        }
    },
    {
        slug: "conference-talk",
        title: "Доклад на конференции",
        filter: user => user.days > 700,
        text: "Ты подумал, что можно сделать доклад на большой конференции. Вон, [Кирпичников](https://tech.kontur.ru/people/alexkir) же рассказывает про слабо полностью антисимметричные квазигруппы десятого порядка...",
        answers: {
            "yes-conference": {
                text: "Сделать и выступить",
                reaction: "400 человек в зале! Ничего себе 😜",
                stats: x => merge(x, [
                    muchMoreLevel,
                    muchMoreKarma,
                    muchLessBalance,
                ])
            },
            "yes-meetup": {
                text: "Выступить, но на митапе",
                reaction: "Было тепло и лампово. Теперь можно и на конференцию 😇",
                stats: x => merge(x, [
                    moreLevel,
                    moreKarma,
                    lessBalance,
                ])
            },
            "no": {
                text: "Не торопиться",
                reaction: `Надо бояться своих желаний 😏`,
                stats: x => merge(x, [])
            }
        }
    },
    {
        slug: "conference-booth",
        title: "Стенд на конференции",
        filter: user => user.days > 365 && !isManager(user.job),
        text: "Тебе предложили поехать на стенд Контура на конференции. Там можно рассказывать про команду, " +
            "любимые технологии, а ещё сходить на пару докладов",
        answers: {
            "yes": {
                text: "Поехать, почему нет",
                reaction: "Два дня на ногах и афтепати — это сложно, но можно и повторить 😜",
                stats: x => merge(x, [
                    moreKarma,
                ])
            },
            "no": {
                text: "Спасибо, не нужно",
                reaction: `Лучше никуда не ездить, а бэклог расчистить 😏`,
                stats: x => merge(x, [
                    moreLevel,
                    moreBalance
                ])
            }
        }
    },
    {
        slug: "habr-post",
        title: "Статья на Хабре",
        filter: user => user.days > 200 && (isDeveloper(user.job) || user.job === job.qa),
        text: "Ты захотел написать пост на Хабр о недавней дурацкой задаче, на которой пришлось съесть собаку 🦴 " +
            "и бесконечно ловить баги 🐞",
        answers: {
            "yes-one": {
                text: "Написать пост",
                reaction: "Вроде, неплохо вышло. О чём бы ещё написать? ✍️",
                stats: x => merge(x, [
                    moreLevel,
                ])
            },
            "yes-many": {
                text: "Написать серию постов",
                reaction: "А неплохо кармы отсыпали. О чём бы ещё написать? ✍️",
                stats: x => merge(x, [
                    moreLevel,
                    lessBalance,
                ])
            },
            "no": {
                text: "Не писать ничего",
                reaction: `И правда, так свободного времени на чтение Хабра будет больше 😈`,
                stats: x => merge(x, [
                    moreBalance,
                ])
            }
        }
    },
    {
        slug: "team-lead",
        title: "Тимлид",
        filter: user => user.days > 365 && user.level > level.junior && user.karma > 0.6 && !isManager(user.job),
        text: "Команда делится на две подкоманды и похоже, что ты можешь стать тимлидом одной из подкоманд 🍏🍎",
        answers: {
            "yes": {
                text: "Стать тимлидом",
                reaction: "Интересно, это профессиональный рост или деградация... 🤔️",
                stats: x => merge(x, [
                    moreLevel,
                ])
            },
            "no": {
                text: "Написать серию постов",
                reaction: "А неплохо кармы отсыпали. О чём бы ещё написать? ✍️",
                stats: x => merge(x, [
                    moreLevel,
                    lessBalance,
                ])
            }
        }
    },
    {
        slug: "team-lead",
        title: "Тимлид",
        filter: user => user.days > 365 && user.level > level.junior && user.karma > 0.6 && !isManager(user.job),
        text: "Твоя [команда делится](https://www.youtube.com/watch?v=oT-uE93-rSU) на две подкоманды и похоже, " +
            "что ты можешь стать тимлидом одной из подкоманд 🍏🍎",
        answers: {
            "yes": {
                text: "Вызваться и стать тимлидом",
                reaction: "Интересно, это профессиональный рост или деградация... 🤔️",
                stats: x => merge(x, [
                    moreLevel,
                    lessBalance,
                ])
            },
            "no": {
                text: "Проигнорировать",
                reaction: "Ещё не весь код написан, пусть кто-нибудь другой тратит время на разговоры 😠",
                stats: x => merge(x, [])
            }
        }
    },
    {
        slug: "new-product",
        title: "Новый продукт",
        filter: user => user.days > 365 && user.level > level.middle && user.karma > 0.6,
        text: "Тебе предлагают собрать новую команду и за три месяца запустить новый продукт 📦",
        answers: {
            "yes": {
                text: "Согласиться",
                reaction: "Теперь главное не зафейлиться. Это будут жаркие три месяца 😈️",
                stats: x => merge(x, [
                    moreKarma,
                    muchLessBalance,
                ])
            },
            "no": {
                text: "Отказаться",
                reaction: "А текущий продукт кто будет писать? Бэклог сам себя не разберёт 😬",
                stats: x => merge(x, [
                    moreBalance,
                ])
            }
        }
    },
    {
        slug: "new-office",
        title: "Новый офис",
        filter: user => user.days > 700 && user.level > level.middle && user.karma > 0.7,
        text: "Тебе предлагают уехать в Сочи, открыть там новый [офис разработки](https://tech.kontur.ru/about), " +
            "уговорить переехать десяток разработчиков, а ещё дюжину — нанять на месте 🌍",
        answers: {
            "yes": {
                text: "Решиться и собрать чемоданы",
                reaction: "Вот это вызов, конечно️. Будет жарко ☀️",
                stats: x => merge(x, [
                    moreKarma,
                    muchLessBalance,
                ])
            },
            "no": {
                text: "Отказаться",
                reaction: "Какие-то разработчики... В Сочи... 🤷‍",
                stats: x => merge(x, [
                    moreBalance,
                ])
            }
        }
    },
    {
        slug: "open-source",
        title: "Open source",
        filter: user => user.days > 200 && isDeveloper(user.job),
        text: "Ты решил превратить в [open source](https://tech.kontur.ru/open-source) часть кода своего продукта " +
            "и выложить его на GitHub 🐙🐈",
        answers: {
            "yes": {
                text: "Написать README, выложить",
                reaction: "Отлично, теперь надо попросить всех поставить звёзду на GitHub ⭐️️",
                stats: x => merge(x, [
                    moreLevel,
                    lessBalance,
                ])
            },
            "no": {
                text: "Не выкладывать",
                reaction: "Кому нужны корпоративные велосипеды на GitHub? Понятно, что никому 🤧‍",
                stats: x => merge(x, [])
            }
        }
    },
    {
        slug: "guides",
        title: "Гайды",
        filter: user => user.days > 200 && (user.job === job.designer || user.job === job.usability),
        text: "Ты решил поделиться дизайнерским опытом и написать [публичный гайд](https://guides.kontur.ru) " +
            "по проектированию сложных интерфейсов 📖",
        answers: {
            "yes": {
                text: "Собраться и написать",
                reaction: "А неплохо получилось! Интересно, когда повится реализация гайда в виде React-компонентов?",
                stats: x => merge(x, [
                    moreLevel,
                    lessBalance,
                ])
            },
            "no": {
                text: "Не писать",
                reaction: "Бэклог сам себя не разберёт, и он рядом. А гайд где-то там, далеко 😞‍",
                stats: x => merge(x, [])
            }
        }
    },
    {
        slug: "performance-optimization",
        title: "Оптимизация производительности",
        filter: user => user.days > 700 && user.job === job.backend,
        text: "Ты захотел увеличить производительность своего продукта: сделать бенчмарки и ускорить критичные участки " +
            "с помощью [кодогенерации](https://tech.kontur.ru/backend)",
        answers: {
            "yes": {
                text: "Засучить рукава и сделать",
                reaction: "Это было непросто, зато теперь всё летает и два новых сервера не нужны 🥳",
                stats: x => merge(x, [
                    moreLevel,
                    moreKarma,
                ])
            },
            "no": {
                text: "Купить ещё два сервера",
                reaction: "Сейчас железо дешёвое, все это знают 😦‍",
                stats: x => merge(x, [
                    lessKarma,
                ])
            }
        }
    },
    {
        slug: "tech-stack",
        title: "Новый стек технологий",
        filter: user => user.days > 700 && isDeveloper(user.job),
        text: "Ты решил написать часть продукта на Elixir и почти придумал, что можно написать на Idris. " +
            "Осталось убедить других в ребят в команде, что этот код получится поддерживать 😏",
        answers: {
            "yes": {
                text: "Засучить рукава и сделать",
                reaction: "Ладно Elixir, но Idris! Это бьло непросто... 😭",
                stats: x => merge(x, [
                    moreLevel,
                    lessKarma,
                ])
            },
            "no": {
                text: "Выпить воды и успокоиться",
                reaction: "И правда, C# 8, Java 11 и Python 3 — наше всё 😎‍",
                stats: x => merge(x, [])
            }
        }
    },
    {
        slug: "fuckup",
        title: "Факап",
        filter: user => user.days > 200 && (isDeveloper(user.job) || user.job === job.teamManager),
        text: "Ты заметил уведомление в Slack — похоже, продакшн упал и случился факап. Кажется, ты можешь всё " +
            "починить и [написать постмортем](https://www.youtube.com/watch?v=a5kq-Yk28po&feature=youtu.be&t=4063)",
        answers: {
            "yes": {
                text: "Починить факап и лечь спать",
                reaction: "Постмортемы — это прекрасно, но здоровый сон — гораздо лучше 🛌",
                stats: x => merge(x, [
                    lessBalance,
                ])
            },
            "no": {
                text: "Починить, написать постмортем",
                reaction: "Писать постмортемы — отличная привычка. Рано или поздно просыпаться по ночам будет не нужно 🤓‍",
                stats: x => merge(x, [
                    moreKarma,
                    muchLessBalance,
                ])
            }
        }
    },
    {
        slug: "rock-band",
        title: "Рок-группа",
        filter: user => user.days > 200 && user.karma > 0.5,
        text: "Ты нашёл единомышленников, забронировал музыкальную комнату и почти " +
            "[собрал рок-группу](https://youtu.be/PpRduDfto9k?t=16). Am Dm 🎸🎤",
        answers: {
            "yes": {
                text: "Да! Будет круто!",
                reaction: "Теперь ты фронтмен и рок-звезда 😎",
                stats: x => merge(x, [
                    muchMoreKarma,
                    moreBalance,
                ])
            },
            "no-complicated": {
                text: "Нет, группа — это сложно",
                reaction: "В группе люди, с людьми надо общаться, зачем это всё... 🥺‍",
                stats: x => merge(x, [
                    lessKarma,
                ])
            },
            "no-unable": {
                text: "Нет, потому что слуха нет",
                reaction: "А ещё можно немного бэклог разобрать вместо записи каверов 😈‍",
                stats: x => merge(x, [
                    moreLevel,
                ])
            }
        }
    },
    {
        slug: "burnout",
        title: "Профессиональное выгорание",
        filter: user => user.days > 365 && (user.balance <= balance.unsatisfactory || user.job === job.teamManager),
        text: "Ты почувствовал, что взял на себя слишком много — и тут же " +
            "[выгорел](https://www.youtube.com/watch?v=vwLoCisTqnI)",
        answers: {
            "vacation": {
                text: "Взять длинный отпуск",
                reaction: "Привет, сёрфинг на Бали и кофейни Стокгольма. Пока, задачки в Ютреке 🤣",
                stats: x => merge(x, [
                    muchMoreBalance,
                    lessKarma,
                ])
            },
            "new-job": {
                text: "Поменять профессию",
                reaction: "К чёрту всё, теперь я дизайнер 🎨‍",
                stats: x => merge(x, {
                    job: job.designer,
                    balance: muchMoreBalance(x),
                    karma: lessKarma(x),
                })
            },
            "carry-on": {
                text: "Ничего, выплыву",
                reaction: "А может и не выплыву 🤬‍",
                stats: x => merge(x, [
                    lessBalance,
                ])
            }
        }
    },
    {
        slug: "psychologist",
        title: "Корпоративный психолог",
        filter: user => user.days > 365 && user.balance <= balance.unsatisfactory,
        text: "Тебе не по себе, и ты решил поговорить с психологом. Внезапно, тут есть такой человек 😳",
        answers: {
            "yes": {
                text: "Поговорить разок",
                reaction: "Стало полегче, неплохо ✌️",
                stats: x => merge(x, [
                    moreBalance,
                ])
            },
            "no": {
                text: "Психолог? Не для меня",
                reaction: "Нет, ну правда, зачем это всё 👽‍",
                stats: x => merge(x, [])
            }
        }
    },
]

export const finalMessage = "Вот и всё, квест окончен 😎"
