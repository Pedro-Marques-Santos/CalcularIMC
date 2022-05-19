class Imc {
    constructor(imc) {
        this.imc = imc
    }
}

class Bd {

    constructor(){
        this.valorMC = null;
        
        let id = localStorage.getItem('id')

        if( id === null ) {
            localStorage.setItem( 'id', 0 )
        }
    }

    receberDados(receberImc) {
        let x = receberImc
        this.valorMC = receberImc;
    }

    getProximoId() {
        let proximId = localStorage.getItem('id')
        proximId = parseInt(proximId) + 1
        return proximId
    }

    recuperarTodosId() {
     
        //array para armazenar todos os objetos de zero até o id
        let todosimc = Array()

        let id = localStorage.getItem('id')

        //recuperar todos os Imc
        for( let i=1; i <=id; i++ ) {

            //recuperar e transfomar cada imc em objeto
            let imcobj = JSON.parse(localStorage.getItem(i))

            //pular indices vazios ou removidos
            if( imcobj === null ) {
                continue //o continue tem a inteligencia de fazer com que pule para o proximo for, sem executar o que vem abaixo
            }

            //esse metódo foi implementado para adicionar um id em cada objeto, pois na hora de exlcuir, precisamos saber o id especifico da cada elemento
            //pq foi utilizado sem o let no id? pois, criou-se um elemento dentro do objeto, ou seja, id foi incrementado ao objeto
            imcobj.id = i
            //colocar os objetos dentro do array
            todosimc.push(imcobj)
        }

        return todosimc //retornando array

    }

    gravar() {
        let x = this.valorMC 
        let id = this.getProximoId()

        //dado de salvamento do imc
        localStorage.setItem(id, JSON.stringify(x))
        
        //dado utilizado para ir ao próximo id
        localStorage.setItem( 'id', id )
    }

}


var bd = new Bd()

function carregarImc() {
    let todosimc = bd.recuperarTodosId()
    console.log( todosimc )

    let tabela2 = document.getElementById('lista2')
    

    todosimc.forEach(function(d) {

        console.log('cheguei aqui')

        //criando li
        let li = document.createElement('li')
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center")
        li.innerHTML = d.imc
        tabela2.appendChild( li )

        let spanbutton = document.createElement('button')
        spanbutton.innerHTML = 'teste'
        spanbutton.className = 'btn btn-danger'
        spanbutton.innerHTML = '<i class="fa fa-times"  ></i>'
        li.appendChild( spanbutton)
        spanbutton.onclick = function() {
            localStorage.removeItem( d.id )
            window.location.reload()
        }
        

    })

    
}


function calcularImc() {
    let altura = document.getElementById('altura').value
    let peso = document.getElementById('peso').value
    let modalfrase1 = document.getElementById('modal-frase-1-erro')
    let modalfrase2 = document.getElementById('modal-frase-2-erro')


    if( altura == null | altura == '' | altura == undefined |
    peso == null | peso == '' | peso == undefined ) 
    {
        modalfrase1.innerHTML = "Erro ao gravar"
        modalfrase2.innerHTML = "Há caracteres que devem ser preenchidos"
        ativaModalErro()
        return 0
    }

    if (altura.includes(',') || peso.includes(',')) {
        modalfrase1.innerHTML = "Caracter inválido"
        modalfrase2.innerHTML = "Deve-se utilizar (ponto) ao invés de (vírgula)"
        ativaModalErro()
        return 0
    }

    altura = Math.pow( altura, 2 )
    let imc = (peso / altura).toFixed(1)
    limparCampo()
    
    let verificar = verificarImc( imc )
    //Criar elemento
    let divImc1 = document.createElement('div')
    divImc1.id = 'texto1'
    let divImc2 = document.createElement('div')
    divImc2.id = 'texto2'

    //elemento pai
    let divPaiImc = document.getElementById('elementoPaiResultado')

    //adicionando elementos a div pai
    divPaiImc.appendChild( divImc1 )
    divPaiImc.appendChild( divImc2 )

    console.log( imc )

    switch(verificar) {
        case 1: 
            explicarResultadoImc()
            document.getElementById('resultadoimc').innerHTML = 'O seu Índice de massa corporal é ' + imc
            document.getElementById('texto1').innerHTML = 'Seu peso é menor que 18.5'
            document.getElementById('texto2').innerHTML = 'Você está abaixo do peso ideal'
            ;break;
        case 2:
            explicarResultadoImc()
            document.getElementById('resultadoimc').innerHTML = 'O seu Índice de massa corporal é ' + imc
            document.getElementById('texto1').innerHTML = 'Seu IMC está entre 18.5 e 24.9'
            document.getElementById('texto2').innerHTML = 'Você está com o peso Ideal'
            ;break;
        case 3:
            explicarResultadoImc()
            document.getElementById('resultadoimc').innerHTML = 'O seu Índice de massa corporal é ' + imc
            document.getElementById('texto1').innerHTML = 'Seu IMC está entre 25 e 29.9'
            document.getElementById('texto2').innerHTML = 'Você está com Sobrepeso'
            ;break;
        case 4:
            explicarResultadoImc()
            document.getElementById('resultadoimc').innerHTML = 'O seu Índice de massa corporal é ' + imc
            document.getElementById('texto1').innerHTML = 'Seu IMC é está entre 30 e 39.9'
            document.getElementById('texto2').innerHTML = 'Você está com o grau 1 de Obesidade'
            ;break;
        case 5:
            explicarResultadoImc()
            document.getElementById('resultadoimc').innerHTML = 'O seu Índice de massa corporal é ' + imc
            document.getElementById('texto1').innerHTML = 'Seu IMC é maior que 39.8'
            document.getElementById('texto2').innerHTML = 'Você está em estado grave de Obesidade'
            ;break;
    }

    buttonExecutarUmaVez()

    //objeto imc
    let imcDados = new Imc( imc )
    bd.receberDados( imcDados )
    


}

function criarButtonSalvar() {
    let adicionarButtonSalvar = document.getElementById('adicionarButtonSalvar')
    let buttonSalvar = document.createElement('button')
    buttonSalvar.setAttribute( 'type', 'button' )
    buttonSalvar.appendChild(document.createTextNode('SALVAR IMC'));
    buttonSalvar.classList.add('button-salvar')
    buttonSalvar.id = 'buttonsalvardados2'
    adicionarButtonSalvar.appendChild( buttonSalvar )
    let button = document.getElementById('buttonsalvardados2')
    button.addEventListener("click", executarButtonSalvar)
}

function executarButtonSalvar() {
    bd.gravar()

    let modalSucessGravar1 = document.getElementById('modal-frase-1-erro')
    let modalSucessGravar2 = document.getElementById('modal-frase-2-erro')

    modalSucessGravar1.innerHTML = "O imc foi salvo com sucesso"
    modalSucessGravar2.innerHTML = "Os dados foram adicionados a lista de Imc"
    ativaModalErro()

}

var check = false

function buttonExecutarUmaVez() {

    if( check === false ) {
        criarButtonSalvar()
    }

    check = true

}


function explicarResultadoImc() {
    let explicaimcResultado = document.getElementById('explicaimc')
    let elementotextExcluido = document.getElementById('removeTextoimc')
    if( elementotextExcluido ) {
        elementotextExcluido.remove()
    }
    explicaimcResultado.classList.replace('cor-explica-imc','cor-explica-imc-resultado')
}

function verificarImc( x ) {

    if( x < 18.5 ) {
        return 1
    } else 

    if( x >= 18.5 && x <= 24.9 ) {
        return 2
    } else

    if( x >= 25 && x <= 29.9 ) {
        return 3
    } else

    if( x >= 30 && x <= 39.9 ) {
        return 4
    } else

    if( x > 39.9 ) {
        return 5
    }


}

function ativaModalErro() {
    $("#modal-erro").modal({
        show: true
    })
}

function voltarButton() {
    location. reload()
}

function limparCampo() {
    document.getElementById('altura').value = ''
    document.getElementById('peso').value = ''
}