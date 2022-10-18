// Constructores 
function Seguro(marca, year, tipo){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

//realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {

    // 1 = Americano * 1.15, 2 = Asiatico * 1.05, 3 = Europeo * 1.35 
    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break; 
    }
    //  Leer el anio, 
    const diferencia = new Date().getFullYear() - this.year;
    //  Cada anio menor el costo se reduciara un 3%
    cantidad -= ((diferencia * 3) *  cantidad)/100;
    // si el seguro es basico se le suma un 30%, si el seguro es completo se suma un 50% mas del valor establecido.
    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else {
        cantidad *=1.50;
    } 
    return cantidad;
}

function UI() {}
// llena las opciones de anios en el selector de anio.
UI.prototype.opcYear = function() {
    const max = new Date().getFullYear();
    const min = max - 20; 

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
    
}
// muestra alertas en pantallas
UI.prototype.mostrarMensaje = function(mensaje, tipo) {
    
    const div = document.createElement('div'); 
    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar al HTML 
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));
    setTimeout(() => {
        div.remove();
    }, 3000);

}

UI.prototype.mostrarResultado = function(total , seguro) {

    const {marca, year, tipo} = seguro; 
    let textoMArca
    switch(marca){
        case '1':
            textoMArca = 'Americano';
            break;
        case '2':
            textoMArca = 'Asiatico';
            break;
        case '3':
            textoMArca = 'Europeo';
            break;
        default:
            break;
    }

    // crear el resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML =`<p class="header">Tu Resumen</p> 
                    <p class="font-bold">Marca: <span class="font-normal"> ${textoMArca}</span></p>
                    <p class="font-bold">Año: <span class="font-normal"> ${year}</span></p>
                    <p class="font-bold">Tipo: <span class="font-normal capitalize"> ${tipo}</span></p>
                    <p class="font-bold">Total: <span class="font-normal"> $${total}</span></p>
                   `;
    const resultadoDiv = document.querySelector('#resultado'); 
    

    // mostrar el spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    setTimeout(() => {
        //borrar spinner
        spinner.style.display = 'none';
        // mostrar resultado
        resultadoDiv.appendChild(div);

    }, 3000); 
}

// instaciar UI 
const ui = new UI();

document.addEventListener('DOMContentLoaded', llenarOpc);
// LLena el select con los anios...
function llenarOpc() {
    ui.opcYear();
}


eventListener();
function eventListener() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();
    // Leer la marca
    const marca = document.querySelector('#marca').value;
    // Leer el year
    const year = document.querySelector('#year').value;
    // Leer el cobertura (input de tipo radio)
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    if (marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    } 
    ui.mostrarMensaje('Cotizando...', 'exito');

    //remover las cotizaciones previas
    const resultado = document.querySelector('#resultado div');
    if(resultado != null){
        resultado.remove();
    }  

    // instaciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.cotizarSeguro();

    //prototype para cotizar 
    ui.mostrarResultado(total, seguro);
}