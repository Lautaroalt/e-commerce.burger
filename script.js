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
  vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
  realizarPedidoBtn.addEventListener('click', realizarPedido);

  carrito.addEventListener('click', (e) => {
    if (e.target.classList.contains('borrar')) {
      const productoId = e.target.getAttribute('data-id');
      // Eliminar del DOM
      e.target.parentElement.parentElement.remove();
      // Eliminar del array productos
      productos = productos.filter(producto => producto.id !== productoId);
      // Actualizar localStorage
      guardarProductosEnLocalStorage(productos);
    }
  });
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
        vaciarCarrito(); // Vaciamos el carrito después de realizar el pedido
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

    guardarProductosEnLocalStorage(obtenerProductosDelCarrito());

    const botonEliminar = row.querySelector('.borrar');
    botonEliminar.addEventListener('click', eliminarElemento);
}

function eliminarElemento(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar')) {
        const productoId = e.target.getAttribute('data-id');
        // Eliminar del DOM
        e.target.parentElement.parentElement.remove();
        // Eliminar del array productos
        productos = productos.filter(producto => producto.id !== productoId);
        // Actualizar localStorage
        guardarProductosEnLocalStorage(productos);
    }
}

function vaciarCarrito() {
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

    // Limpiar productos del localStorage
    localStorage.removeItem('productos');
}

