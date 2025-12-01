// variables generales 
let palabrasActuales = [];
let tamañoCuadricula = 15;
let tablero = [];
let posicionesPalabras = [];
let celdasSeleccionadas = [];
let palabrasEncontradas = [];
let contadorPalabrasEncontradas = 0;
let racha = 0;
let coloresMultiplesActivados = true;
let indiceColor = 0;
let estaSeleccionando = false;
let direccionSeleccion = null;

// variables de tiempo
let tiempoInicio = null;
let intervaloTiempo = null;
let tiempoTranscurrido = 0;
let enPausa = false;

function iniciarTemporizador() {
    tiempoInicio = Date.now() - tiempoTranscurrido;
    intervaloTiempo = setInterval(actualizarTemporizador, 100);
    enPausa = false;
}


function actualizarTemporizador() {
    if (!enPausa) {
        tiempoTranscurrido = Date.now() - tiempoInicio;
        const minutos = Math.floor(tiempoTranscurrido / 60000);
        const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);
        const cadenaTiempo = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
        document.getElementById('tiempoJuego').textContent = cadenaTiempo;
    }
}

function pausarTemporizador() {
    enPausa = true;
}


function reanudarTemporizador() {
    enPausa = false;
    tiempoInicio = Date.now() - tiempoTranscurrido;
}


function detenerTemporizador() {
    if (intervaloTiempo) {
        clearInterval(intervaloTiempo);
        intervaloTiempo = null;
    }
    enPausa = false;
}


// Menu de pausa
function alternarMenuPausa() {
    const menuPausa = document.getElementById('menuPausa');
    const capaOscura = document.getElementById('capaOscura');
    const activo = menuPausa.classList.contains('activo');
    if (activo) {
        cerrarMenuPausa();
    } else {
        abrirMenuPausa();
    }
}


function abrirMenuPausa() {
    pausarTemporizador();
    const menuPausa = document.getElementById('menuPausa');
    const capaOscura = document.getElementById('capaOscura');
    
    // Actualizar info en el menú de pausa
    const minutos = Math.floor(tiempoTranscurrido / 60000);
    const segundos = Math.floor((tiempoTranscurrido % 60000) / 1000);
    document.getElementById('tiempoPausa').textContent = 
        `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    document.getElementById('progresoPausa').textContent = 
        `${contadorPalabrasEncontradas}/${palabrasActuales.length}`;
    
    capaOscura.classList.add('activa');
    menuPausa.classList.add('activo');
}


function cerrarMenuPausa() {
    const menuPausa = document.getElementById('menuPausa');
    const capaOscura = document.getElementById('capaOscura');
    
    capaOscura.classList.remove('activa');
    menuPausa.classList.remove('activo');
    
    reanudarTemporizador();
}


function reanudarJuego() {
    cerrarMenuPausa();
}


// confirmacion 
function confirmarReinicio() {
    mostrarModalConfirmacion(
        '¿REINICIAR JUEGO?',
        'Se perderá el progreso actual',
        () => {
            cerrarModal();
            cerrarMenuPausa();
            reiniciarJuego();
        }
    );
}


function confirmarSalida() {
    mostrarModalConfirmacion(
        '¿SALIR AL MENÚ?',
        'Se perderá el progreso actual',
        () => {
            window.location.href = 'inicio.html';
        }
    );
}


function mostrarModalConfirmacion(titulo, mensaje, alConfirmar) {
    const modal = document.getElementById('modalConfirmacion');
    document.getElementById('tituloModal').textContent = titulo;
    document.getElementById('mensajeModal').textContent = mensaje;
    const botonConfirmar = document.getElementById('modalConfirmar');
    const nuevoBotonConfirmar = botonConfirmar.cloneNode(true);
    botonConfirmar.parentNode.replaceChild(nuevoBotonConfirmar, botonConfirmar);
    nuevoBotonConfirmar.addEventListener('click', alConfirmar);
    modal.classList.add('activo');
}


function cerrarModal() {
    const modal = document.getElementById('modalConfirmacion');
    modal.classList.remove('activo');
}




// palabras para los temas 
const temasNormalizados = {
    "ANIMALES": "animales",
    "COMIDA": "comida",
    "DEPORTES": "deportes",
    "PAÍSES": "paises",
    "CIENCIA": "ciencia",
    "COLORES": "colores",
    "PERSONALIZADA": "personalizada"
};

const palabrasPorTema = {
    personalizada: [], // Se cargará dinámicamente
    animales: ["PERRO", "GATO", "LEON", "TIGRE", "OSO", "LOBO", "AGUILA"],
    comida: ["PIZZA", "PASTA", "ARROZ", "TACOS", "SOPA", "POLLO", "QUESO"],
    deportes: ["FUTBOL", "TENIS", "BOXEO", "NATACION", "VOLEY", "GOLF", "CICLISMO"],
    paises: ["PERU", "ARGENTINA", "CHILE", "MEXICO", "URUGUAY", "BRASIL", "COLOMBIA"],
    ciencia: ["ATOMO", "CELULA", "DNA", "QUIMICA", "FISICA", "ENERGIA", "LASER"],
    colores: ["ROJO", "AZUL", "VERDE", "AMARILLO", "NEGRO", "BLANCO", "MORADO"]
};

// generar tablero
function generarLetraAleatoria() {
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letras[Math.floor(Math.random() * letras.length)];
}


function crearTableroVacio() {
    tablero = [];
    for (let i = 0; i < tamañoCuadricula; i++) {
        tablero[i] = [];
        for (let j = 0; j < tamañoCuadricula; j++) {
            tablero[i][j] = '';
        }
    }
}


function puedeColocarPalabra(palabra, fila, col, direccion) {
    const longitud = palabra.length;
    
    // Direcciones: 0=horizontal, 1=vertical, 2=diagonal, 3=diagonal-inversa
    const deltas = [
        {df: 0, dc: 1},   // horizontal
        {df: 1, dc: 0},   // vertical
        {df: 1, dc: 1},   // diagonal
        {df: 1, dc: -1}   // diagonal inversa
    ];
    
    const delta = deltas[direccion];
    
    const filaFinal = fila + delta.df * (longitud - 1);
    const colFinal = col + delta.dc * (longitud - 1);
    
    if (filaFinal < 0 || filaFinal >= tamañoCuadricula || 
        colFinal < 0 || colFinal >= tamañoCuadricula) {
        return false;
    }
    
    for (let i = 0; i < longitud; i++) {
        const f = fila + delta.df * i;
        const c = col + delta.dc * i;
        
        if (tablero[f][c] !== '' && tablero[f][c] !== palabra[i]) {
            return false;
        }
    }
    
    return true;
}


function colocarPalabra(palabra, fila, col, direccion) {
    const deltas = [
        {df: 0, dc: 1},
        {df: 1, dc: 0},
        {df: 1, dc: 1},
        {df: 1, dc: -1}
    ];
    
    const delta = deltas[direccion];
    const posiciones = [];
    
    for (let i = 0; i < palabra.length; i++) {
        const f = fila + delta.df * i;
        const c = col + delta.dc * i;
        tablero[f][c] = palabra[i];
        posiciones.push({fila: f, col: c});
    }
    
    posicionesPalabras.push({
        palabra: palabra,
        posiciones: posiciones
    });
}

function insertarPalabrasEnTablero(palabras) {
    posicionesPalabras = [];
    
    palabras.forEach(palabra => {
        let colocada = false;
        let intentos = 0;
        
        while (!colocada && intentos < 100) {
            const direccion = Math.floor(Math.random() * 4);
            const fila = Math.floor(Math.random() * tamañoCuadricula);
            const col = Math.floor(Math.random() * tamañoCuadricula);
            
            if (puedeColocarPalabra(palabra, fila, col, direccion)) {
                colocarPalabra(palabra, fila, col, direccion);
                colocada = true;
            }
            intentos++;
        }
        
        if (!colocada) {
            console.warn(`No se pudo colocar la palabra: ${palabra}`);
        }
    });
}

function rellenarEspaciosVacios() {
    for (let i = 0; i < tamañoCuadricula; i++) {
        for (let j = 0; j < tamañoCuadricula; j++) {
            if (tablero[i][j] === '') {
                tablero[i][j] = generarLetraAleatoria();
            }
        }
    }
}

function generarTablero(palabras) {
    crearTableroVacio();
    insertarPalabrasEnTablero(palabras);
    rellenarEspaciosVacios();
    renderizarTablero();
}

// renderisar tablero
function renderizarTablero() {
    const contenedor = document.getElementById('rejillaJuego');
    contenedor.innerHTML = '';
    contenedor.style.gridTemplateColumns = `repeat(${tamañoCuadricula}, 1fr)`;
    
    tablero.forEach((fila, indiceFila) => {
        fila.forEach((letra, indiceCol) => {
            const celda = document.createElement('div');
            celda.classList.add('celda-letra-juego');
            celda.textContent = letra;
            celda.dataset.fila = indiceFila;
            celda.dataset.col = indiceCol;
            contenedor.appendChild(celda);
        });
    });
    
    configurarEventosSeleccion();
}

function mostrarListaPalabras(palabras) {
    const lista = document.getElementById('listaPalabrasJuego');
    lista.innerHTML = '';
    
    palabras.forEach(palabra => {
        const item = document.createElement('li');
        item.classList.add('item-palabra-juego');
        item.textContent = palabra;
        item.dataset.palabra = palabra;
        lista.appendChild(item);
    });
    
    document.getElementById('palabrasEncontradas').textContent = `0/${palabras.length}`;
}

// selecionar palabras
function configurarEventosSeleccion() {
    const contenedor = document.getElementById('rejillaJuego');

    contenedor.addEventListener('mousedown', iniciarSeleccion);
    contenedor.addEventListener('mouseover', continuarSeleccion);
    contenedor.addEventListener('mouseup', finalizarSeleccion);
    contenedor.addEventListener('mouseleave', finalizarSeleccion);

    contenedor.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const toque = e.touches[0];
        const elemento = document.elementFromPoint(toque.clientX, toque.clientY);
        if (elemento && elemento.classList.contains('celda-letra-juego')) {
            iniciarSeleccion({ target: elemento });
        }
    });
    
    contenedor.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const toque = e.touches[0];
        const elemento = document.elementFromPoint(toque.clientX, toque.clientY);
        if (elemento && elemento.classList.contains('celda-letra-juego')) {
            continuarSeleccion({ target: elemento });
        }
    });
    
    contenedor.addEventListener('touchend', (e) => {
        e.preventDefault();
        finalizarSeleccion();
    });
}

function iniciarSeleccion(e) {
    if (!e.target.classList.contains('celda-letra-juego')) return;
    
    // No seleccionar celdas ya encontradas
    const clases = e.target.className;
    if (clases.includes('encontrada-')) return;
    
    estaSeleccionando = true;
    celdasSeleccionadas = [];
    direccionSeleccion = null;
    
    agregarCeldaASeleccion(e.target);
}

function continuarSeleccion(e) {
    if (!estaSeleccionando || !e.target.classList.contains('celda-letra-juego')) return;
    
    agregarCeldaASeleccion(e.target);
}

function agregarCeldaASeleccion(celda) {
    const fila = parseInt(celda.dataset.fila);
    const col = parseInt(celda.dataset.col);
    
    // Verificar si ya está seleccionada
    const yaSeleccionada = celdasSeleccionadas.some(c => 
        c.fila === fila && c.col === col
    );
    if (yaSeleccionada) return;
    
    // Si hay celdas seleccionadas
    if (celdasSeleccionadas.length > 0) {
        const ultima = celdasSeleccionadas[celdasSeleccionadas.length - 1];
        
        const deltaFila = fila - ultima.fila;
        const deltaCol = col - ultima.col;
        
        // Verificar (máximo 1 de distancia)
        if (Math.abs(deltaFila) > 1 || Math.abs(deltaCol) > 1) return;
        if (deltaFila === 0 && deltaCol === 0) return;
        
        // Establecer  dirección
        if (celdasSeleccionadas.length === 1) {
            direccionSeleccion = { df: deltaFila, dc: deltaCol };
        } else {
            if (deltaFila !== direccionSeleccion.df || deltaCol !== direccionSeleccion.dc) {
                return; // No seguir si cambia de dirección
            }
        }
    }
    
    celdasSeleccionadas.push({
        fila: fila,
        col: col,
        letra: celda.textContent,
        elemento: celda
    });
    
    celda.classList.add('seleccionada');
}

function finalizarSeleccion() {
    if (!estaSeleccionando) return;
    
    estaSeleccionando = false;
    
    if (celdasSeleccionadas.length > 0) {
        const palabraSeleccionada = celdasSeleccionadas.map(c => c.letra).join('');
        verificarPalabra(palabraSeleccionada);
    }
    
    limpiarSeleccion();
}

function limpiarSeleccion() {
    celdasSeleccionadas.forEach(c => {
        if (c.elemento) {
            c.elemento.classList.remove('seleccionada');
        }
    });
    celdasSeleccionadas = [];
    direccionSeleccion = null;
}

// verificar palabras 
function verificarPalabra(palabraSeleccionada) {
    //normal y al revés
    const palabraNormal = palabraSeleccionada;
    const palabraReversa = palabraSeleccionada.split('').reverse().join('');
    
    let palabraEncontrada = null;
    
    if (palabrasActuales.includes(palabraNormal) && 
        !palabrasEncontradas.includes(palabraNormal)) {
        palabraEncontrada = palabraNormal;
    } else if (palabrasActuales.includes(palabraReversa) && 
               !palabrasEncontradas.includes(palabraReversa)) {
        palabraEncontrada = palabraReversa;
    }
    
    if (palabraEncontrada) {
        marcarPalabraEncontrada(palabraEncontrada);
        palabrasEncontradas.push(palabraEncontrada);
        contadorPalabrasEncontradas++;
        racha++;
        
        // Actualizar 
        document.getElementById('palabrasEncontradas').textContent = 
            `${contadorPalabrasEncontradas}/${palabrasActuales.length}`;
        document.getElementById('valorRacha').textContent = racha;
        
        // Marcar en lista
        const items = document.querySelectorAll('#listaPalabrasJuego li');
        items.forEach(item => {
            if (item.dataset.palabra === palabraEncontrada) {
                item.classList.add(`encontrada-${indiceColor}`);
            }
        });
        
        indiceColor = (indiceColor + 1) % 7;
        
        // Verificar victoria
        if (contadorPalabrasEncontradas === palabrasActuales.length) {
            setTimeout(() => {
                detenerTemporizador();
                const tiempoFinalSegundos = Math.floor(tiempoTranscurrido / 1000);
                
                // Obtener tema actual
                const params = new URLSearchParams(window.location.search);
                const temaParam = params.get("theme");
                
                // Solo guardar record si NO es personalizada y RecordsManager está disponible
                if (temaParam && temaParam !== 'PERSONALIZADA' && window.RecordsManager) {
                    // Guardar el record
                    const record = window.RecordsManager.guardarRecord(
                        temaParam,
                        tiempoFinalSegundos,
                        contadorPalabrasEncontradas,
                        palabrasActuales.length
                    );
                    
                    // Verificar si es un nuevo record
                    const esNuevoRecord = window.RecordsManager.esNuevoRecord(
                        temaParam, 
                        tiempoFinalSegundos, 
                        true
                    );
                    
                    // Mostrar modal de victoria
                    mostrarModalVictoria(record, esNuevoRecord);
                } else {
                    // Para sopas personalizadas, solo mostrar mensaje simple
                    mostrarMensaje(`¡FELICIDADES!\n\nCompletaste el puzzle\nTiempo: ${document.getElementById('tiempoJuego').textContent}`);
                }
            }, 500);
        }
    } else {
        // Palabra incorrecta, resetear racha
        racha = 0;
        document.getElementById('valorRacha').textContent = racha;
    }
}

function marcarPalabraEncontrada(palabra) {
    celdasSeleccionadas.forEach(celda => {
        if (celda.elemento) {
            celda.elemento.classList.add(`encontrada-${indiceColor}`);
            celda.elemento.classList.remove('seleccionada');
        }
    });
}


// pistas
function mostrarPista() {
    const palabrasFaltantes = palabrasActuales.filter(p => 
        !palabrasEncontradas.includes(p)
    );
    
    if (palabrasFaltantes.length === 0) {
        mostrarMensaje('¡Ya encontraste\ntodas las palabras!');
        return;
    }
    
    const palabraPista = palabrasFaltantes[0];
    
    // Encontrar posiciones de la palabra
    const datosPalabra = posicionesPalabras.find(p => p.palabra === palabraPista);
    
    if (datosPalabra && datosPalabra.posiciones.length > 0) {
        // Resaltar primera letra
        const primeraPos = datosPalabra.posiciones[0];
        const celda = document.querySelector(
            `[data-fila="${primeraPos.fila}"][data-col="${primeraPos.col}"]`
        );
        
        if (celda) {
            celda.classList.add('seleccionada');
            setTimeout(() => {
                celda.classList.remove('seleccionada');
            }, 2000);
        }
    }
    
}

// mensajes temporales 
function mostrarMensaje(texto) {
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
        max-width: 80%;
    `;
    mensaje.textContent = texto;
    document.body.appendChild(mensaje);
    
    setTimeout(() => mensaje.style.transform = 'translate(-50%, -50%) scale(1)', 10);
    setTimeout(() => {
        mensaje.style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => mensaje.remove(), 300);
    }, 3500);
}

// reiniciar 
function reiniciarJuego() {
    // Limpiar 
    palabrasEncontradas = [];
    contadorPalabrasEncontradas = 0;
    racha = 0;
    indiceColor = 0;
    celdasSeleccionadas = [];

    // Resetear 
    document.getElementById('valorRacha').textContent = '0';
    
    // Detener y reiniciar temporizador
    detenerTemporizador();
    tiempoTranscurrido = 0;
    document.getElementById('tiempoJuego').textContent = '00:00';
    
    // regenerar tablero
    generarTablero(palabrasActuales);
    mostrarListaPalabras(palabrasActuales);
    
    // iniciar temporizador
    iniciarTemporizador();
}

// configuracion
function cargarConfiguracion() {
    const tamañoGuardado = localStorage.getItem('tamanoTablero');
    const coloresGuardados = localStorage.getItem('coloresPalabras');
    
    if (tamañoGuardado) {
        tamañoCuadricula = parseInt(tamañoGuardado);
    }
    
    if (coloresGuardados !== null) {
        coloresMultiplesActivados = coloresGuardados === 'true';
    }
    
    console.log('Configuración cargada:', {
        tamaño: tamañoCuadricula,
        coloresMultiples: coloresMultiplesActivados
    });
}



// inicio
function inicializarJuego() {
    cargarConfiguracion();
    
    const params = new URLSearchParams(window.location.search);
    let temaParam = params.get("theme");
    
    if (!temaParam) temaParam = "ANIMALES";
    
    const tema = temasNormalizados[temaParam.toUpperCase()];
    console.log("Tema cargado:", tema);
    
    // Actualizar título
    const tituloElemento = document.getElementById("tituloSuperior");

    if (tema === 'personalizada') {
        const sopaGuardada = localStorage.getItem('sopaPersonalizada');
        if (sopaGuardada) {
            try {
                const sopaData = JSON.parse(sopaGuardada);
                palabrasActuales = sopaData.palabras;
                tamañoCuadricula = sopaData.tamaño || tamañoCuadricula;
                
                // Actualizar título
                if (tituloElemento) {
                    tituloElemento.textContent = sopaData.nombre || 'MI SOPA';
                }
                
                console.log('Sopa personalizada cargada:', sopaData);
            } catch (e) {
                console.error('Error al cargar sopa personalizada:', e);
                window.location.href = 'crear.html';
                return;
            }
        } else {
            // Si no hay sopa personalizada, redirigir
            alert('No hay sopa personalizada guardada');
            window.location.href = 'crear.html';
            return;
        }
    } else {
        // Tema predefinido
        palabrasActuales = palabrasPorTema[tema] || palabrasPorTema.animales;
        
        // Actualizar título
        if (tituloElemento) {
            tituloElemento.textContent = temaParam.toUpperCase();
        }
    }
    
    console.log("Palabras cargadas:", palabrasActuales);
    console.log("Tamaño de cuadrícula:", tamañoCuadricula);
    
    // Generar y mostrar tablero
    generarTablero(palabrasActuales);
    mostrarListaPalabras(palabrasActuales);
    
    // Iniciar temporizador
    iniciarTemporizador();
}

// mandarte al inicio
document.addEventListener('DOMContentLoaded', inicializarJuego);

// Modal de victoria mejorado
function mostrarModalVictoria(record, esNuevoRecord) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 3000;
        animation: fadeIn 0.3s ease;
    `;
    
    const tiempo = window.RecordsManager.formatearTiempo(record.tiempo);
    const recordBadge = esNuevoRecord ? '🏆 ¡NUEVO RÉCORD! 🏆' : '✓ ¡JUEGO COMPLETADO!';
    const recordColor = esNuevoRecord ? '#FFD700' : '#4ade80';
    
    overlay.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
            border: 3px solid #667eea;
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 0 50px rgba(102, 126, 234, 0.8);
            max-width: 500px;
        ">
            <h2 style="
                font-family: 'Press Start 2P', cursive;
                font-size: 16px;
                color: ${recordColor};
                margin-bottom: 20px;
                text-shadow: 0 0 20px ${recordColor}80;
                line-height: 1.6;
            ">${recordBadge}</h2>
            
            <div style="margin: 30px 0;">
                <div style="
                    font-family: 'Press Start 2P', cursive;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    margin-bottom: 10px;
                ">⏱️ TIEMPO FINAL</div>
                <div style="
                    font-family: 'Press Start 2P', cursive;
                    font-size: 32px;
                    color: #667eea;
                    text-shadow: 0 0 20px rgba(102, 126, 234, 0.8);
                ">${tiempo}</div>
            </div>
            
            <div style="
                display: flex;
                justify-content: space-around;
                margin: 30px 0;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            ">
                <div>
                    <div style="
                        font-family: 'Press Start 2P', cursive;
                        font-size: 9px;
                        color: rgba(255, 255, 255, 0.6);
                        margin-bottom: 8px;
                    ">PALABRAS</div>
                    <div style="
                        font-family: 'Press Start 2P', cursive;
                        font-size: 16px;
                        color: #4ade80;
                    ">${record.palabrasEncontradas}/${record.totalPalabras}</div>
                </div>
                <div>
                    <div style="
                        font-family: 'Press Start 2P', cursive;
                        font-size: 9px;
                        color: rgba(255, 255, 255, 0.6);
                        margin-bottom: 8px;
                    ">TEMA</div>
                    <div style="
                        font-family: 'Press Start 2P', cursive;
                        font-size: 16px;
                        color: white;
                    ">${record.tema}</div>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 30px;">
                <button onclick="window.location.href='records.html'" style="
                    font-family: 'Press Start 2P', cursive;
                    font-size: 11px;
                    padding: 15px 25px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: 2px solid #667eea;
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                ">📊 VER RECORDS</button>
                
                <button onclick="location.reload()" style="
                    font-family: 'Press Start 2P', cursive;
                    font-size: 11px;
                    padding: 15px 25px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                ">↻ JUGAR DE NUEVO</button>
                
                <button onclick="window.location.href='temas.html'" style="
                    font-family: 'Press Start 2P', cursive;
                    font-size: 11px;
                    padding: 15px 25px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                ">🔄 CAMBIAR TEMA</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
}