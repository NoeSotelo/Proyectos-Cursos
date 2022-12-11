// Variables
const formulario = document.querySelector('#formulario');
const listaTweets = document.querySelector('#lista-tweets'); 
let tweets=[];
 
// Eventos (Event Listeners)
eventLinsteners();
function eventLinsteners () {
    //cuando el usuario agrega un nuevo tweet
    formulario.addEventListener('submit', agregarTweet);

    //cuando el el documento esta listo
    document.addEventListener('DOMContentLoaded', cargarTweets ) 
}


// Funciones
function agregarTweet(e) {
    e.preventDefault();
    //Tweet es el id del textarea 
    const tweet = document.querySelector('#tweet').value;

    //validacion
    
    if(tweet===''){
        mostrarError('Un mensaje no puede ir vacio');
        return; // evita que se ejecute mas lineass de codigo.
    }
    // Agragar al areglo de tweets

    const tweetObj = {
        id: Date.now(),
        tweet // = tweet: tweet
    }
    tweets = [...tweets, tweetObj];


    // Crear codigo HTML e injectarlo en el index.html
    crearHtml();

    //reiniciar el formulario
    formulario.reset();
}


// mostrar mensaje dde error
function mostrarError(error) {
    const mensajeError = document.createElement('P');
    mensajeError.textContent = error;
    mensajeError.classList.add('error');


    //Injectarlo en el HTML
    const contenido = document.querySelector('#contenido');
    contenido.appendChild(mensajeError); 

    // Elimna la alaerta despues de 3 segundos.
    setTimeout(() => {
        mensajeError.remove();
    }, 3000);
}
// Funcion que muestra un listado de los tweets
function crearHtml() {
    limpiarHtml();


    if (tweets.length > 0) {
        tweets.forEach(tweet => {
            // Agragar un boton para eliminar
            const btnEliminar = document.createElement('a');
            btnEliminar.classList.add('borrar-tweet');
            btnEliminar.textContent = 'X'; 

            //Funcion de eliminar
            btnEliminar.onclick = () => {
                borrarTweet(tweet.id);
            }

            // Crear los espacios para los textos en el HTML
            const li = document.createElement('LI'); 
            // Llenar los textos con los tweets escritos por el usuario
            li.innerText = tweet.tweet

            // Agregar el boton de eliminar
            li.appendChild(btnEliminar);

            // Injectarlo en el HTML
            listaTweets.appendChild(li);
                       
        });
    }

    sincronizarStorage();

}
// Agrega los tweets actuales a el almacenamiento local
function sincronizarStorage(){
    localStorage.setItem('tweets',JSON.stringify(tweets));
}

// Limpiar el HTML 
function limpiarHtml(){
    while(listaTweets.firstChild){
        listaTweets.removeChild(listaTweets.firstChild);
    }
}

function cargarTweets() {
    tweets = JSON.parse( localStorage.getItem('tweets')) || [];
    console.log(tweets);
    crearHtml();
}

function borrarTweet(id) {
    console.log('Borrando tweet...', id)
    tweets = tweets.filter(tweet => tweet.id !== id);
    crearHtml();
}