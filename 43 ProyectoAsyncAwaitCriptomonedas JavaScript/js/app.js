const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formSelect = document.querySelector('#formulario');
const resultSelect = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

//Crear Promise
const obtainCripto = cripto => new Promise( resolve => {
    resolve(cripto)
});

document.addEventListener('DOMContentLoaded', () => {
    ConsultaCripto();

    formSelect.addEventListener('submit', submitForm);
    formSelect.addEventListener('submit', resetForm);

    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
    
});

async function ConsultaCripto(){

    // fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD')
    //     .then( resp => resp.json() )
    //     .then( resul => obtainCripto(resul.Data) )
    //     .then( cripto => selectCrypto(cripto) )

    try {
        const resp = await fetch('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD');
        const resul = await resp.json();
        const cripto = await obtainCripto(resul.Data);
        selectCrypto(cripto);
    } catch (error) {
        console.log(error);
    }
}


function selectCrypto (criptomonedas) {

    criptomonedas.forEach(cripto => {

        const {Name, FullName} = cripto.CoinInfo;
        const option = document.createElement ('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptoSelect.appendChild(option);      
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value

}

function submitForm(e) {
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;
    if(moneda === ''|| criptomoneda ==='' ){
        impAlert('Todos los campos son obligatorios');
        return;
    }

    consultarAPI();
}

function impAlert(msj) {
    const hayAlerta = document.querySelector('.error');
    if(!hayAlerta){
        const divAlert = document.createElement('div');
        divAlert.classList.add('error');
        divAlert.textContent = msj;
        formSelect.appendChild(divAlert);

        setTimeout(() => {
            divAlert.remove();
        }, 2000); 
    }
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;

    spinner();

    // fetch (`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`)
    //     .then(resp => resp.json())
    //     .then(resul => {
    //         injectarRespuestaAPI(resul.DISPLAY[criptomoneda][moneda]);
    //     })

    try {
        const resp = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`); 
        const resul = await resp.json();
        injectarRespuestaAPI(resul.DISPLAY[criptomoneda][moneda]);

    } catch (error) {
        console.log(error)
    }
}

function injectarRespuestaAPI(respuesta) {

    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = respuesta; 

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia <span>${LOWDAY}</span>`;

    const variacion = document.createElement('P');
    variacion.innerHTML = `<p>Variacion ultimas 24hrs <span>${CHANGEPCT24HOUR}%</span>`;

    const actualizado = document.createElement('P');
    actualizado.innerHTML = `<p>Ultima Actualizacion <span>${LASTUPDATE}</span>`;
    

    resultSelect.appendChild(precio);
    resultSelect.appendChild(precioAlto);
    resultSelect.appendChild(precioBajo);
    resultSelect.appendChild(variacion);
    resultSelect.appendChild(actualizado);
}

function spinner(){
    limpiarHTML();
    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');
    spinner.innerHTML= `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;
    resultado.appendChild(spinner)
}

function limpiarHTML() {
    while(resultado.firstChild) { 
        resultado.removeChild(resultado.firstChild);
    }
}

function resetForm(){ 
    formSelect.reset();
}