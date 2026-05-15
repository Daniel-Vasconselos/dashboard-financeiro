
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
const grafico = document.getElementById("grafico_circular");
const resultado = document.getElementById("resultado");
const valor_entrada = document.getElementById("valor_entrada");
const valor_saida = document.getElementById("valor_saida");
const dropdown = document.getElementById("dropdown_conteudo");
const dropdown_filtro = document.getElementById("dropdown_filtro");

const btn_filtro = document.getElementById('btn_filtro');
const btn_incluir = document.getElementById('btn_incluir');
const btn_dropdow = document.getElementById("btn_dropdown");

let dados = JSON.parse(localStorage.getItem("dados")) || [];
let dados_filtrados = [];

const categorias = {
    1: {
        texto: "Moradia",
        icone: `<i class="bi bi-house-door"></i>`
    },

    2: {
        texto: "Contas",
        icone: `<i class="bi bi-file-earmark-text"></i>`
    },

    3: {
        texto: "Alimentação",
        icone: `<i class="bi bi-cup-hot"></i>`
    },

    4: {
        texto: "Transporte",
        icone: `<i class="bi bi-bus-front"></i>`
    },

    5: {
        texto: "Cartão",
        icone: `<i class="bi bi-credit-card"></i>`
    },

    6: {
        texto: "Lazer",
        icone: `<i class="bi bi-balloon"></i>`
    },

    7: {
        texto: "Saúde",
        icone: `<i class="bi bi-heart-pulse"></i>`
    },

    8: {
        texto: "Educação",
        icone: `<i class="bi bi-mortarboard"></i>`
    },

    9: {
        texto: "Dívidas",
        icone: `<i class="bi bi-bank"></i>`
    },

    10: {
        texto: "Roupas",
        icone: `<i class="bi bi-handbag"></i>`
    },

    11: {
        texto: "Viagem",
        icone: `<i class="bi bi-airplane"></i>`
    },

    12: {
        texto: "Outros",
        icone: `<i class="bi bi-grid-3x2-gap"></i>`
    }
};

// ----------------------- Logica do Programa ---------------------------

//botão para enviar o ano e o mês para filtrar a tabela e fechar a aba do Filtro
btn_filtro.addEventListener('click', function(){
    filtrar(ano.value, mes.value);
    dropdown.classList.remove("ativo")
});

//botão para adicionar novos dados no "Banco de dados" 
btn_incluir.addEventListener('click', function(){
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

    filtrar(ano_atual,mes_atual);

    valor.value = "";
    descricao.value = "";
});

//Botão para abrir e fechar a aba do filtro 
btn_dropdow.addEventListener('click', function(){
    dropdown.classList.toggle("ativo")
});

//Fechar a aba do filtro quando clicar fora da aba
document.addEventListener("click", (event) =>{
    if(!dropdown_filtro.contains(event.target)){
        dropdown.classList.remove("ativo")
    }
})

//Codigo para mostrar o campo de derscrição se o tipo do valor inserido for "Saida"
tipo_valor.addEventListener('change', function(){
    let tipo = this.value;
    if (tipo == "saida"){
        div_descricao.classList.add('ativo');
    } else{
        div_descricao.classList.remove('ativo');
    }
});

window.onload = filtrar(ano_atual, mes_atual);

// ------------------------ Funções do Programa ----------------------------------

// Função responsável por gerar a tabela
function gerar_tabela(dados_tabela){

    tabela.innerHTML = "";

    let soma_entradas = 0;
    let soma_saidas = 0;

    dados_tabela.forEach(item => {

        let tr = document.createElement("tr");

        let icone_tipo = "";
        
        if(item.tipo == "entrada"){
            icone_tipo = `<i class="bi bi-arrow-up-circle-fill"></i>`;
            soma_entradas += item.valor;

        } else {
            icone_tipo = `<i class="bi bi-arrow-down-circle-fill"></i>`;
            soma_saidas += item.valor;
        }

        // Busca categoria
        const categoria = categorias[item.descricao] || {
            texto: "",
            icone: `<i class="bi bi-dash-lg"></i>`
        };

        tr.innerHTML = `
            <td>${item.mes}/${item.ano}</td>

            <td>
                ${item.valor.toLocaleString('pt-BR', {
                    style:'currency',
                    currency: 'BRL'
                })}
            </td>

            <td>${icone_tipo}</td>

            <td>
                <span class="icone_descricao">
                    ${categoria.icone}
                </span>

                <span class="texto_descricao">
                    ${categoria.texto}
                </span>
            </td>

            <td>
                <button 
                    class="btn_excluir"
                    onclick="excluir_item(${item.id})"
                >
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        tabela.appendChild(tr);
    });

    gerar_grafico(soma_entradas, soma_saidas);
}

//função responsavel por filtrar os dados 
function filtrar(ano, mes){
    dados_filtrados = []
     dados.forEach(item => {
        if (item.ano == ano && (mes == "" || item.mes == mes)){
            dados_filtrados.push(item)
        }
    });

    gerar_tabela(dados_filtrados);
}

//Função responsavel por excluir item da tabela
function excluir_item(id){
    dados = dados.filter(item => item.id != id);
    localStorage.setItem("dados", JSON.stringify(dados));
    gerar_tabela(dados);
}

//Função responsavel por gerar o grafico
function gerar_grafico(total_entradas, total_saidas){ 
    let saldo = total_entradas - total_saidas;
    let porcentagem_saida = (total_saidas*100)/total_entradas;

    grafico.style.setProperty("--porcentagem", porcentagem_saida);
    if(saldo >= 0){
        resultado.style.color = "green"
    } else{
        resultado.style.color = "red"
    };

    valor_entrada.innerHTML = `R$ ${total_entradas.toFixed(2)}`;
    valor_saida.innerHTML = `R$ ${total_saidas.toFixed(2)}`;
    resultado.innerHTML = `R$ ${saldo.toFixed(2)}`;
}