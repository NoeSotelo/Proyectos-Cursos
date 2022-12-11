const contenedor = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', function(){
    formulario.addEventListener('submit', buscarClima);
})

function buscarClima(e) {
    e.preventDefault();

    // Validar

    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    console.log(ciudad, pais);

    if( ciudad === '' || pais === ''){
        impAlerta('Todos los campos son obligatorios');
        return;
    }

    consultarAPI(ciudad, pais);

};

function impAlerta(mensaje) {
    
    const alert = document.querySelector('.bg-red-100');

    if(!alert) {
        const alert = document.createElement('div');
        alert.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
    
        alert.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span> 
        `;
        contenedor.appendChild(alert);
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
};

function consultarAPI(ciudad, pais) {
    const appId = 'a10e9a8b06e8bbed46b9640c20170611';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => {

            cleanHTML();

            console.log(datos);
            if(datos.cod === "404"){
                impAlerta('Ciudad no valida!')
                return;
            }
            
            mostrarClima(datos);
        })
}

function mostrarClima(datos){
    const {name, main:{temp, temp_max, temp_min}} = datos;

    const tempActual = formatTemp(temp);
    const tempMax = formatTemp(temp_max);
    const tempMin = formatTemp(temp_min);

    const nombre = document.createElement('P');
    nombre.textContent = `Clima en: ${name}`;
    nombre.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('P');
    actual.innerHTML = `${tempActual} &#8451`;
    actual.classList.add('font-bold', 'text-6xl');

    const maxima = document.createElement('P');
    maxima.innerHTML = `Max: ${tempMax} &#8451`;
    maxima.classList.add('text-xl');

    const minima = document.createElement('P');
    minima.innerHTML = `Min: ${tempMin} &#8451`;
    minima.classList.add('text-xl');
    
    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombre);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(maxima);
    resultadoDiv.appendChild(minima);

    resultado.appendChild(resultadoDiv);
}

const formatTemp = grados => parseInt(grados-273.15);

function cleanHTML() {
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    } 
}

function spinner() {
    cleanHTML();

    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('sk-circle');

    divSpinner.innerHTML = `
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
    `
    resultado.appendChild(divSpinner);
}