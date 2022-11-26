const nodemailer = require('nodemailer')

const confEmailTeste = contaTeste => ({
	host: 'smtp.ethereal.email',
	auth: contaTeste
})

const confEmailProducao = {
	host: process.env.EMAIL_HOST,
	auth: {
		user: process.env.EMAIL_USUARIO,
		pass: process.env.EMAIL_SENHA
	},
	secure: true
}

async function criaConfiguracaoEmail() {
	if (process.env.NODE_ENV === 'production') {
		return confEmailProducao
	} else {
		const contaTeste = await nodemailer.createTestAccount()
		return confEmailTeste(contaTeste)
	}
}

class Email {
	async enviaEmail() {
		const configuracaoEmail = await criaConfiguracaoEmail()
		const transportador = nodemailer.createTransport(configuracaoEmail)
		const info = await transportador.sendMail(this)

		if (process.env.NODE_ENV !== 'production') {
			console.log('URL: ' +nodemailer.getTestMessageUrl(info))
		}
	}
}

class EmailVerificacao extends Email {
	constructor(usuario, endereco) {
		super()
		this.from = '"Controle Financeiro" <noreply@controlefinanceiro.com.br>'
		this.to = usuario.email
		this.subject = 'Vefificação de e-mail'
		this.text = `Ola verifique seu email aqui: ${endereco}`
		this.html = `
			<h1>Ola</h1>
			<p>verifique seu email aqui: <a href='${endereco}'>${endereco}</a></p>`
	}
}

module.exports = { EmailVerificacao }


