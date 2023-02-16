const tokens = require('../controllers/tokens')
const { EmailVerificacao } = require('./email')
const geraEndereco = require('./geraEndereco')

function geraEmailVerificacao(usuario) {
    const tokenVerificaEmail = tokens.verificacaoEmail.cria(usuario.id)
    const endereco = geraEndereco('/usuarios/verifica_email/', tokenVerificaEmail)
    const emailVerificacao = new EmailVerificacao(usuario, endereco)
    emailVerificacao.enviaEmail()
}

module.exports = geraEmailVerificacao