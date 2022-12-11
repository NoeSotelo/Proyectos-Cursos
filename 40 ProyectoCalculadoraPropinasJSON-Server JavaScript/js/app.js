let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardar = document.querySelector('#guardar-cliente');
btnGuardar.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some( campo => campo === '' );

    if(camposVacios){
        impAlerta('Todos los campos son obligatorios'); 
        return;
    }
        cliente = {...cliente, mesa, hora}; 

        const modalFormulario = document.querySelector('#formulario');
        const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
        modalBootstrap.hide();

        mostrarSecciones();

        obtenerPlatillos();
}





function impAlerta(mensaje) {  

    const alertaExistente = document.querySelector('.invalid-feedback');

    if(!alertaExistente){
    const alerta = document.createElement('DIV');

    alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
    alerta.textContent = mensaje;

    document.querySelector('.modal-body form').appendChild(alerta);

    setTimeout(() => {

        alerta.remove()
        }, 3000);
    }

};

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'));
};

function obtenerPlatillos() {

    fetch('http://localhost:4000/platillos')
        .then( resp => resp.json() )
        .then( resul => injectarHTMLPlatillos(resul) )
        .catch( error =>console.log(error, 'error en el fetch') )        
}

function injectarHTMLPlatillos(platillos) {

    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV')
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`; 

        const categoria = document.createElement('DIV')
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //funcion que detecta la cantidad y el platillo que se esta agregando
        inputCantidad.onchange = function() {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad});
        }

        const agregar = document.createElement('DIV')
        agregar.classList.add('col-md-2');

        agregar.appendChild(inputCantidad); 
        
        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
    });
}

function agregarPlatillo(producto) {
    let {pedido} = cliente;

    if(producto.cantidad > 0) {
        //comprueba si el elemento ya existe en el array
        if(pedido.some( articulo => articulo.id === producto.id)) { 
            const pedidoActual = pedido.map( articulo => {
                if(articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            cliente.pedido = [...pedidoActual];
        }else {
            cliente.pedido = [...pedido, producto];
        }

    }else {
        // Eliminar Elementos cuando la cantidad sea 0 
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];

    }
    //Limpiar el HTML previo
    limpiarHTML();

    if(cliente.pedido.length) {
        //Mostrar el resumen
        injectarResumen();
    }else {
        mensajePedidoVacio();
    }

   
}

function injectarResumen() {
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-2', 'px-3', 'shadow');

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN'); 
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');


    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN'); 
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');


    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    // titulo de la seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    // iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group');

    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        //Nombre
        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad
        const cantidadEL = document.createElement('P');
        cantidadEL.classList.add('fw-bold');
        cantidadEL.textContent = `Cantidad: `;
        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        //Precio
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = `Precio Unitario: `;
        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        //Subtotal
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = `Subtotal: `;
        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = `$${precio*cantidad}`;

        //Boton de Eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar del Pedido';
        //Funcion para eliminar del pedido
        btnEliminar.onclick = function() {
            eliminarProducto(id);
        }

        
        //Agregar valores a los contenedores
        subtotalEl.appendChild(subtotalValor);
        cantidadEL.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);

        


        // Agrega elementos a la lista (LI);

        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEL);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);


        //Agragar lista al grupo\
        grupo.appendChild(lista);

    })


    // agregar el contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);


    contenido.appendChild(resumen); 

    formularioPropinas();
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while(contenido.firstChild){
        contenido.removeChild(contenido.firstChild);
    }

}

function eliminarProducto(id) { 

    const {pedido} = cliente; 

    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    //Limpiar el HTML previo
    limpiarHTML();

    if(cliente.pedido.length) {
        //Mostrar el resumen
        injectarResumen();
    }else {
        mensajePedidoVacio();
    }

    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;

}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const text = document.createElement('P');
    text.classList.add('text-center');
    text.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(text);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'shadow');

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    // Radio Button 10%
    const radio10 = document.createElement('INPUT');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = "10"; 
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');
    
    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    // Radio Button 25%
    const radio25 = document.createElement('INPUT');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = "25"; 
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');
    
    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check'); 

    // Radio Button 50%
    const radio50 = document.createElement('INPUT');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = "50"; 
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('LABEL');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');
    
    const radio50Div = document.createElement('DIV');
    radio50Div.classList.add('form-check'); 

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);


    // Agragar al div Principal
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);


    //Agragarlo al formulario
    formulario.appendChild(divFormulario);
    

    contenido.appendChild(formulario);

}

function calcularPropina() {    

    const {pedido} = cliente    
    let subtotal = 0;

    pedido.forEach(articulo => {
        subtotal += articulo.cantidad * articulo.precio;
    })
    const propinaSelec = document.querySelector('[name="propina"]:checked').value;

    const propina = ((subtotal*parseInt(propinaSelec))/100);

    const total = subtotal + propina;

    injectarCalculosHTML(subtotal, total, propina);
}

function injectarCalculosHTML(subtotal, total, propina) {


    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar', 'my-5');

    // subtotal 
    const subtotalP = document.createElement('P');
    subtotalP.classList.add('fs-4', 'fw-bold', 'mt-2');
    subtotalP.textContent = 'Subtotal Consumo: ';

    const subtotalS = document.createElement('SPAN');
    subtotalS.classList.add('fw-normal');
    subtotalS.textContent = `$${subtotal}`;

    // propina
    const propinaP = document.createElement('P');
    propinaP.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaP.textContent = 'Propina: ';
 
    const propinaS = document.createElement('SPAN');
    propinaS.classList.add('fw-normal');
    propinaS.textContent = `$${propina}`;

    // total
    const totalP = document.createElement('P');
    totalP.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalP.textContent = 'Total: ';
 
    const totalS = document.createElement('SPAN');
    totalS.classList.add('fw-normal');
    totalS.textContent = `$${total}`;

    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove();
    }

    subtotalP.appendChild(subtotalS);
    propinaP.appendChild(propinaS);
    totalP.appendChild(totalS)


    divTotales.appendChild(subtotalP);
    divTotales.appendChild(propinaP);
    divTotales.appendChild(totalP);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}