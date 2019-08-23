export const job = {
    backend: 'backend-разработчик',
    frontend: 'frontend-разработчик',
    datascientist: 'датасаентист',
    mobile: 'мобильный разработчик',
    analyst: 'аналитик',
    designer: 'дизайнер',
    usability: 'юзабилист',
    teamManager: 'менеджер команды',
    productManager: 'менеджер продукта'
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

export default job;
