// Variables
const carrito = document.querySelector('#carrito');
const contCarrito = document.querySelector('tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

registroEventListeners();
function registroEventListeners() {
    // Cuando agragas un curso al carrito
    listaCursos.addEventListener('click', agregarCurso);

    // Elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Muestra los cursos almacenados en local storage
    document.addEventListener('DOMContentLoaded', cursosStorage)

    // Vaciar el Carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        // Resetear el arreglo
        articulosCarrito = [];
        
        //Eliminamos el codigo injectado en por medio de javaScript en el HTML 
        limpiarHTML();
    });
}

//Funciones//

//Selecciona el padre ("info-card") y el padre nuevamente ('card') 
function agregarCurso(e) {

    // Es un href con un signo de gato hace que se desplaze la pagina la hacer click
    e.preventDefault();

    // Especifica el click en el enlace o boton de agregar carrito.
    if(e.target.classList.contains('agregar-carrito')) {

        const cursoSel = e.target.parentElement.parentElement;
        
        leerDatosCurso(cursoSel);
    }
}

// Elimina cusrso del carrito
function eliminarCurso(e) {
    // Especifica el click en el enlace o boton de (X) en el carrito para eliminarlo del carrito.
    if(e.target.classList.contains('borrar-curso')) {
   
        const cursoId = e.target.getAttribute('data-id');

        // Elimina del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( curso => curso.id !== cursoId );

        //Injecta el codigo en el HTML
        carritoHTML();
    }
}    

// Lee el contenido del HTML y extrae la informacion del curso.
function leerDatosCurso(curso) {

    //Objeto con el contenido del curso.
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('span').textContent,
        id:     curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    //Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
   
    if(existe){
        // Actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {

            if(curso.id === infoCurso.id){
                
                curso.cantidad++;

                //retorna el objeto actualizado en la cantidad.
                return curso;
            }else {
              // retorna el objeto origina el cual no fue duplicado.  
              return curso; 
            }
        }); 

        articulosCarrito = [...cursos] 
    }else {
        //Agrega elementos al carrito.
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    console.log(articulosCarrito);

    // Injecta al HTML el codigo modificado
    carritoHTML();
}

// Injecta el codigo del carrito del compras en el HTML
function carritoHTML() {
    //Limpiar el HTML
    limpiarHTML();

    //Recorre el carrito y genera el HTML
    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        
        // Destructuring
        const {imagen, titulo, precio, cantidad, id} = curso;
        
        row.innerHTML = `<td><img src="${imagen}" width="100"</td>
                         <td>${titulo}</td>
                         <td>${precio}</td>
                         <td>${cantidad}</td>
                         <td><a href="#" class="borrar-curso" data-id="${id}"> X </a></td>`;

        // Agrega el HTML del carrito en el tablebody(tb, tBody).
        contCarrito.appendChild(row);
    });

    // Sincronizar el carrito de compras con el almacenamiento local (localstorage)
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function cursosStorage() { 
    articulosCarrito = JSON.parse( localStorage.getItem('carrito')) || [];
    carritoHTML();
}


//Elimina los cursos del tbody para que no se vayan acumulando
function limpiarHTML() {
    //Forma lenta
    //contCarrito.innerHTML = '';

    //Forma Optimizada
    while(contCarrito.firstChild){
        contCarrito.removeChild(contCarrito.firstChild);
    }
}
