(function(){
    let idCliente;
    // Conectar a la base de datos
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    
    document.addEventListener('DOMContentLoaded', function(){
        conectarDB();
        formulario.addEventListener('submit', actualizarDB);
        // Verificar el ID de la URL del cliente
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        if(idCliente){

            setTimeout(() => {
                tomarCliente(idCliente);
            }, 100);
        }
    });

    function actualizarDB(e){
        e.preventDefault();
        
        if(nombreInput.value === '' || emailInput.value === '' || telInput.value === ''|| empresaInput.value === ''){
            impAlert('Todos los campos son obligatorios', 'error');
            return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const tran = DB.transaction(['crm'], 'readwrite');
        const objectStore = tran.objectStore('crm');

        objectStore.put(clienteActualizado);

        tran.oncomplete = function(){
            impAlert('Editado correctamente');   

            setTimeout(() => {
                window.location.href = 'index.html'; 
            }, 3000); 
        }

        tran.onerror = function(){
            impAlert('Error al editar');
        }
    }

    function tomarCliente(id) {
        const tran = DB.transaction(['crm'], 'readonly');
        const objectStore = tran.objectStore('crm');
        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e) {
            const cursor = e.target.result;

            if(cursor){
                if (cursor.value.id === Number(id)) {
                    rellenarEdit(cursor.value); 
                }
                cursor.continue();
            }
        }     
    }

    function rellenarEdit(datoscliente){ 
        const {nombre, email, telefono, empresa} = datoscliente;

        nombreInput.value = nombre;
        emailInput.value = email;
        telInput.value = telefono;
        empresaInput.value = empresa;

    }  
})();