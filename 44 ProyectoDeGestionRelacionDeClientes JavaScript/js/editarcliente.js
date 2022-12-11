import { obtenerCliente, actualizarCliente } from "./API.js";
import { injectarMensaje, validar } from "./funciones.js";
(function() {
    const nombreIn = document.querySelector('#nombre');
    const emailIn = document.querySelector('#email');
    const telIn = document.querySelector('#telefono');
    const empresaIn = document.querySelector('#empresa');
    const idIn = document.querySelector('#id');

    document.addEventListener('DOMContentLoaded', async () => {

        const parametrosURL = new URLSearchParams(window.location.search);
        const idCliente = parseInt(parametrosURL.get('id'));

        const cliente  = await obtenerCliente(idCliente);  

        mostrarCliente(cliente);

        const formulario = document.querySelector('#formulario');
        formulario.addEventListener('submit', validarCliente);
    });

    function mostrarCliente(cliente) {
        const {nombre, empresa, email, telefono, id} = cliente;

        nombreIn.value = nombre;
        emailIn.value = email;
        telIn.value = telefono;
        empresaIn.value = empresa;
        idIn.value = id;
    }

    function validarCliente(e) {
        e.preventDefault();

        const cliente = {
            nombre: nombreIn.value,
            email: emailIn.value,
            telefono: telIn.value,
            empresa: emailIn.value,
            id: parseInt(idIn.value)
        } 

        if(validar(cliente)){
            injectarMensaje('Todos los campos son obligatorios');
            return;
        }
            actualizarCliente(cliente);
    }
})();