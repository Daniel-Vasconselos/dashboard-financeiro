
const data_atual = new Date()
const mes_atual_letra_minuscula = (data_atual.toLocaleDateString('pt-Br',{month:'long'}));
const mes_atual = mes_atual_letra_minuscula.charAt(0).toUpperCase() + mes_atual_letra_minuscula.slice(1)
const ano_atual = data_atual.getFullYear();

const mes = document.getElementById('mes');
const ano = document.getElementById('ano');
const valor = document.getElementById('valor');
const tipo_valor = document.getElementById('tipo_valor');
const descricao = document.getElementById('descricao')
const div_descricao = document.getElementById('div_descricao');
const tabela = document.getElementById("dados_tabela");
const grafico = document.getElementById("grafico_circular")
const resultado = document.getElementById("resultado")
const valor_entrada = document.getElementById("valor_entrada")
const valor_saida = document.getElementById("valor_saida")

const btn_filtro = document.getElementById('btn_filtro');
const btn_incluir = document.getElementById('btn_incluir')

let dados = JSON.parse(localStorage.getItem("dados")) || [];
let dados_filtrados = [];

// ------------------------ Funções do Programa ----------------------------------
function filtrar(ano, mes){
    dados_filtrados = []
     dados.forEach(item => {
        if (item.ano == ano && (mes == "" || item.mes == mes)){
            dados_filtrados.push(item)
        }
    })

    gerar_tabela(dados_filtrados);
}

function gerar_tabela(dados_tabela){
    tabela.innerHTML = "";
    let soma_entradas = 0
    let soma_saidas = 0

    dados_tabela.forEach(item => {
        let tr = document.createElement("tr")
        let icone_tipo
        let icone_descricao
        let texto_descricao

        if(item.tipo == "entrada"){
            icone_tipo =  `<i class="bi bi-arrow-up-circle-fill"></i>`
            soma_entradas += item.valor
        } else {
            icone_tipo =  `<i class="bi bi-arrow-down-circle-fill"></i>`
            soma_saidas += item.valor
        }

        switch(item.descricao){
            case 1:
                texto_descricao = "Moradia"
                icone_descricao = `<i class="bi bi-house-door"></i>`
                break
            case 2:
                texto_descricao = "Contas"
                icone_descricao = `<i class="bi bi-file-earmark-text"></i>`
                break
            case 3:
                texto_descricao = "Alimentação"
                icone_descricao = `<i class="bi bi-cup-hot"></i>`
                break
            case 4:
                texto_descricao = "Transporte"
                icone_descricao = `<i class="bi bi-bus-front"></i>`
                break
            case 5:
                texto_descricao = "Cartão"
                icone_descricao = `<i class="bi bi-credit-card"></i>`
                break
            case 6:
                texto_descricao = "Lazer"
                icone_descricao = `<i class="bi bi-balloon"></i>`
                break
            case 7:
                texto_descricao = "Saúde"
                icone_descricao = `<i class="bi bi-heart-pulse"></i>`
                break
            case 8:
                texto_descricao = "Educação"
                icone_descricao = `<i class="bi bi-mortarboard"></i>`
                break
            case 9:
                texto_descricao = "Dívidas"
                icone_descricao = `<i class="bi bi-bank"></i>`
                break
            case 10:
                texto_descricao = "Roupas"
                icone_descricao = `<i class="bi bi-handbag"></i>`
                break
            case 11:
                texto_descricao = "Viagem"
                icone_descricao = `<i class="bi bi-airplane"></i>`
                break
            case 12:
                texto_descricao = "Outros"
                icone_descricao = `<i class="bi bi-grid-3x2-gap"></i>`
                break
            default:
                texto_descricao = ""
                icone_descricao = `<i class="bi bi-dash-lg"></i>`
        }

        tr.innerHTML = `
            <td>${item.mes}</td>
            <td>${item.ano}</td>
            <td>${item.valor.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}</td>
            <td>${icone_tipo}</td>
            <td>
                <span class="icone_descricao">
                    ${icone_descricao}
                </span>

                <span class="texto_descricao">
                    ${texto_descricao}
                </span>
            </td>
            <td>
                <button class="btn_excluir" onclick="excluir_item(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        tabela.appendChild(tr)
    })

    gerar_grafico(soma_entradas, soma_saidas)    
};

function excluir_item(id){
    dados = dados.filter(item => item.id != id);
    localStorage.setItem("dados", JSON.stringify(dados));
    gerar_tabela(dados);
}

function enviar_dados(){
    let info = {
        id:Number(Date.now()),
        mes:mes_atual,
        ano:(ano_atual),
        valor:Number(valor.value),
        tipo:tipo_valor.value, 
        descricao:tipo_valor.value === "entrada" ? "-" : Number(descricao.value)
    };
    dados.push(info);
    localStorage.setItem("dados", JSON.stringify(dados));

    filtrar(ano_atual,mes_atual)

    valor.value = "";
    descricao.value = "";
};

function envia_ano_mes(){
    filtrar(ano.value, mes.value);
}

function gerar_grafico(total_entradas, total_saidas){
    let saldo = total_entradas - total_saidas
    let porcentagem_saida = (total_saidas*100)/total_entradas

    grafico.style.setProperty("--porcentagem", porcentagem_saida)
    if(saldo >= 0){
        resultado.style.color = "green"
    } else{
        resultado.style.color = "red"
    }

    valor_entrada.innerHTML = `R$ ${total_entradas.toFixed(2)}`
    valor_saida.innerHTML = `R$ ${total_saidas.toFixed(2)}`
    resultado.innerHTML = `R$ ${saldo.toFixed(2)}`

}

// ----------------------- Logica do Programa ---------------------------
btn_filtro.addEventListener('click', envia_ano_mes)
btn_incluir.addEventListener('click', enviar_dados)

tipo_valor.addEventListener('change', function(){
    let tipo = this.value;
    if (tipo == "saida"){
        div_descricao.classList.add('ativo');
    } else{
        div_descricao.classList.remove('ativo');
    }
})

window.onload = filtrar(ano_atual, mes_atual)