const carrito = document.getElementById('carrito');
const elementos1 = document.getElementById('lista-1');
const elementos2 = document.getElementById('lista-2');
const lista = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const realizarPedidoBtn = document.getElementById('realizar-pedido');

let productos = [];

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        productos = data.product;
        cargarEventListeners();
        cargarProductosDesdeLocalStorage();
      });
});

function cargarEventListeners() {
  elementos1.addEventListener('click', comprarElemento);
  elementos2.addEventListener('click', comprarElemento);
  carrito.addEventListener('click', eliminarElemento);
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  realizarPedidoBtn.addEventListener('click', realizarPedido);
}

function guardarProductosEnLocalStorage(productos) {
    localStorage.setItem('productos', JSON.stringify(productos));
}

function cargarProductosDesdeLocalStorage() {
    const productosLocalStorage = JSON.parse(localStorage.getItem('productos'));
    if (productosLocalStorage) {
      productos = productosLocalStorage;
      productos.forEach(insertarCarrito);
    }
}

function realizarPedido() {
    if (!lista.firstChild) {
        Swal.fire({
            icon: 'info',
            title: '¡Aún no has agregado productos!',
            text: 'Agrega algunos productos al carrito antes de realizar un pedido.',
            showConfirmButton: false,
            timer: 2500,
            background: '#2d3413',
            iconColor: '#ca7d08',
            customClass: {
                title: 'text-light',
            }
        });
    } else {
        Swal.fire({
            icon: 'success',
            title: '¡Pedido realizado!',
            text: 'Tu pedido ha sido realizado con éxito, gracias por comprar.',
            showConfirmButton: false,
            timer: 2500,
            background: '#2d3413',
        });
        guardarProductosEnLocalStorage(obtenerProductosDelCarrito());
    }
}

function comprarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const elementoId = e.target.getAttribute('data-id');
        const productoEncontrado = productos.find(producto => producto.id == elementoId);
        if (productoEncontrado) {
            leerDatosElemento(productoEncontrado);
        }
    }
}

function leerDatosElemento(elemento) {
    const infoElemento = {
        imagen: elemento.imagen,
        titulo: elemento.nombre,
        precio: elemento.precio,
        id: elemento.id.toString()
    };
    insertarCarrito(infoElemento);
}

function insertarCarrito(elemento) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <img src="${elemento.imagen}" width="100">
        </td>
        <td>
            ${elemento.titulo}
        </td>
        <td>
            ${elemento.precio}
        </td>
        <td>
            <a href="#" class="borrar" data-id="${elemento.id}">X</a>
        </td>
    `;
    lista.appendChild(row);

    Swal.fire({
        title: 'Producto agregado al carrito',
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
        background: '#2d3413',
        iconColor: '#ca7d08',
        customClass: {
            title: 'text-light',
        }
    });
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        e.target.parentElement.parentElement.remove();
    }
}

function vaciarCarrito() {
    if (lista.firstChild) {
        Swal.fire({
            title: '¿Eliminar Productos?',
            text: 'Esto eliminará todos los productos del carrito',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#2d3413',
            iconColor: '#ca7d08',
            customClass: {
                title: 'text-light',
                content: 'text-light',
                confirmButton: 'bg-danger',
                cancelButton: 'bg-primary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                while (lista.firstChild) {
                    lista.removeChild(lista.firstChild);
                }
                
                Swal.fire({
                    title: 'Carrito vaciado',
                    text: 'Todos los productos han sido eliminados',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#2d3413',
                    iconColor: '#ca7d08',
                    customClass: {
                        title: 'text-light',
                    }
                });
            }
        });
    } else {
        Swal.fire({
            title: 'El carrito ya está vacío',
            icon: 'info',
            showConfirmButton: false,
            timer: 1500,
            background: '#2d3413',
            iconColor: '#ca7d08',
            customClass: {
                title: 'text-light',
            }
        });
    }

    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        productos = data.product;
        cargarEventListeners();
        cargarProductosDesdeLocalStorage();
      });
});
