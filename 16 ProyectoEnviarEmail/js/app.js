// Variables
const btnEnviar = document.querySelector('#enviar');
const btnReset = document.querySelector('#resetBtn'); 
const formulario = document.querySelector('#enviar-mail'); 
const exreg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    

// Variables de Campos
const email = document.querySelector('#email');
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');

eventListeners();
function eventListeners() {
    // Cuando la app arranca
    document.addEventListener('DOMContentLoaded', iniciarApp);

    // Campos del Formulario
    email.addEventListener('blur', validarFormulario);
    asunto.addEventListener('blur', validarFormulario);
    mensaje.addEventListener('blur', validarFormulario);

    // Reinicia el formulario
    btnReset.addEventListener('click', resetForm); 

    // Enviar email
    formulario.addEventListener('submit', enviarEmail); 
}

// Funciones
function iniciarApp(e) {
    // console.log('Iniciando...')
    btnEnviar.disabled = true;
    btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
}

// Funcion de validar formulario
 function validarFormulario(e) {

    // console.log('validando...');

    if(e.target.value.length > 0 ){
        // console.log('Si hay algo');
        // ELiminar los errores
        const error = document.querySelector('p.error')
        if(error){
            error.remove();
        }

        e.target.classList.remove('border','border-red-500');
        e.target.classList.add('border','border-green-500');
    } else{
        e.target.classList.remove('border','border-green-500');
        // console.log('No hay nada');
        //e.target.style.borderBottomColor = 'red';
        e.target.classList.add('border','border-red-500');

        mostrarError('Todos los campos son obligatorios');
    }

    if(e.target.type === 'email'){

        
        if(exreg.test(e.target.value)) { 

            const error = document.querySelector('p.error')
            if(error){
                error.remove();
            }
            e.target.classList.remove('border','border-red-500');
            e.target.classList.add('border','border-green-500');
            
        } else {

            e.target.classList.remove('border','border-green-500');
            e.target.classList.add('border','border-red-500');

            mostrarError('Email no valido');
        }
    }

    if(exreg.test(email.value) && asunto.value !== '' && mensaje.value !== '') {
        btnEnviar.disabled = false;
        btnEnviar.classList.remove('cursor-not-allowed', 'opacity-50');
    }else{
        btnEnviar.disabled = true;
        btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
    }
}

function mostrarError(mensaje) { 
    const mensajeError = document.createElement('p');
    mensajeError.textContent = mensaje;
    mensajeError.classList.add('border', 'border-red-500', 'background-red-100', 'text-red-500', 'p-3', 'mt-5', 'text-center', 'error');

    const errores = document.querySelectorAll('.error'); 
    if(errores.length === 0) {
    formulario.appendChild(mensajeError);
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
    }  
}

// Funcion de enviar email
function enviarEmail(e) {
    e.preventDefault();
    ///console.log('enviando...'); 

    // Mostrar el spinner que simula el estado de "enviando"
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'flex';

    // Despues de 3 segundos quitar el spinner y mostrar mensaje de "ENVIADO"
    // setInterval: se ejecuta en intervalos por el tiempo definido ejemplo: si defines 3000 se ejecutara cada 3 segundos.
    setTimeout(() => {
        //console.log('Esta funcion se ejecuta despues de 3 segundos');
        spinner.style.display = 'none';

        // Mensaje de enviado
        const parrafo = document.createElement('P');
        parrafo.textContent = 'Mensaje enviado';
        parrafo.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'my-10', 'font-bold');
        
        // Inserta el parrafo antes del spinner
        formulario.insertBefore(parrafo, spinner);
        
        // Elimina el mensaje en verde de confimacion de envio
        setTimeout(() => {
            parrafo.remove();
            resetForm();
        }, 2000);
    }, 3000);
}

// Funcion para resetear el formulario
function resetForm(e){
    if(e){
        e.preventDefault();
    }
   
    formulario.reset();
    email.classList.remove('border','border-green-500');
    asunto.classList.remove('border','border-green-500');
    mensaje.classList.remove('border','border-green-500');
    
    iniciarApp();
}

//spinkit: pagina para conseguir spinners de diferentes disenios