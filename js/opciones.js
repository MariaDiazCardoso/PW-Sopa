// Variables
let tamañoSeleccionado = 15;
let coloresPalabrasActivado = true;

// Cargar configuración (solo de sesión)
function cargarConfiguracion() {
    // No se usa localStorage, valores por defecto
    tamañoSeleccionado = 15;
    coloresPalabrasActivado = true;
    
    aplicarConfiguracionInicial();
}

function aplicarConfiguracionInicial() {
    const botonesTamaño = document.querySelectorAll('.boton-opcion');
    botonesTamaño.forEach(boton => {
        boton.classList.remove('activo');
        const texto = boton.textContent.trim();
        const tamaño = parseInt(texto.split('x')[0]);
        
        if (tamaño === tamañoSeleccionado) {
            boton.classList.add('activo');
        }
    });

    const botonAlternado = document.querySelectorAll('.boton-alternador');
    botonAlternado.forEach(boton => {
        boton.classList.remove('activo');
        const texto = boton.textContent.trim();
        
        if ((coloresPalabrasActivado && texto.includes('ACTIVADO')) ||
            (!coloresPalabrasActivado && texto.includes('DESACTIVADO'))) {
            boton.classList.add('activo');
        }
    });
}

// Configurar tamaño
function configurarTamaño() {
    const botonesTamaño = document.querySelectorAll('.boton-opcion');
    
    botonesTamaño.forEach(boton => {
        boton.addEventListener('click', function() {
            botonesTamaño.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            
            const texto = this.textContent.trim();
            tamañoSeleccionado = parseInt(texto.split('x')[0]);
            
            console.log('Tamaño seleccionado:', tamañoSeleccionado);
        });
    });
}

// Configurar colores
function configurarColores() {
    const botonAlternado = document.querySelectorAll('.boton-alternador');
    
    botonAlternado.forEach(boton => {
        boton.addEventListener('click', function() {
            botonAlternado.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            
            const texto = this.textContent.trim();
            coloresPalabrasActivado = texto.includes('ACTIVADO');
            
            console.log('Colores activados:', coloresPalabrasActivado);
        });
    });
}

// Guardar configuración (solo en sesión)
function guardarConfiguracion() {
    // No se guarda en localStorage
    mostrarMensajeExito('CONFIGURACION\nGUARDADA');
    
    console.log('Configuración guardada:', {
        tamano: tamañoSeleccionado,
        colores: coloresPalabrasActivado
    });
}

function configurarBotonGuardar() {
    const botonGuardar = document.querySelector('.boton-guardar');
    
    if (botonGuardar) {
        botonGuardar.addEventListener('click', guardarConfiguracion);
    }
}

// Mensaje
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

// Iniciar
function iniciarOpciones() {
    cargarConfiguracion();
    configurarTamaño();
    configurarColores();
    configurarBotonGuardar();
}

// Cargar al iniciar la página
document.addEventListener('DOMContentLoaded', iniciarOpciones);