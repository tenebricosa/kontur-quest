const currentYear = new Date().getUTCFullYear()

const partOfYear = [
    'Зима',
    'Весна',
    'Лето',
    'Осень'
]

function renderDays(allDays) {
    const years = Math.floor(allDays / 365)
    const days = allDays - years * 365
    const month = partOfYear[Math.floor(partOfYear.length * days / 365)]

    return `${month} ${currentYear + years}`
}

function renderLevel(level) {
    return (level > 0.67 ? "👴" : level > 0.33 ? "👦️" : "👶") +
        " " + Math.floor(level * 100) + " %"
}

function renderKarma(karma) {
    return (karma > 0.67 ? "🤘" : karma > 0.33 ? "✌️" : "🤞") +
        " " + Math.floor(karma * 100) + " %"
}

function renderBalance(balance) {
    return (balance > 0.8 ? "🌝" : balance > 0.6 ? "🌖" : balance > 0.4 ? "🌗" : balance > 0.2 ? "🌘" : "🌚") +
        " " + Math.floor(balance * 100) + " %"
}

export function renderStatus(stats) {
    return "_" + renderDays(stats.days) + ": " + renderLevel(stats.level) + " / " + renderKarma(stats.karma) + " / " +
        renderBalance(stats.balance) + "_"
}
