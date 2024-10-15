const host = process.env.HOST;
const config = {
    host: host,
    api: host + '/api',

    freelancerLevels: {
        junior: 'junior',
        middle: 'middle',
        senior: 'senior',
    },
    ordersStatuses: {
        new: 'new',
        confirmed: 'confirmed',
        success: 'success',
        canceled: 'canceled',
    },
}

export default config;