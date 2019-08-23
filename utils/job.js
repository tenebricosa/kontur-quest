export const job = {
    backend: 'backend-разработчик',
    frontend: 'frontend-разработчик',
    datascientist: 'датасаентист',
    mobile: 'мобильный разработчик',
    qa: 'тестировщик',
    designer: 'дизайнер',
    teamManager: 'менеджер',
    student: 'студент',
    unknown: 'кто-то другой',
}

const devJobs = [
    job.backend,
    job.frontend,
    job.datascientist,
    job.mobile
]

export function isDeveloper(job) {
    return devJobs.indexOf(job) !== -1
}

const managerJobs = [
    job.teamManager,
]

export function isManager(job) {
    return managerJobs.indexOf(job) !== -1
}

export default job;
