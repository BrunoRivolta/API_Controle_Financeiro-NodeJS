const botaoDespesas = $("#botao-despesa")
const botaoReceitas = $("#botao-receitas")
const botaoCategoria = $("#botao-categoria")
const valorReceita = $("#valor-receitas")
const valorDespesa = $("#valor-despesas")
const valorSaldo = $("#valor-saldo")
const valorMes = $("#valor-mes")
const alerta = $("#alertMsg")
const campoCalendario = $("#calendario")
const calendario = $("#modal_calendar")
const categoriaAlimentacao = $("#categoria-alimentacao")
const categoriaSaude = $("#categoria-saude")
const categoriaMoradia = $("#categoria-moradia")
const categoriaTransporte = $("#categoria-transporte")
const categoriaEducacao = $("#categoria-educacao")
const categoriaLazer = $("#categoria-lazer")
const categoriaImprevistos = $("#categoria-imprevistos")
const categoriaOutros = $("#categoria-outros")
const tabelaReceitas = $("#tabela-receitas")
const tabelaDespesas = $("#tabela-despesas")
const tabelaCategoria = $(".tatela_categoria")
const informacoesModal = $("#modal-info")
const tituloModal = $("#exampleModalLabel")
const botaoModalContainer = $("#modalFooter")
const botaoAdicionaReceitas = $("#botao-adiciona_receitas")
const botaoAdicionaDespesas = $("#botao-adiciona_despesas")
const botaoMudaMes = $("#botao-muda_mes")
let primeiroCarregamento = true

nomeUsuarioMenu()

const mesCorrente = mesAtualFormatado()
const anoCorrente = anoAtual
const dataSelecionada = []

botaoAdicionaReceitas.on("click", () => {
    geraModalReceitas()
})

botaoAdicionaDespesas.on("click", () => {
    geraModalDespesas()
})

botaoMudaMes.on("click", () => {
    geraModalData()
})

$(".botao-busca").on("click", () => {
    busca($("#parametro-busca").val())
})


atualizaDatas()

function buscandoDadosMes(mes, ano) {
    alerta.text("")
    tabelaCategoria.css("display", "block")

    const tituloTabelaReceitas = `
        <tr>
            <th class="card-body">Data</th>
            <th class="card-body">Descr.</th>
            <th class="card-body">Valor</th>
            <th class="card-body"></th>
            <th class="card-body"></th>
            <th class="card-body"></th>
        </tr>
    `
    const tituloTabelaDespesas = `
        <tr>
            <th class="card-body">Data</th>
            <th class="card-body">Descr.</th>
            <th class="card-body">Valor</th>
            <th class="card-body">Categ.</th>
            <th class="card-body"></th>
            <th class="card-body"></th>
        </tr>
    `
    $.ajax({
        type: "GET",
        url: `${endereco}/relatorio/${mes}/${ano}`,
        headers: {
            Authorization: `Bearer ${at}` 
        },
        dataType: 'json',
        success: function(body, stat, res) {
            const relatorio = body

            if(relatorio.message !== undefined) {
                alerta.text("Não existem registros para este Mês, registre alguma receita ou despesa!")
                valorReceita.html("")
                valorDespesa.html("")
                valorSaldo.html("")
                valorMes.text(`${converteMesString(mes)}/${ano}`)
            } else {
                valorMes.text(`${converteMesString(mes)}/${relatorio.ano}`)
                valorReceita.text(`R$ ${relatorio.receitas}`)
                valorDespesa.text(`R$ ${relatorio.despesas}`)
                valorSaldo.text(`R$ ${relatorio.saldo}`)
                categoriaAlimentacao.text(`R$ ${relatorio.alimentacao}`)
                categoriaSaude.text(`R$ ${relatorio.saude}`)
                categoriaMoradia.text(`R$ ${relatorio.moradia}`)
                categoriaTransporte.text(`R$ ${relatorio.transporte}`)
                categoriaEducacao.text(`R$ ${relatorio.educacao}`)
                categoriaLazer.text(`R$ ${relatorio.lazer}`)
                categoriaImprevistos.text(`R$ ${relatorio.imprevistos}`)
                categoriaOutros.text(`R$ ${relatorio.outros}`)
            }
        }
    }).fail((erro) => {
        if(erro.status == 401) {
            atualizaTokens()
            dadosMensais(mes, ano, token)
        } else {
            alerta.text("Problemas de conexão com o servidor!")
        }
    })
    
    setTimeout(() => {

        $.ajax({
            type: "GET",
            url: `${endereco}/receitas/${mes}/${ano}`,
            headers: {
                Authorization: `Bearer ${at}` 
            },
            dataType: 'json',
            success: function(receitas, stat, res) {
                if(receitas.Busca !== undefined) {
                    tabelaReceitas.html("")
                } else {
                    tabelaReceitas.html("")
                    ordenaListaData(receitas)
                    tabelaReceitas.append(tituloTabelaReceitas)

                    $(receitas).each(function(index, value) {
                        let data = dataFormatada(value.data)
                        const item =  criaLinhaTabela(data, value.descricao, value.valor)
                        item.find(".botao-remover").click(() => { 
                            geraModalApagar("receitas", dataFormatada(this.data), this.descricao, this.valor, this.id)
                        })
                        item.find(".botao-atualizar").click(() => { 
                            geraModalAtualizar("receitas", dataFormatada(this.data), this.descricao, this.valor, this.id)
                        })
                        tabelaReceitas.append(item)
                    })
                }
            }
        }).fail((erro) => {
            if(erro.status == 401) {
                atualizaTokens(rt)
                dadosMensais(mes, ano, token)
            } else {
                alerta.text("Problemas de conexão com o servidor!")
            }
        })
    }, "500")
    
    setTimeout(() => {
        $.ajax({
            type: "GET",
            url: `${endereco}/despesas/${mes}/${ano}`,
            headers: {
                Authorization: `Bearer ${at}` 
            },
            dataType: 'json',
            success: function(despesas, stat, res) {
                if(despesas.Busca !== undefined) {
                    tabelaDespesas.html("")
                    tabelaCategoria.css("display", "none")
                } else {
                    tabelaDespesas.html("")
                    ordenaListaData(despesas)
                    tabelaDespesas.append(tituloTabelaDespesas)

                    $(despesas).each(function(index, value) {
                        let data = dataFormatada(value.data)
                        const item =  criaLinhaTabela(data, value.descricao, value.valor, value.categoria_id)
                        item.find(".botao-remover").click(() => 
                            geraModalApagar("despesas", dataFormatada(this.data), this.descricao, this.valor, this.id)
                        )
                        item.find(".botao-atualizar").click(() => 
                            geraModalAtualizar("despesas", dataFormatada(this.data), this.descricao, this.valor, this.id, this.categoria_id)
                        )
                        tabelaDespesas.append(item)
                    });
                }
            }
        }).fail((erro) => {
            if(erro.status == 401) {
                atualizaTokens()
                dadosMensais(mes, ano, token)
            } else {
                alerta.text("Problemas de conexão com o servidor!")
            }
        })
    }, "500")
}

function criaLinhaTabela(data, descricao, valor, categoria) {
    const linha = $("<tr>")
    const colunaData = $("<td>").text(data)
    const colunaDescricao = $("<td>").text(descricao)
    const colunaValor = $("<td>").text(`R$ ${valor}`)
    const colunaCategoria = $("<td>")

    if(categoria !== undefined) {
        colunaCategoria.text(converteCategoriaString(categoria))
    }

    const colunaApaga = $("<td>")
    const colunaAtualiza = $("<td>")

    const linkApaga = $("<a>").attr("href","#").addClass("botao-remover")
    const linkAtualiza = $("<a>").attr("href","#").addClass("botao-atualizar")
    const iconeApaga = $("<i>").addClass("small").addClass("material-symbols-outlined").attr("data-bs-toggle", "modal").attr("data-bs-target", "#exampleModal").text("delete")
    const iconeAtualiza = $("<i>").addClass("small").addClass("material-symbols-outlined").attr("data-bs-toggle", "modal").attr("data-bs-target", "#exampleModal").text("refresh")

    colunaData.addClass("card-body")
    colunaDescricao.addClass("card-body")
    colunaValor.addClass("card-body")
    colunaCategoria.addClass("card-body")
    colunaApaga.addClass("card-body")
    colunaAtualiza.addClass("card-body")

    // Icone dentro do <a>
    linkApaga.append(iconeApaga)
    linkAtualiza.append(iconeAtualiza)

    // <a> dentro do <td>
    colunaApaga.append(linkApaga)
    colunaAtualiza.append(linkAtualiza)

    // Os três <td> dentro do <tr>
    linha.append(colunaData)
    linha.append(colunaDescricao)
    linha.append(colunaValor)
    linha.append(colunaCategoria)
    linha.append(colunaApaga)
    linha.append(colunaAtualiza)

    return linha
}

function criaLinhaBusca(data, descricao, valor) {
    const linha = $("<tr>")
    const colunaData = $("<td>").text(data)
    const colunaDescricao = $("<td>").text(descricao)
    const colunaValor = $("<td>").text(`R$ ${valor}`)

    colunaData.addClass("card-body")
    colunaDescricao.addClass("card-body")
    colunaValor.addClass("card-body")

    linha.append(colunaData)
    linha.append(colunaDescricao)
    linha.append(colunaValor)

    return linha
}

function geraModalApagar(endpoint, data, descr, valor, id) {

    calendario.css("display", "none")

    tituloModal.text("Deseja mesmo apagar este registro?")
    const linha = `
        <table> 
            <tr>
                <th class="card-body">Data</th>
                <th class="card-body">Descrição</th>
                <th class="card-body">Valor</th>
            </tr>
            <tr>
                <td class="card-body">${data}</td>
                <td class="card-body">${descr}</td>
                <td class="card-body">R$ ${valor}</td>
            </tr>
        </table>
    `
    const botao = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button id="botao-modal_apagar" type="button" class="btn btn-primary" data-bs-dismiss="modal">Apagar</button>
    `
    informacoesModal.html(linha)
    botaoModalContainer.html(botao)

    $("#botao-modal_apagar").on("click", () => {
        apagaRegistro(endpoint, id)
        atualizaDatas()
    })
}

function geraModalAtualizar(endpoint, data, descr, valor, id, categ) {
    calendario.css("display", "flex")

    tituloModal.text("Atualize seus dados")
    const linhaReceitas = `
        <section>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">edit_note</span>
                <input type="text" name="descricao" id="campo-descricao" class="form-control" placeholder="Decrição" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">attach_money</span>
                <input type="number" name="valor" id="campo-valor" class="form-control" placeholder="Valor" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
        </section>
    `
    const linhaDespesas = `
        <section>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">edit_note</span>
                <input type="text" name="descricao" id="campo-descricao" class="form-control" placeholder="Decrição" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">attach_money</span>
                <input type="number" name="valor" id="campo-valor" class="form-control" placeholder="Valor" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
            <div class="form-floating">
                <select class="form-select campo-categoria_atualiza" id="floatingSelect" aria-label="Categorias">
                    <option value="${categ}">${converteCategoriaString(categ)}</option>
                    <option value="8">Outros</option>
                    <option value="1">Alimentação</option>
                    <option value="2">Saúde</option>
                    <option value="3">Moradia</option>
                    <option value="4">Transporte</option>
                    <option value="5">Educação</option>
                    <option value="6">Lazer</option>
                    <option value="7">Imprevistos</option>
                </select>
                <label for="floatingSelect">Categorias</label>
            </div>
        </section>
    `
    const botao = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button id="botao-modal_apagar" type="button" class="btn btn-primary" data-bs-dismiss="modal">Atualizar</button>
    `
    if(endpoint == "receitas") {
        informacoesModal.html(linhaReceitas)
    } else {
        informacoesModal.html(linhaDespesas)  
    }

    botaoModalContainer.html(botao)

    const desc = $("#campo-descricao")
    const val = $("#campo-valor")
    
    desc.val(descr)
    val.val(valor)
    campoCalendario.val(data)

    $("#botao-modal_apagar").on("click", () => {

        const infosReceitas = {
            descricao: desc.val(),
            valor: val.val(),
            data: converteData(campoCalendario.val())
        }
    
        const infosDespesas = {
            descricao: desc.val(),
            valor: val.val(),
            data: converteData(campoCalendario.val()),
            categoria_id: $(".campo-categoria_atualiza").val()
        }

        if(endpoint == "receitas") {
            atualizaRegistro(endpoint, id, infosReceitas)
        } else {
            atualizaRegistro(endpoint, id, infosDespesas)
        }

        atualizaDatas()
    })
}

function geraModalReceitas() {
    calendario.css("display", "flex")
    tituloModal.text("Adicione uma Receita")

    const linha = `
        <section>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">edit_note</span>
                <input type="text" name="descricao" id="campo-descricao" class="form-control" placeholder="Decrição" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">attach_money</span>
                <input type="number" name="valor" id="campo-valor" class="form-control" placeholder="Valor" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
        </section>
    `
    const botao = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button id="botao-modal_receitas" type="button" class="btn btn-primary" data-bs-dismiss="modal">Cadastrar</button>
    `
    informacoesModal.html(linha)
    botaoModalContainer.html(botao)

    
    $("#botao-modal_receitas").on("click", () => {
        
        const descricao = $("#campo-descricao").val()
        const valor = $("#campo-valor").val()
        const data = converteData(campoCalendario.val())
    
        const infos = {
            descricao: descricao,
            valor: valor,
            data: data
        }

        cadastro("receitas", infos)
        atualizaDatas()
    })
}

function geraModalDespesas() {
    calendario.css("display", "flex")
    tituloModal.text("Adicione uma Despesa")

    const linha = `
        <section>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">edit_note</span>
                <input type="text" name="descricao" id="campo-descricao" class="form-control" placeholder="Decrição" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
            <div class="input-group flex-nowrap">
                <span class="input-group-text material-symbols-outlined" id="addon-wrapping">attach_money</span>
                <input type="number" name="valor" id="campo-valor" class="form-control" placeholder="Valor" aria-label="Username" aria-describedby="addon-wrapping">
            </div>
            <div class="form-floating">
                <select class="form-select campo-categoria" id="floatingSelect" aria-label="Categorias">
                    <option value="8">Outros</option>
                    <option value="1">Alimentação</option>
                    <option value="2">Saúde</option>
                    <option value="3">Moradia</option>
                    <option value="4">Transporte</option>
                    <option value="5">Educação</option>
                    <option value="6">Lazer</option>
                    <option value="7">Imprevistos</option>
                </select>
                <label for="floatingSelect">Categorias</label>
            </div>
        </section>
    `
    const botao = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button id="botao-modal_despesas" type="button" class="btn btn-primary" data-bs-dismiss="modal">Cadastrar</button>
    `

    informacoesModal.html(linha)
    botaoModalContainer.html(botao)

    $("#botao-modal_despesas").on("click", () => {

        const descricao = $("#campo-descricao").val()
        const valor = $("#campo-valor").val()
        const data = converteData(campoCalendario.val())
        const categoria = $(".campo-categoria").val()
     
    
        const infos = {
            descricao: descricao,
            valor: valor,
            data: data,
            categoria_id: categoria
        }

        cadastro("despesas", infos)
        atualizaDatas()
    })
}

let anoCorrenteModalData
let mesCorrenteModalData

function geraModalData() {

    tituloModal.text("Escolha o Mês e Ano")
    calendario.css("display", "none")

    const linha = `
        <section>
            <div class="form-floating">
                <select class="form-select campo-mes" id="floatingSelect" aria-label="Mes">
                    <option value="${mesCorrenteModalData}">${converteMesString(mesCorrenteModalData)}</option>
                    <option value="01">Janeiro</option>
                    <option value="02">Fevereiro</option>
                    <option value="03">Março</option>
                    <option value="04">Abril</option>
                    <option value="05">Maio</option>
                    <option value="06">Junho</option>
                    <option value="07">Julho</option>
                    <option value="08">Agosto</option>
                    <option value="09">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>
                <label for="floatingSelect">Mes</label>
            </div>            
            <div class="form-floating">
                <select class="form-select campo-ano" id="floatingSelect" aria-label="Ano">
                    <option value="${anoCorrenteModalData}">${anoCorrenteModalData}</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
                <label for="floatingSelect">Ano</label>
            </div>
        </section>
    `
    const botao = `
    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
    <button id="botao-modal_data" type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
    `
    informacoesModal.html(linha)
    botaoModalContainer.html(botao)

   $("#botao-modal_data").on("click", () => {
        if($(".campo-mes").val() !== undefined) {
            dataSelecionada.splice(0, 10)
            dataSelecionada.splice(0, 0, $(".campo-mes").val())
            dataSelecionada.splice(1, 0, $(".campo-ano").val())
        }
        atualizaDatas()
    })
}

function cadastro(endpoint, infos) {
    $.ajax({
        type: "POST",
        url: `${endereco}/${endpoint}`,
        data: infos,
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${at}` 
        }
    }).fail((erro) => {
        if(erro.status == 401) {
          alerta.text('Usuario ou senha errados!')
        }
        if(erro.status == 500) {
          alerta.text('Erro de conexão com o servidor')
        }
    })
}

function busca(parametro) {

    const tabelaBusca = `
        <h5 class="card-title">Receitas</h5>
        <div id="info-busca_receitas">
            <table id="tabela-busca_receita" class="tatela_busca">
                <tr>
                    <th class="card-body">Data</th>
                    <th class="card-body">Descrição</th>
                    <th class="card-body">Valor</th>
                </tr>
            </table>
        </div>
        </br>
        <h5 class="card-title">Despesas</h5>
        <div id="info-busca_despesas">
            <table id="tabela-busca_despesa" class="tatela_busca">
                <tr>
                    <th class="card-body">Data</th>
                    <th class="card-body">Descrição</th>
                    <th class="card-body">Valor</th>
                </tr>
            </table>
        </div>
    `
    const botao = `
    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
    `
    calendario.html("")
    informacoesModal.html("")
    informacoesModal.append(tabelaBusca)
    tituloModal.text("Resultado da Busca!")
    if(parametro == "" || parametro == " ") {
        $("#info-busca_receitas").html(`Não encontramos resultados: O campo de busca esta vazio`)
        $("#info-busca_despesas").html(`Não encontramos resultados: O campo de busca esta vazio`)
    } else {
        spinner.css("display", "block")
        setTimeout(() => {
            $.ajax({
                type: "GET",
                url: `${endereco}/receitas?busca=${parametro}`,
                dataType: 'json',
                headers: {
                    Authorization: `Bearer ${at}` 
                },
                success: function(buscaReceita, stat, res) {

                    if(buscaReceita == null) {
                        $("#info-busca_receitas").html(`Não encontramos resultados para: ${parametro}`)
                    } else {
                        ordenaListaData(buscaReceita)
                        $(buscaReceita).each(function(index, value) {
                            let data = dataFormatada(value.data)
                            const item =  criaLinhaBusca(data, value.descricao, value.valor)
                            
                            $("#tabela-busca_receita").append(item)
                        })
                    }
                }
            }).fail((erro) => {
                if(erro.status == 500) {
                alerta.text('Erro de conexão com o servidor')
                }
            })
    
            $.ajax({
                type: "GET",
                url: `${endereco}/despesas?busca=${parametro}`,
                dataType: 'json',
                headers: {
                    Authorization: `Bearer ${at}` 
                },
                success: function(buscaDespesa, stat, res) {

                    if(buscaDespesa == null) {
                        $("#info-busca_despesas").html(`Não encontramos resultados para: ${parametro}`)
                    } else {
                        ordenaListaData(buscaDespesa)
                        $(buscaDespesa).each(function(index, value) {
                            let data = dataFormatada(value.data)
                            const item =  criaLinhaBusca(data, value.descricao, value.valor)
                            
                            $("#tabela-busca_despesa").append(item)
                        })
                    }
                    botaoModalContainer.html(botao)
                }
            }).fail((erro) => {
                if(erro.status == 500) {
                alerta.text('Erro de conexão com o servidor')
                }
            })

            spinner.css("display", "none")
        }, "1000")
    }

}

function atualizaDatas() {
    spinner.css("display", "block")
    setTimeout(() => {

        if(primeiroCarregamento === true) {
            buscandoDadosMes(mesCorrente, anoCorrente)
            primeiroCarregamento = false
            campoCalendario.val(`${diaAtual}/${mesCorrente}/${anoCorrente}`)
            mesCorrenteModalData = mesCorrente
            anoCorrenteModalData = anoCorrente
        } else {
            if(dataSelecionada.length === 0) {
                buscandoDadosMes(mesCorrente, anoCorrente)
                campoCalendario.val(`${diaAtual}/${mesCorrente}/${anoCorrente}`)
                mesCorrenteModalData = mesCorrente
                anoCorrenteModalData = anoCorrente
            } else {
                buscandoDadosMes(dataSelecionada[0], dataSelecionada[1])
                campoCalendario.val(`${diaAtual}/${dataSelecionada[0]}/${dataSelecionada[1]}`)
                mesCorrenteModalData = dataSelecionada[0]
                anoCorrenteModalData = dataSelecionada[1]
            }
        }
        spinner.css("display", "none")
    }, "500")
}



