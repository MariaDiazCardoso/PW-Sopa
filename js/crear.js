// Variables
let tamañoSeleccionado = 15;
let palabrasAgregadas = [];
const MIN_PALABRAS = 5;
const MAX_PALABRAS = 10;

// Configurar tamaño
function configurarSelectorTamaño() {  
    const opciones = document.querySelectorAll('.opcion-tamano');
    
    opciones.forEach(opcion => {
        opcion.addEventListener('click', function() {
            opciones.forEach(o => o.classList.remove('activa'));
            this.classList.add('activa');
            
            const texto = this.textContent.trim();
            tamañoSeleccionado = parseInt(texto.split('x')[0]);
            
            console.log('Tamaño seleccionado:', tamañoSeleccionado);
        });
    });
}

// Agregar palabra
function configurarEntradaPalabra() {
    const input = document.getElementById('entradaPalabra');
    const botonAgregar = document.querySelector('.boton-agregar-palabra');
    
    if (!input || !botonAgregar) {
        console.error('Elementos de entrada no encontrados');
        return;
    }
    
    botonAgregar.addEventListener('click', agregarPalabra);
    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            agregarPalabra();
        }
    });
}

function agregarPalabra() {
    const input = document.getElementById('entradaPalabra');
    const palabra = input.value.trim().toUpperCase();
    
    // Validaciones
    if (palabra === '') {
        mostrarMensajeError('ESCRIBE UNA\nPALABRA');
        return;
    }
    
    if (palabra.length < 3) {
        mostrarMensajeError('MINIMO 3\nLETRAS');
        return;
    }
    
    if (palabra.length > tamañoSeleccionado) {
        mostrarMensajeError(`MAXIMO ${tamañoSeleccionado}\nLETRAS`);
        return;
    }
    
    // Verificar solo letras
    if (!/^[A-ZÁÉÍÓÚÑ]+$/.test(palabra)) {
        mostrarMensajeError('SOLO LETRAS\nPOR FAVOR');
        return;
    }
    
    // Verificar si ya existe
    if (palabrasAgregadas.includes(palabra)) {
        mostrarMensajeError('YA AGREGASTE\nESA PALABRA');
        return;
    }
    
    // Verificar máximo
    if (palabrasAgregadas.length >= MAX_PALABRAS) {
        mostrarMensajeError(`MAXIMO ${MAX_PALABRAS}\nPALABRAS`);
        return;
    }
    
    // Agregar palabra
    palabrasAgregadas.push(palabra);
    actualizarListaPalabras();
    
    // Limpiar
    input.value = '';
    input.focus();
    
    console.log('Palabra agregada:', palabra);
}

function actualizarListaPalabras() {
    const contenedor = document.getElementById('listaPalabras');
    const contador = document.getElementById('contadorPalabras');
    
    if (!contenedor || !contador) return;
    
    // Actualizar contador
    contador.textContent = palabrasAgregadas.length;
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    // Agregar palabras
    palabrasAgregadas.forEach((palabra, indice) => {
        const etiqueta = document.createElement('div');
        etiqueta.classList.add('etiqueta-palabra');
        etiqueta.textContent = palabra;
        etiqueta.title = 'Click para eliminar';
        
        // Evento para eliminar
        etiqueta.addEventListener('click', () => {
            eliminarPalabra(indice);
        });
        
        contenedor.appendChild(etiqueta);
    });
}

function eliminarPalabra(indice) {
    palabrasAgregadas.splice(indice, 1);
    actualizarListaPalabras();
    console.log('Palabra eliminada. Quedan:', palabrasAgregadas);
}

// Generar sopa
function configurarBotones() {
    const botonGenerar = document.querySelector('.boton-generar');
    const botonLimpiar = document.querySelector('.boton-limpiar-crear');
    
    if (botonGenerar) {
        botonGenerar.addEventListener('click', generarSopa);
    }
    
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', limpiarTodo);
    }
}

function generarSopa() {
    // Validar mínimo de palabras
    if (palabrasAgregadas.length < MIN_PALABRAS) {
        mostrarMensajeError(`AGREGA AL MENOS\n${MIN_PALABRAS} PALABRAS`);
        return;
    }
    
    // Nombre del puzzle
    const inputNombre = document.getElementById('nombrePuzzle');
    const nombrePuzzle = inputNombre ? inputNombre.value.trim() : '';
    
    // Guardar puzzle (solo en sesión, se pierde al cerrar)
    const sopaPersonalizada = {
        nombre: nombrePuzzle || 'MI SOPA',
        tamano: tamañoSeleccionado,
        palabras: palabrasAgregadas,
        fecha: new Date().toISOString()
    };
    
    // Solo guardado temporal en sesión
    console.log('Sopa creada:', sopaPersonalizada);
    
    mostrarMensajeExito('SOPA CREADA\n\nIniciando juego...');
    
    setTimeout(() => {
        // Aquí iría la redirección al juego con la sopa personalizada
        alert('Funcionalidad de juego personalizado proximamente');
    }, 2500);
}

function limpiarTodo() {
    if (palabrasAgregadas.length === 0) {
        mostrarMensajeError('NO HAY NADA\nQUE LIMPIAR');
        return;
    }
    
    // Crear mensaje de confirmación
    const modal = document.createElement('div');
    modal.classList.add('modal', 'activo');
    modal.innerHTML = `
        <div class="contenido-modal">
            <h3>LIMPIAR TODO?</h3>
            <p>Se borraran todas las palabras agregadas</p>
            <div class="botones-modal">
                <button class="boton-modal boton-confirmar" id="confirmarLimpiar">SI</button>
                <button class="boton-modal boton-cancelar" id="cancelarLimpiar">NO</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    document.getElementById('confirmarLimpiar').addEventListener('click', () => {
        palabrasAgregadas = [];
        actualizarListaPalabras();
        document.getElementById('entradaPalabra').value = '';
        document.getElementById('nombrePuzzle').value = '';
        modal.remove();
        mostrarMensajeExito('TODO LIMPIO');
    });
    
    document.getElementById('cancelarLimpiar').addEventListener('click', () => {
        modal.remove();
    });
}

// Mensajes
function mostrarMensajeExito(texto) {
    const mensaje = document.createElement('div');
    mensaje.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(145deg, #00ff00, #00cc00);
        color: #000;
        padding: 30px 50px;
        border-radius: 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.9em;
        z-index: 2000;
        box-shadow: 0 0 50px rgba(0, 255, 0, 0.8);
        border: 4px solid #ffff00;
        transition: transform 0.3s ease;
        text-align: center;
        line-height: 1.8;
        white-space: pre-line;
    `;
    mensaje.textContent = texto;
    document.body.appendChild(mensaje);
    
    setTimeout(() => mensaje.style.transform = 'translate(-50%, -50%) scale(1)', 10);
    setTimeout(() => {
        mensaje.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => mensaje.remove(), 300);
    }, 2000);
}

function mostrarMensajeError(texto) {
    const mensaje = document.createElement('div');
    mensaje.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        background: linear-gradient(145deg, #ff0000, #cc0000);
        color: #fff;
        padding: 30px 50px;
        border-radius: 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 0.9em;
        z-index: 2000;
        box-shadow: 0 0 50px rgba(255, 0, 0, 0.8);
        border: 4px solid #ffff00;
        transition: transform 0.3s ease;
        text-align: center;
        line-height: 1.8;
        white-space: pre-line;
    `;
    mensaje.textContent = texto;
    document.body.appendChild(mensaje);
    
    setTimeout(() => mensaje.style.transform = 'translate(-50%, -50%) scale(1)', 10);
    setTimeout(() => {
        mensaje.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => mensaje.remove(), 300);
    }, 1500);
}

// Iniciar
function inicializarCrear() {
    configurarSelectorTamaño();
    configurarEntradaPalabra();
    configurarBotones();
    actualizarListaPalabras();
}

document.addEventListener('DOMContentLoaded', inicializarCrear);