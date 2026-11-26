/**
 * Repositorio de persistencia para reservas de tutorías y borrador de formulario.
 * Usa localStorage en navegador y un almacén en memoria como respaldo (ej. Node.js/tests).
 * Capa: Infrastructure.
 */

const RESERVAS_KEY = 'tutoria_ux_reservas_v1';
const BORRADOR_KEY = 'tutoria_ux_borrador_v1';

export class StorageRepository {
  /**
   * @param {Storage} [storage] Objeto compatible con Web Storage (getItem, setItem, removeItem)
   */
  constructor(storage = null) {
    this.storage = storage || (typeof globalThis.localStorage !== 'undefined' ? globalThis.localStorage : crearMemoriaStorage());
  }

  /**
   * @returns {Array<object>}
   */
  listarReservas() {
    const raw = this.storage.getItem(RESERVAS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * @param {Array<object>} reservas
   */
  guardarReservas(reservas) {
    this.storage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
  }

  /**
   * Guarda el estado parcial del formulario para conservar datos al navegar o corregir errores.
   * @param {object} borrador
   */
  guardarBorrador(borrador) {
    this.storage.setItem(BORRADOR_KEY, JSON.stringify(borrador));
  }

  /**
   * @returns {object|null}
   */
  obtenerBorrador() {
    const raw = this.storage.getItem(BORRADOR_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  limpiarBorrador() {
    this.storage.removeItem(BORRADOR_KEY);
  }
}

/**
 * Crea un almacén en memoria compatible con la API de Web Storage.
 * Útil para entornos sin DOM como pruebas unitarias/funcionales en Node.
 */
export function crearMemoriaStorage() {
  const mapa = new Map();
  return {
    getItem: (k) => (mapa.has(k) ? mapa.get(k) : null),
    setItem: (k, v) => mapa.set(k, String(v)),
    removeItem: (k) => mapa.delete(k),
    clear: () => mapa.clear(),
  };
}
