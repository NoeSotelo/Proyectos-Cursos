const url = 'http://localhost:4000/clientes';

export const nuevoCliente = async cliente => {
    try {
        await fetch(url, {
            method: 'POST',
            body: JSON.stringify(cliente),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        window.location.href = 'index.html';

    } catch (error) {
        console.log(error);        
    }
}

export const obtenerClientes = async () => {
    try {
        const result = await fetch(url);
        const clientes = await result.json();
        return clientes;
    } catch (error) {
        console.log(error)
    }
}

export const eliminarCliente = async id => {
    try {
        await fetch(`${url}/${id}`, {
            method: 'DELETE'
        })
    } catch (error) {
        console.log(error)
    }
}

export const obtenerCliente = async id => {
    try {
        const result = await fetch(`${url}/${id}`);
        const cliente = await result.json();
        return cliente;

    } catch (error) {
        console.log(error)
    }
}

export const actualizarCliente = async cliente => {
    try {

        await fetch(`${url}/${cliente.id}`, {
            method: 'PUT',
            body:JSON.stringify(cliente),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        window.location.href = 'index.html';
    } catch (error) {
        console.log(error);
    }
} 
