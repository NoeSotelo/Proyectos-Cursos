(function(){
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', function (){

        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();

        // Leer los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === '') { 
            impAlert('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id : Date.now(),
        }

        nuevoCliente(cliente); 
    }

    function nuevoCliente(cliente) {
        const tran = DB.transaction(['crm'], 'readwrite');

        const objectStore = tran.objectStore('crm');

        objectStore.add(cliente);

        tran.onerror = function() {
            impAlert('Usuario ya agregado', 'error');
        }
        tran.oncomplete = function() {
            console.log('Cliente agreagado');

            impAlert('El cliente se agrego correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
    }  
})();