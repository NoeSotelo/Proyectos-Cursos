import {datosCita, nuevaCita} from '../funciones.js';
import { 
    mascotaInput, 
    propietarioInput, 
    telefonoInput, 
    fechaInput, 
    horaInput, 
    sintomasInput, 
    formulario 
} from '../selectores.js';

class App {
    constructor() {
       this.initApp(); 
    }

    initApp() {

        formulario.addEventListener('submit', nuevaCita);
    
        mascotaInput.addEventListener('change', datosCita);
        propietarioInput.addEventListener('change', datosCita);
        telefonoInput.addEventListener('change', datosCita);
        fechaInput.addEventListener('change', datosCita);
        horaInput.addEventListener('change', datosCita);
        sintomasInput.addEventListener('change', datosCita);

    }
}
export default App;