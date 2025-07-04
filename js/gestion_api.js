const tabla = document.getElementById('tabla-productos');
// Eliminar referencias a formularios
const btnAgregar = document.getElementById('btn-agregar');

// Variable base para la URL de la API (fácil de cambiar en el futuro)
const API_BASE_URL = 'http://localhost:3000';

// Variable para almacenar todos los productos cargados
let productosOriginales = [];

function renderProductos(productos) {
    tabla.innerHTML = '';
    productos.forEach(prod => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${prod.id}</td>
          <td>${prod.nombre}</td>
          <td>$${prod.precio.toLocaleString()}</td>
          <td class="actions">
            <button onclick="editarProducto('${prod.id}', '${prod.nombre}', ${prod.precio})">Editar</button>
            <button onclick="borrarProducto('${prod.id}')">Eliminar</button>
          </td>
        `;
        tabla.appendChild(tr);
    });
}

// Carga los productos desde la API y los muestra en la tabla
function cargarProductos() {
    fetch(`${API_BASE_URL}/productos`)
        .then(r => r.json())
        .then(productos => {
            productosOriginales = productos;
            renderProductos(productos);
        })
        .catch(() => Swal.fire({
            icon: 'error',
            title: 'Error al cargar productos',
            showConfirmButton: false,
            timer: 2000
        }));
}

cargarProductos();

// Búsqueda de productos por nombre
const inputBusqueda = document.getElementById('input-busqueda');
inputBusqueda.addEventListener('input', function() {
    const texto = this.value.trim().toLowerCase();
    const filtrados = productosOriginales.filter(p => p.nombre.toLowerCase().includes(texto));
    renderProductos(filtrados);
});

// Botón para agregar producto
btnAgregar.onclick = () => {
    Swal.fire({
        title: 'Agregar producto',
        html:
            '<input id="swal-nombre" class="swal2-input" placeholder="Nombre del producto">' +
            '<input id="swal-precio" type="number" min="0" class="swal2-input" placeholder="Precio">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const nombreInput = document.getElementById('swal-nombre');
            const precioInput = document.getElementById('swal-precio');
            // Permitir submit con Enter en cualquier input
            [nombreInput, precioInput].forEach(input => {
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        Swal.clickConfirm();
                    }
                });
            });
        },
        preConfirm: () => {
            const nombre = document.getElementById('swal-nombre').value.trim();
            const precio = document.getElementById('swal-precio').value;
            if (!nombre || nombre.replace(/\s/g, '').length === 0 || !precio || isNaN(precio) || Number(precio) <= 0) {
                Swal.showValidationMessage('Completa todos los campos correctamente. El nombre no puede estar vacío y el precio debe ser mayor a 0.');
                return false;
            }
            return { nombre, precio: Number(precio) };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const { nombre, precio } = result.value;
            // Validar que no exista un producto con el mismo nombre (ignorando mayúsculas y espacios)
            fetch(`${API_BASE_URL}/productos`)
                .then(r => r.json())
                .then(productos => {
                    const existe = productos.some(p => p.nombre.trim().toLowerCase() === nombre.trim().toLowerCase());
                    if (existe) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ya existe un producto con ese nombre',
                            showConfirmButton: false,
                            timer: 2000
                        });
                        return;
                    }
                    // Si no existe, agregar
                    fetch(`${API_BASE_URL}/productos`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nombre, precio })
                    })
                        .then(r => r.json())
                        .then(() => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Producto creado',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            cargarProductos();
                        })
                        .catch(() => Swal.fire({
                            icon: 'error',
                            title: 'Error al crear producto',
                            showConfirmButton: false,
                            timer: 2000
                        }));
                })
                .catch(() => Swal.fire({
                    icon: 'error',
                    title: 'Error al validar producto',
                    showConfirmButton: false,
                    timer: 2000
                }));
        }
    });
};

// Editar producto con modal
window.editarProducto = (id, nombre, precio) => {
    Swal.fire({
        title: 'Editar producto',
        html:
            `<input id="swal-nombre" class="swal2-input" placeholder="Nombre del producto" value="${nombre}">` +
            `<input id="swal-precio" type="number" min="0" class="swal2-input" placeholder="Precio" value="${precio}">`,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        didOpen: () => {
            const nombreInput = document.getElementById('swal-nombre');
            const precioInput = document.getElementById('swal-precio');
            [nombreInput, precioInput].forEach(input => {
                input.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        Swal.clickConfirm();
                    }
                });
            });
        },
        preConfirm: () => {
            const nuevoNombre = document.getElementById('swal-nombre').value.trim();
            const nuevoPrecio = document.getElementById('swal-precio').value;
            if (!nuevoNombre || !nuevoPrecio || isNaN(nuevoPrecio) || Number(nuevoPrecio) < 0) {
                Swal.showValidationMessage('Completa todos los campos correctamente');
                return false;
            }
            return { nombre: nuevoNombre, precio: Number(nuevoPrecio) };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            const { nombre: nuevoNombre, precio: nuevoPrecio } = result.value;
            fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: nuevoNombre, precio: nuevoPrecio })
            })
                .then(r => r.json())
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto actualizado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    cargarProductos();
                })
                .catch(() => Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar',
                    showConfirmButton: false,
                    timer: 2000
                }));
        }
    });
};

window.borrarProducto = id => {
    Swal.fire({
        title: '¿Seguro que deseas eliminar este producto?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${API_BASE_URL}/productos/${id}`, {method: 'DELETE'})
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto eliminado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    cargarProductos();
                })
                .catch(() => Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar',
                    showConfirmButton: false,
                    timer: 2000
                }));
        }
    });
};

// Estado de ordenamiento
let ordenActual = { campo: null, asc: true };

// Función para ordenar productos y renderizar
function ordenarYRenderizar(campo) {
    // Determinar si se invierte el orden
    if (ordenActual.campo === campo) {
        ordenActual.asc = !ordenActual.asc;
    } else {
        ordenActual.campo = campo;
        ordenActual.asc = true;
    }
    // Usar productos filtrados si hay búsqueda activa
    const texto = inputBusqueda.value.trim().toLowerCase();
    let lista = productosOriginales;
    if (texto) {
        lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));
    }
    // Ordenar
    lista = [...lista].sort((a, b) => {
        if (campo === 'nombre') {
            return ordenActual.asc
                ? a.nombre.localeCompare(b.nombre)
                : b.nombre.localeCompare(a.nombre);
        } else if (campo === 'precio') {
            return ordenActual.asc
                ? a.precio - b.precio
                : b.precio - a.precio;
        }
        return 0;
    });
    renderProductos(lista);
}

// Listeners para los encabezados (click y teclado)
const thNombre = document.getElementById('th-nombre');
const thPrecio = document.getElementById('th-precio');
thNombre.addEventListener('click', () => ordenarYRenderizar('nombre'));
thPrecio.addEventListener('click', () => ordenarYRenderizar('precio'));
// Accesibilidad: ordenar con Enter/Espacio
tdSortKeyHandler = (campo) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ordenarYRenderizar(campo);
    }
};
thNombre.addEventListener('keydown', tdSortKeyHandler('nombre'));
thPrecio.addEventListener('keydown', tdSortKeyHandler('precio'));

// Exportar productos a CSV
const btnExportar = document.getElementById('btn-exportar');
btnExportar.addEventListener('click', () => {
    // Usar productos filtrados y ordenados según la vista actual
    const texto = inputBusqueda.value.trim().toLowerCase();
    let lista = productosOriginales;
    if (texto) {
        lista = lista.filter(p => p.nombre.toLowerCase().includes(texto));
    }
    if (ordenActual.campo) {
        lista = [...lista].sort((a, b) => {
            if (ordenActual.campo === 'nombre') {
                return ordenActual.asc
                    ? a.nombre.localeCompare(b.nombre)
                    : b.nombre.localeCompare(a.nombre);
            } else if (ordenActual.campo === 'precio') {
                return ordenActual.asc
                    ? a.precio - b.precio
                    : b.precio - a.precio;
            }
            return 0;
        });
    }
    // Generar CSV
    let csv = 'ID,Nombre,Precio\n';
    lista.forEach(p => {
        csv += `${p.id},"${p.nombre.replace(/"/g, '""')}",${p.precio}\n`;
    });
    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Aseguro que los botones de acción sean accesibles por teclado
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.actions button').forEach(btn => {
            btn.setAttribute('tabindex', '0');
        });
    }, 500);
});
