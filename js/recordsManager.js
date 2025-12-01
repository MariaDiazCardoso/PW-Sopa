// js/RecordsManager.js
class RecordsManager {
    constructor() {
        this.storageKey = 'sopadeletras_records';
    }

    // Guardar un nuevo record
    guardarRecord(tema, tiempo, palabrasEncontradas, totalPalabras) {
        const records = this.obtenerTodosLosRecords();
        
        const nuevoRecord = {
            tema: tema,
            tiempo: tiempo,
            palabrasEncontradas: palabrasEncontradas,
            totalPalabras: totalPalabras,
            fecha: new Date().toISOString(),
            completado: palabrasEncontradas === totalPalabras
        };

        // Si no existe el tema, crear array
        if (!records[tema]) {
            records[tema] = [];
        }

        // Agregar el nuevo record
        records[tema].push(nuevoRecord);

        // Ordenar por tiempo (menor a mayor) y limitar a top 10
        records[tema].sort((a, b) => {
            // Priorizar juegos completados
            if (a.completado && !b.completado) return -1;
            if (!a.completado && b.completado) return 1;
            // Si ambos están completados o incompletos, ordenar por tiempo
            return a.tiempo - b.tiempo;
        });

        // Mantener solo los mejores 10 records por tema
        records[tema] = records[tema].slice(0, 10);

        // Guardar en localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(records));

        return nuevoRecord;
    }

    // Obtener todos los records
    obtenerTodosLosRecords() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : {};
    }

    // Obtener records de un tema específico
    obtenerRecordsPorTema(tema) {
        const records = this.obtenerTodosLosRecords();
        return records[tema] || [];
    }

    // Obtener top N records de un tema
    obtenerTop(tema, cantidad = 10) {
        return this.obtenerRecordsPorTema(tema).slice(0, cantidad);
    }

    // Verificar si un tiempo es record para un tema
    esNuevoRecord(tema, tiempo, completado = true) {
        if (!completado) return false;
        
        const records = this.obtenerRecordsPorTema(tema);
        
        // Si no hay records, es automáticamente un record
        if (records.length === 0) return true;
        
        // Si hay menos de 10 records, es un record
        if (records.length < 10) return true;
        
        // Verificar si el tiempo es mejor que el peor record
        const peorRecord = records[records.length - 1];
        return tiempo < peorRecord.tiempo;
    }

    // Limpiar todos los records
    limpiarTodosLosRecords() {
        localStorage.removeItem(this.storageKey);
    }

    // Limpiar records de un tema específico
    limpiarRecordsPorTema(tema) {
        const records = this.obtenerTodosLosRecords();
        delete records[tema];
        localStorage.setItem(this.storageKey, JSON.stringify(records));
    }

    // Obtener estadísticas de un tema
    obtenerEstadisticas(tema) {
        const records = this.obtenerRecordsPorTema(tema);
        
        if (records.length === 0) {
            return {
                totalJuegos: 0,
                mejorTiempo: null,
                tiempoPromedio: null,
                juegosCompletados: 0
            };
        }

        const juegosCompletados = records.filter(r => r.completado);
        const tiempos = juegosCompletados.map(r => r.tiempo);
        
        return {
            totalJuegos: records.length,
            mejorTiempo: tiempos.length > 0 ? Math.min(...tiempos) : null,
            tiempoPromedio: tiempos.length > 0 ? 
                Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length) : null,
            juegosCompletados: juegosCompletados.length
        };
    }

    // Formatear tiempo en MM:SS
    formatearTiempo(segundos) {
        const minutos = Math.floor(segundos / 60);
        const segs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
    }

    // Formatear fecha
    formatearFecha(isoString) {
        const fecha = new Date(isoString);
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Crear instancia global
window.RecordsManager = new RecordsManager();