const botaoCadastro = $("#botaoCadastro")
const botaoCadastrar = $("#botao-modal")
const botaoLogin = $("#botaoLogin")
const email = $("#email-login")
const senha = $("#senha-login")
const alerta = $("#alertMsg")
const lembrar = $("#lembrar")
const principal = $('#principal')
const campoNome = $("#campo-nome")
const campoEmail = $("#campo-email")
const campoSenha = $("#campo-senha")

loginAutomatico()

botaoCadastro.click(() => {
  $(".botao_modal").css("display", "block")
  $("#botao-modal_cancelar").text("Cancelar")
  campoNome.val("")
  campoEmail.val("")
  campoSenha.val("")
  alertaModal.text("")
})

botaoCadastrar.on("click", () => {
  $.ajax({
    type: "POST",
    url: `${endereco}/usuarios`,
    dataType: 'json',
    data: {
      email: campoEmail.val(),
      nome: campoNome.val(),
      senha: campoSenha.val()
    },
    success: function(body, stat, res) {
      if(body.id) {
        alertaModal.text("Enviamos um e-mail de confirmação com um link, verifique seu e-mail!")
        $(".botao_modal").css("display", "none")
        $("#botao-modal_cancelar").text("Sair")
      }
    }
  }).fail((erro) => {
    console.log(erro)
    if(erro.status === 404) (
      alertaModal.text("Houve um erro ao acessar o servidor!")
    )
    if(erro.status === 500) {
      alertaModal.text("Erro, servidor náo acessivel!")
    }
  })
})

function loginAutomatico() {

  const token = refreshToken()

  if(token != null) {
    const data = {
      refreshToken: token
    }
  
    $.ajax({
      type: "POST",
      url: `${endereco}/usuarios/atualiza_refresh`,
      data: data,
      dataType: 'json',
      success: function(body, stats, res) {
        
        let refreshToken = body.refreshToken
        let nome = body.nomeUsuario
        let accessToken = res.getResponseHeader("Authorization")
  
        if(refreshToken.erro != "Refresh Token é invalido!") {
  
          const item = [
            {
              "rt": refreshToken,
              "at": accessToken,
              "no": nome
            }
          ]

          localStorage.setItem("apicontrole", JSON.stringify(item)) 
          $("#nome-usuario").text(nome)
        }
        window.location.href = './principal.html'
      }
    }).fail(() => {
        localStorage.clear()
        recarregar()
    })
  }
}

botaoLogin.on("click", () => {

  if(email.val() == "" || senha.val() == "") {
    alerta.text('Campo E-mail ou Senha vazio!')
  } else {
    const data = {
        email : `${email.val()}`,
        senha : `${senha.val()}`
    }
  
    alerta.text('')
    $.ajax({
      type: "POST",
      url: `${endereco}/usuarios/login`,
      data: data,
      dataType: 'json',
      success: function(body, stats, res) {
        let refreshToken = body.refreshToken
        let nome = body.nomeUsuario
        let accessToken = res.getResponseHeader("Authorization")
  
        const item = [
          {
            "rt": refreshToken,
            "at": accessToken,
            "no": nome
          }
        ]
    
        localStorage.setItem("apicontrole", JSON.stringify(item))  
        $("#nome-usuario").text(nome)
        
        window.location.href = './principal.html'
      }
      }).fail((erro) => {
        if(erro.status == 401) {
          if(erro.responseJSON.erro === 'Enviamos um novo e-mail de verificação, aguarde alguns minutos e verifique sua caixa de e-mail, veja também na caixa de spam!') {
            alerta.text(erro.responseJSON.erro)
          } else {
            alerta.text('Usuario ou senha invalidos!')
          }
        }
        if(erro.status == 500) {
          alerta.text('Erro de conexão com o servidor')
        }
      })
  }

})


