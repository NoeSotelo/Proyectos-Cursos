let DB;


function conectarDB() {
    const abrirConexion = window.indexedDB.open('crm', 1);
    abrirConexion.onerror = function() {
        console.log('Hubo un error');
    }
    abrirConexion.onsuccess = function() {
        DB = abrirConexion.result;
    }
}

function impAlert(mensje, tipo) {
        
    const alerta = document.querySelector('.alerta');
    if(!alerta){

        const divAlert = document.createElement('div');

        divAlert.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
        
        if(tipo === 'error'){
            divAlert.classList.add('bg-red-100', 'border-red-400', 'text-red-700'); 
        }else{
            divAlert.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }

        divAlert.textContent = mensje;

        formulario.appendChild(divAlert);
        setTimeout(() => {
            divAlert.remove();
        }, 3000);
    }       
}
