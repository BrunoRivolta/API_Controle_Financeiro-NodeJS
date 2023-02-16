const endereco = "http://127.0.0.1:3001"
const hoje = new Date();
const anoAtual = hoje.getYear() + 1900
const diaAtual = hoje.getDate()
const alertaModal = $("#modal-alert")
const at = accessToken()
const rt = refreshToken()
const spinner = $(".spinner")

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

function nomeUsuarioMenu() {
  const dados = JSON.parse(localStorage.getItem("apicontrole"))
  $("#nome-usuario").text(dados[0].no)
}

function mesAtualFormatado() {
  const mes = (hoje.getMonth() + 1).toString()
  if(mes.length == 1) {
    const mesAtual = '0' + mes 
    return mesAtual
  } else {
    const mesAtual = mes
    return mesAtual
  }
}

function dataFormatada(dataDB) {
    let data = new Date(dataDB);
    let dataFormatada = ((data.getDate() + 1)) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear(); 
    return dataFormatada
}

function accessToken() {
    const dados = JSON.parse(localStorage.getItem("apicontrole"))
    if(dados === null) {
        return null
    } else {
        return dados[0].at
    }
}

function refreshToken() {
    const dados = JSON.parse(localStorage.getItem("apicontrole"))
    if(dados === null) {
        return null
    } else {
        return dados[0].rt
    }
}

function atualizaTokens() {
    const data = {
        refreshToken: refreshToken()
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
          }          
        }

    }).fail(() => {
            window.location.href = './index.html'
    })
}

function apagaRegistro(endpoint, id) {
  $.ajax({
    type: "DELETE",
    url: `${endereco}/${endpoint}/${id}`,
    headers: {
      Authorization: `Bearer ${at}` 
    },
    dataType: 'json',
    success: function(body, stats, res) {
    }
  }).fail((erro) => {
    console.log(erro)
  })
}

function atualizaRegistro(endpoint, id, dados) {
  $.ajax({
    type: "PUT",
    url: `${endereco}/${endpoint}/${id}`,
    data: dados,
    headers: {
      Authorization: `Bearer ${at}` 
    },
    dataType: 'json',
    success: function(body, stats, res) {
      $("#alertMsg").text("Dados atualizados")
    }
  }).fail((erro) => {
    $("#alertMsg").text("Erro ao atualizar")
    console.log(erro)
  })
}

function recarregar() {
  window.location.reload()
}

function converteMesString(numero) {
  const mes = numero == 1 ? "Janeiro" :
              numero == 2 ? "Fevereiro" :
              numero == 3 ? "Março" :
              numero == 4 ? "Abril" :
              numero == 5 ? "Maio" :
              numero == 6 ? "Junho" :
              numero == 7 ? "Julho" :
              numero == 8 ? "Agosto" :
              numero == 9 ? "Setembro" :
              numero == 10 ? "Outubro" :
              numero == 11 ? "Novembro" :
              numero == 12 ? "Dezembro" : "Erro ao converter mês"
  return mes
}

function converteCategoriaString(numero) {
  const categoria = numero == 1 ? "Alimentação" :
                    numero == 2 ? "Saúde" :
                    numero == 3 ? "Moradia" :
                    numero == 4 ? "Transporte" :
                    numero == 5 ? "Educação" :
                    numero == 6 ? "Lazer" :
                    numero == 7 ? "Imprevistos" :
                    numero == 8 ? "Outros" : "Erro ao converter Categoria"
  return categoria
}

function ordenaListaData(lista) {
  lista.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
}

function converteData(data) {
  const dataDividida = data.split('/')
  return `${dataDividida[2]}-${dataDividida[1]}-${dataDividida[0]}`
}

$("#logout").click(() => {
  const data = {
    refreshToken: refreshToken()
  }
  spinner.css("display", "block")

  setTimeout(() => {
    $.ajax({
      type: "POST",
      url: `${endereco}/usuarios/logout`,
      headers: {
        Authorization: `Bearer ${at}` 
      },
      dataType: 'json',
      data: data,
      success: function(body, stat, res) {
        console.log(res.status)
      }
    }).fail((erro) => {
      console.log("erro")
      if(erro.status == 404) (
        alertaModal.text("Houve um erro ao acessar o servidor!")
      )
      if(erro.status == 500) {
        alertaModal.text("Erro, servidor náo acessivel!")
      }
    })

    spinner.css("display", "none")
    localStorage.clear()
    window.location.href = './index.html'

  }, "1000")
})



