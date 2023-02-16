const redis = require ('redis')
const manipulaLista = require('./manipula-lista')


const allowlist = redis.createClient({
    //url: 'redis://127.0.0.1:3010',
    prefix: 'allowlist-refresh-token: ',
    legacyMode: true
})


module.exports = manipulaLista(allowlist)

