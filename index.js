const app = require('./api/app')
require('dotenv').config()
require('./api/redis/blocklist-access-token')
require('./api/redis/allowlist-refresh-token')

const port = 3000

app.listen(port, () => console.log(`Servidor funcionando na porta ${port}`)) //ouvindo o servidor para dizer se esta ok se esta funcionando
