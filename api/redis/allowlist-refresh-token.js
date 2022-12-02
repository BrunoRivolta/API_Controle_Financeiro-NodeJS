const redis = require ('redis')
const manipulaLista = require('./manipula-lista')


const allowlist = redis.createClient({ prefix: 'allowlist-refresh-token: ', legacyMode: true})


module.exports = manipulaLista(allowlist)

