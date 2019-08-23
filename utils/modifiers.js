function up(number, coefficient, limit = 1) {
    return Math.min(number * (1 + coefficient * (1.5 - Math.random())), limit)
}

function down(number, coefficient, limit = 0) {
    return Math.max(number * (1 - coefficient * (1.5 - Math.random())), limit)
}

function moreDays(stats) {
    return {
        days: stats.days + (32 + Math.random() * 256)
    }
}

const delta = 0.1
const bigDelta = delta * 1.5

export function moreLevel(stats) {
    return {
        level: up(stats.level, delta)
    }
}

export function muchMoreLevel(stats) {
    return {
        level: up(stats.level, bigDelta)
    }
}

export function moreKarma(stats) {
    return {
        karma: up(stats.karma, delta)
    }
}

export function muchMoreKarma(stats) {
    return {
        karma: up(stats.karma, bigDelta)
    }
}

export function lessKarma(stats) {
    return {
        karma: down(stats.karma, delta)
    }
}

export function moreBalance(stats) {
    return {
        balance: up(stats.balance, delta)
    }
}

export function muchMoreBalance(stats) {
    return {
        balance: up(stats.balance, bigDelta)
    }
}

export function lessBalance(stats) {
    return {
        balance: down(stats.balance, delta)
    }
}

export function muchLessBalance(stats) {
    return {
        balance: down(stats.balance, bigDelta)
    }
}

export function merge(stats, modifiers = []) {
    const newStats = !Array.isArray(modifiers)
        ? modifiers
        : modifiers.reduce((stats, modifier) => ({
            ...stats,
            ...modifier(stats)
        }), stats)

    return {
        ...stats,
        ...newStats,
        ...moreDays(stats),
    }
}
