const alertaUsuario = $("#usuario-alerta")
const campoEndereco = $("#campo_endereco")

nomeUsuarioMenu()
dadosUsuario()
alertaUsuario.text("")

campoEndereco.addClass("d-none")

$("#usuario-cep").focusout(() => {
  if($("#usuario-cep").val().length === 9) {
    buscaCEP()
  } else {
    alertaUsuario.text("O campo CEP deve ter o formato 00000-000")
  }
})

function dadosUsuario() {
  $.ajax({
    type: "GET",
    url: `${endereco}/usuarios`,
    headers: {
      Authorization: `Bearer ${at}` 
    },
    dataType: 'json',
    success: function(resposta, stats, res) {
      const usuario = resposta[0]
      console.log(usuario)
      $("#usuario-nome").val(usuario.nome)
      if(usuario.sobrenome != null) {
        $("#usuario-sobrenome").val(usuario.sobrenome)
      }
      if(usuario.telefone != null) {
        $("#usuario-telefone").val(usuario.telefone)
      }      
      if(usuario.cep != null) {
        $("#usuario-cep").val(usuario.cep)
      }
      if(usuario.endereco != null) {
        $("#usuario-endereco").val(usuario.endereco)
      }
      if(usuario.numero != null) {
        $("#usuario-numero").val(usuario.numero)
      }
      if(usuario.bairro != null) {
        $("#usuario-bairro").val(usuario.bairro)
      }
      if(usuario.cidade != null) {
        $("#usuario-cidade").val(usuario.cidade)
      }
      if(usuario.estado != null) {
        $("#usuario-estado").val(usuario.estado)
      }
    }
  }).fail(() => {
    alertaUsuario.text("Erro ao solicitar dados do usuario")
    atualizaTokens()
    dadosUsuario()
  })
}

$("#botao-atualiza_usuario").on("click", () => {
  let numero

  if($("#usuario-numero").val() == '') {
    numero = 0
  } else {
    numero = $("#usuario-numero").val()
  }

  const dados = {
    nome: $("#usuario-nome").val(),
    sobrenome: $("#usuario-sobrenome").val(),
    telefone: $("#usuario-telefone").val(),
    cep: $("#usuario-cep").val(),
    endereco: $("#usuario-endereco").val(),
    numero: numero,
    bairro: $("#usuario-bairro").val(),
    cidade: $("#usuario-cidade").val(),
    estado: $("#usuario-estado").val()
  }
  $.ajax({
    type: "PUT",
    url: `${endereco}/usuarios`,
    data: dados,
    headers: {
      Authorization: `Bearer ${at}` 
    },
    dataType: 'json',
    success: function(body, stats, res) {
      alertaUsuario.text("Dados atualizados com sucesso!")
    }
  }).fail((erro) => {
    console.log(erro)
    alertaUsuario.text("Erro ao atualizar cadastro!")
    atualizaTokens()
    dadosUsuario()
  })
})

function buscaCEP() {

  campoEndereco.removeClass("d-none")

  const cep = $("#usuario-cep").val()
  $.ajax({
    type: "GET",
    url: `https://viacep.com.br/ws/${cep}/json`,
    success: function(dados, stats, res) {
      $("#usuario-cep").val(dados.cep),
      $("#usuario-endereco").val(dados.logradouro),
      $("#usuario-bairro").val(dados.bairro),
      $("#usuario-cidade").val(dados.localidade),
      $("#usuario-estado").val(dados.uf)
    }

  }).fail(() => {
    alertaUsuario.text("Erro ao solicitar dados do usuario")
  })
}

