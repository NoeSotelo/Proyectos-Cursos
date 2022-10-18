// Variables 
const marca = document.querySelector('#marca');
const year = document.querySelector('#year');
const minimo = document.querySelector('#minimo');
const maximo = document.querySelector('#maximo');
const puertas = document.querySelector('#puertas');
const transmision = document.querySelector('#transmision'); 
const color = document.querySelector('#color'); 

//contenedor de los resultasdos
const resultado = document.querySelector('#resultado');


const max = new Date().getFullYear();
const min = max - 10;

// Objeto que guradara la seleccion de buqueda dada por el usuario.
const datosBusqueda = {
    marca:'',
    year:'',
    minimo:'',
    maximo:'',
    puertas:'',
    transmision:'',
    color:'',
}


//Eventos

document.addEventListener('DOMContentLoaded', () => {
    // muestra los autos al cargar
    mostrarAutos(autos);

    //llena las opciones de year 
    llenarSelect();
});

// Llenado del objeto con los filtros del usuario
marca.addEventListener('change', (e) => {
    datosBusqueda.marca = e.target.value;

    filtrarAuto();
})
year.addEventListener('change', (e) => {
    datosBusqueda.year = parseInt(e.target.value);

    filtrarAuto();
})
minimo.addEventListener('change', (e) => {
    datosBusqueda.minimo = e.target.value;

    filtrarAuto();
})
maximo.addEventListener('change', (e) => {
    datosBusqueda.maximo = e.target.value;

    filtrarAuto();
})
puertas.addEventListener('change', (e) => {
    datosBusqueda.puertas = parseInt(e.target.value);

    filtrarAuto();
})
transmision.addEventListener('change', (e) => {
    datosBusqueda.transmision = e.target.value;

    filtrarAuto();  
})
color.addEventListener('change', (e) => {
    datosBusqueda.color = e.target.value;

    filtrarAuto();  
})



//Funciones
//
function mostrarAutos(autos) {

    limpiarHTML();

    autos.forEach( auto => {
        const {marca, modelo, year, puertas, transmision, precio, color} = auto
        const autoHTML = document.createElement('p');

        autoHTML.textContent = `${marca} ${modelo} - ${year} - ${puertas} puertas - Transmision: ${transmision} - Precio: $${precio} - Color: ${color} `;
        // insertar en el HTML 
        resultado.appendChild(autoHTML);
    })
}

// limpiar html
function limpiarHTML() {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

}

// Genera los years para el select
function llenarSelect(){
    for(let i = max; i >= min; i--){
        const opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        year.appendChild(opcion);
    }
}

// Funcion que filtra en base a la busqueda.

function filtrarAuto() { 
    const resultado = autos.filter( filtrarMarca ).filter( filtrarYear).filter( filtrarMinimo ).filter(filtrarMaximo).filter(filtrarPuertas).filter(filtrarTransmision).filter(filtrarColor);

    //console.log(resultado);

    if (resultado.length ) {
        mostrarAutos(resultado); 
    }else { 
        noResultado()
    }
}

function noResultado(){
    limpiarHTML();
    const noResultado = document.createElement('DIV');
    noResultado.classList.add('alerta', 'error');
    noResultado.textContent = 'No hay resultados con esas opciones de busqueda';
    resultado.appendChild(noResultado);
}

function filtrarMarca(auto) {
    if(datosBusqueda.marca) {
        return auto.marca === datosBusqueda.marca;
    }
    return auto;
}

function filtrarYear(auto) {
    const { year } = datosBusqueda;
    if( year ) {
        return auto.year === year;
    }
    return auto;
}

function filtrarMinimo(auto) {
    const { minimo } = datosBusqueda;
    if( minimo ) {
        return auto.precio >= minimo;
    }
    return auto;
}

function filtrarMaximo(auto) {
    const {maximo} = datosBusqueda;
    if( maximo ) {
        return auto.precio <= maximo;
    }
    return auto;
}

function filtrarPuertas(auto) {

    const {puertas} = datosBusqueda;
    if( puertas ) {
        return auto.puertas === puertas;
    }
    return auto;
}

function filtrarTransmision(auto) {

    const {transmision} = datosBusqueda;
    if( transmision ) {
        return auto.transmision === transmision;
    }
    return auto;
}

function filtrarColor(auto) {

    const {color} = datosBusqueda;
    if( color ) {
        return auto.color === color;
    }
    return auto;
}