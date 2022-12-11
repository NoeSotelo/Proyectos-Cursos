
function iniciarApp() {
    
    const selectCategorias = document.querySelector('#categorias');
    const selectResultado = document.querySelector('#resultado');
    const modal = new bootstrap.Modal('#modal', {});
    const favoritosDiv = document.querySelector('.favoritos');

    if(selectCategorias) { 
        selectCategorias.addEventListener('change', elegirCategoria)
        obtenerCategorias(); 
    }   

    if(favoritosDiv){
        obtenerFavoritos();
    }

    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        fetch(url)
            .then(resp => resp.json())
            .then(result =>  mostrarCategorias(result.categories))
    }

    function mostrarCategorias(categorias) {

        categorias.forEach(categoria => {
            const options = document.createElement('OPTION');
            options.value = categoria.strCategory;
            options.textContent = categoria.strCategory;
            selectCategorias.appendChild(options);
        });
    }

    function elegirCategoria(e) {
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        fetch(url)
            .then (resp => resp.json())
            .then (result => mostrarRecetas(result.meals))
    }

    function mostrarRecetas(recetas){

        limpiarHTML(resultado);

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black', 'my-5');
        heading.textContent = recetas.length ? 'Resultados' : 'No hay Resultados';
        resultado.appendChild(heading);

        recetas.forEach(receta => {
            const {idMeal, strMeal, strMealThumb} = receta;

            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col-md-4')

            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card', 'mb-4');

            const recetaImg = document.createElement('IMG');
            recetaImg.classList.add('card-img-top');
            recetaImg.alt = `Imagen de la receta ${strMeal ?? receta.nombre}`;
            recetaImg.src = strMealThumb ?? receta.imagen;
            
            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal ?? receta.nombre;

            const recetaBtn = document.createElement('BUTTON');
            recetaBtn.classList.add('btn', 'btn-danger', 'w-100');
            recetaBtn.textContent = 'Ver Receta';
            // recetaBtn.dataset.bsTarget = "#modal";
            // recetaBtn.dataset.bsToggle = "modal";
            recetaBtn.onclick = function (){
                seleccionarReceta(idMeal ?? receta.id);
            }
            
        // injectar en el HTML

            // .recetaContenedor
            //     .card
            //         img
            //         .card-body
            //             h3
            //             button

            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaBtn);

            recetaCard.appendChild(recetaImg);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);
            
            selectResultado.appendChild(recetaContenedor);
        });
    }

    function seleccionarReceta(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        fetch(url)
            .then(resp => resp.json())
            .then(result => mostrarRecetaModal(result.meals[0]))

    }

    function mostrarRecetaModal(receta){
        console.log(receta);

        const {idMeal, strInstructions, strMeal, strMealThumb} = receta;

        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
        <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}"/>
        <h3 class="my-3">Instrucciones</h3>
        <p>${strInstructions}</p>
        <h3 class="myt-3">Ingredientes y cantidades</h3>
        `;

        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group');

        for (let i = 1; i < 20; i++) {
            if(receta[`strIngredient${i}`]){
                const ingrdiente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingrdienteli = document.createElement('LI');
                ingrdienteli.classList.add('list-group-item');
                ingrdienteli.textContent = `${ingrdiente} - ${cantidad}`
                
                listGroup.appendChild(ingrdienteli);
            }          
            
        }

        modalBody.appendChild(listGroup)

        const modalFooter = document.querySelector('.modal-footer');

        limpiarHTML(modalFooter);


        const btnFavorito = document.createElement('BUTTON');
        btnFavorito.classList.add('btn', 'btn-danger', 'col');
        btnFavorito.textContent = existeStorge(idMeal) ? 'Eliminar Favorito' : 'Guardar Favorito';

        btnFavorito.onclick = function() {

            if(existeStorge(idMeal)){
                eliminarFavorito(idMeal);
                btnFavorito.textContent = 'Guardar Favorito';
                mostrarToast('Eliminado Correctamente');
                return;
            }

            agregarFavorito({
                id: idMeal,
                nombre: strMeal,
                imagen: strMealThumb,
            });
            btnFavorito.textContent = 'Eliminar Favorito';
            mostrarToast('Agregado Correctamente');
        }

        const btnCerrar = document.createElement('BUTTON');
        btnCerrar.classList.add('btn', 'btn-secondary', 'col');
        btnCerrar.textContent = 'Cerrar';

        btnCerrar.onclick = function(){
            modal.hide(); 
        }

        modalFooter.appendChild(btnFavorito);   
        modalFooter.appendChild(btnCerrar);

        modal.show();

    }

    function agregarFavorito(receta) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? []; // anulacion logica
        localStorage.setItem('favoritos',JSON.stringify([...favoritos, receta]));
    }

    function eliminarFavorito(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        const nueFavoritos = favoritos.filter(favorito => favorito.id !== id );
        localStorage.setItem('favoritos', JSON.stringify(nueFavoritos));
    }

    function existeStorge(id) {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    }
    
    function mostrarToast(mensaje) {
        const toastDiv = document.querySelector('#toast');
        const toastBody = document.querySelector('.toast-body');
        const toast = new bootstrap.Toast(toastDiv);
        toastBody.textContent = mensaje;
        toast.show();


    }

    function obtenerFavoritos() {
        const favoritos = JSON.parse(localStorage.getItem('favoritos')) ?? [];

        if(favoritos.length){
            mostrarRecetas(favoritos);
            return;
        }
        console.log('no hay favoritos'); 
        const noFavoritos = document.createElement('P');
        noFavoritos.textContent = 'No hay favoritos';
        noFavoritos.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
        selectResultado.appendChild(noFavoritos);   
    }

    function limpiarHTML(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }
}

document.addEventListener('DOMContentLoaded', iniciarApp);