/* eslint-disable no-undef */
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
		this.subject = 'Vefificação de e-mail - Controle Financeiro'
		this.text = `
			Olá
			Verifique seu email aqui: ${endereco}
			API Controle Financeiro - Bruno Rivolta
		`
		this.html = `
		<body style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
			<img src="https://images2.imgbox.com/b1/4d/m2LdYYfs_o.png" width="400px" alt="image host"/>
			<h1>Olá</h1>
			<p>Sua conta no "Controle Financeiro" foi criada com Sucesso!</p>
			<p>Para sua segurança é necessario confirmar seu email. Use o link abaixo</p>
			<p>Verifique seu e-mail aqui: <a href='${endereco}'>${endereco}</a></p>
			<p>Nao responda esse email</p>
			<br/>
			<p>API Controle Financeiro - Bruno Rivolta</p>
		</body>
		`
	}
}

class EmailRecuperacao extends Email {
	constructor(usuario, endereco) {
		super()
		this.from = '"Controle Financeiro" <noreply@controlefinanceiro.com.br>'
		this.to = usuario.email
		this.subject = 'Recupere sua conta'
		this.text = `
			Sua conta foi apagada com sucesso. Ela ainda pode ser recuparada em até 5 dias.
			Acesse o link para recuperar sua conta: ${endereco}
			API Controle Financeiro - Bruno Rivolta
			` 
		this.html = `
		<body style="font-family: Verdana, Geneva, Tahoma, sans-serif;">
			<img src="https://images2.imgbox.com/b1/4d/m2LdYYfs_o.png" width="400px" alt="image host"/>
			<h1>Olá</h1>
			<p>Sua conta no "Controle Financeiro" foi Apagada com Sucesso!</p>
			<p>É possivel recuperar sua conta após 5 dias depois da exclusão. Use o link abaixo</p>
			<p>Recupere sua cona aqui: <a href='${endereco}'>${endereco}</a></p>
			<p>Nao responda esse email</p>
			<br/>
			<p>API Controle Financeiro - Bruno Rivolta</p>
		</body>
		`
	}
}

module.exports = { EmailVerificacao, EmailRecuperacao }
 

