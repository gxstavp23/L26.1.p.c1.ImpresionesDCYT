import Cl_mSolicitud from "./Cl_mSolicitud.js";
export default class Cl_mImpresiones {
    _registros = [];
    _mapaHash = new Map();
    servicioStorageKey = "impresiones_services";
    tasaStorageKey = "app_tasa_bs";
    serviciosIniciales = [
        { codigo: "R01", nombre: "Fotocopia B/N Carta", precio: 0.12, disponible: true },
        { codigo: "R02", nombre: "Fotocopia Color Carta", precio: 0.55, disponible: true },
        { codigo: "R03", nombre: "Impresión B/N Carta", precio: 0.18, disponible: true },
        { codigo: "R04", nombre: "Impresión Color Carta", precio: 0.65, disponible: true },
        { codigo: "R05", nombre: "Escaneo (por página)", precio: 0.08, disponible: true },
        { codigo: "R06", nombre: "Encuadernado Espiral", precio: 3.75, disponible: true },
        { codigo: "R07", nombre: "Laminado (A4)", precio: 2.0, disponible: true },
        { codigo: "R08", nombre: "Fotocopia B/N Oficio", precio: 0.15, disponible: true },
        { codigo: "R09", nombre: "Impresión B/N Oficio", precio: 0.2, disponible: true },
        { codigo: "R10", nombre: "Ampliación/Reducción", precio: 0.25, disponible: true },
        { codigo: "R11", nombre: "Impresión Fondo Negro", precio: 1.5, disponible: true },
        { codigo: "R12", nombre: "Impresión Fotográfica (4x6)", precio: 1.0, disponible: true }
    ];
    setSolicitudes(array) {
        this._registros = [];
        this._mapaHash.clear();
        array.forEach((item) => {
            const cliente = item.cliente ?? item;
            const items = item.items ?? [];
            const copias = items.length > 0
                ? items.reduce((acc, actual) => {
                    const tipo = String(actual.tipo ?? "").trim().toLowerCase();
                    return acc + ((tipo.includes("impres") ? Number(actual.cantidad) || 0 : 0));
                }, 0)
                : Number(item.copias) || 0;
            const documento = items.length > 0
                ? items.map((it) => it.descripcion).join(" | ")
                : item.documento ?? "";
            const referencia = item.referencia ?? item.pago?.tipo ?? "";
            const estado = cliente.estado ?? item.estado ?? "Verificando pago";
            const fecha = cliente.fecha ?? item.fecha ?? "";
            const datosPago = item.datosPago ?? null;
            const modeloSolicitud = new Cl_mSolicitud({
                cedula: Number(cliente.cedula) || 0,
                nombre: cliente.nombre ?? "",
                documento,
                copias,
                referencia,
                estado,
                fecha,
                codigoOrden: cliente.codigoOrden ?? "",
                items,
                datosPago,
                pago: item.pago ?? null,
                clienteRaw: cliente,
            });
            this._registros.push({ id: item.id, modelo: modeloSolicitud });
            const llave = modeloSolicitud.codigoOrden.toLowerCase().trim();
            if (llave) {
                this._mapaHash.set(llave, this._registros[this._registros.length - 1]);
            }
        });
    }
    buscarPorHash(codigo) {
        return this._mapaHash.get(codigo.toLowerCase().trim());
    }
    calcularTotalCopias() {
        return this._registros.reduce((acc, reg) => acc + reg.modelo.copias, 0);
    }
    calcularTotalIngresos() {
        return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotal(), 0);
    }
    calcularTotalIngresosUsd() {
        return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotalUsd(), 0);
    }
    actualizarEstadoSolicitud(id, nuevoEstado) {
        const registro = this._registros.find((reg) => reg.id === id);
        if (registro) {
            registro.modelo.estado = nuevoEstado;
        }
    }
    get registros() {
        return this._registros;
    }
    getClienteRawPorId(id) {
        const registro = this._registros.find((reg) => reg.id === id);
        return registro ? registro.modelo.clienteRaw : null;
    }
    getFiltrados() {
        return this._registros.slice();
    }
    getServicios() {
        try {
            const raw = localStorage.getItem(this.servicioStorageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed.map((item) => ({
                        codigo: String(item.codigo || "").toUpperCase(),
                        nombre: String(item.nombre || ""),
                        precio: Number(item.precio) || 0,
                        disponible: typeof item.disponible === "boolean" ? item.disponible : true,
                    }));
                }
            }
        }
        catch (error) {
            console.warn("No se pudo leer servicios desde localStorage", error);
        }
        this.guardarServicios(this.serviciosIniciales.slice());
        return this.serviciosIniciales.slice();
    }
    guardarServicios(servicios) {
        localStorage.setItem(this.servicioStorageKey, JSON.stringify(servicios));
    }
    agregarServicio(codigo, nombre, precio) {
        const servicios = this.getServicios();
        servicios.push({ codigo, nombre, precio, disponible: true });
        this.guardarServicios(servicios);
    }
    setServicioDisponibilidad(codigo, disponible) {
        const servicios = this.getServicios();
        const index = servicios.findIndex((item) => item.codigo.toUpperCase() === codigo.toUpperCase());
        if (index === -1)
            return;
        servicios[index].disponible = disponible;
        this.guardarServicios(servicios);
    }
    calcularTotalVerificandoPago() {
        return this._registros.reduce((acc, reg) => {
            if (reg.modelo.estado === "Verificando pago") {
                return acc + reg.modelo.tarifaTotal();
            }
            return acc;
        }, 0);
    }
    calcularPromedioDisponible() {
        const solicitudesDisponibles = this._registros.filter((reg) => reg.modelo.estado === "Disponible");
        if (solicitudesDisponibles.length === 0)
            return 0;
        const total = solicitudesDisponibles.reduce((acc, reg) => acc + reg.modelo.tarifaTotal(), 0);
        return total / solicitudesDisponibles.length;
    }
    obtenerResumenPorServicio() {
        const resumen = new Map();
        this._registros.forEach((reg) => {
            (reg.modelo.items || []).forEach((item) => {
                const codigo = (item.detalles?.codigo || item.codigo || item.descripcion || item.tipo || "Sin código").toString();
                const nombre = item.descripcion || item.nombre || codigo;
                const cantidad = Number(item.cantidad || item.copias || 1) || 1;
                const ingreso = Number(item.subtotal || item.precio || item.precioUnitario || 0) * cantidad;
                const llave = codigo.toUpperCase();
                if (!resumen.has(llave)) {
                    resumen.set(llave, { codigo: llave, nombre, cantidad: 0, ingreso: 0 });
                }
                const registro = resumen.get(llave);
                registro.cantidad += cantidad;
                registro.ingreso += ingreso;
            });
        });
        return Array.from(resumen.values()).sort((a, b) => b.ingreso - a.ingreso);
    }
    eliminarServicio(codigo) {
        const servicios = this.getServicios();
        this.guardarServicios(servicios.filter((item) => item.codigo.toUpperCase() !== codigo.toUpperCase()));
    }
    getTasaBcv() {
        const raw = localStorage.getItem(this.tasaStorageKey);
        const valor = raw ? parseFloat(raw) : NaN;
        return Number.isFinite(valor) && valor > 0 ? valor : 30.0;
    }
    setTasaBcv(valor) {
        if (valor <= 0)
            return;
        localStorage.setItem(this.tasaStorageKey, valor.toFixed(2));
    }
    calcularPorcentajeIngresosImpresiones() {
        let acImpresiones = 0;
        const totalUsdGlobal = this.calcularTotalIngresosUsd();
        if (totalUsdGlobal === 0)
            return 0;
        this._registros.forEach((reg) => {
            reg.modelo.items?.forEach((item) => {
                if (item.tipo === "impresion") {
                    acImpresiones += item.subtotal;
                }
            });
        });
        return (acImpresiones / totalUsdGlobal) * 100;
    }
    calcularPorcentajeIngresosArticulos() {
        let acArticulos = 0;
        const totalUsdGlobal = this.calcularTotalIngresosUsd();
        if (totalUsdGlobal === 0)
            return 0;
        this._registros.forEach((reg) => {
            reg.modelo.items?.forEach((item) => {
                if (item.tipo === "articulo") {
                    acArticulos += item.subtotal;
                }
            });
        });
        return (acArticulos / totalUsdGlobal) * 100;
    }
    calcularPorcentajeIngresosdescargas() {
        let acDescargas = 0;
        const totalUsdGlobal = this.calcularTotalIngresosUsd();
        if (totalUsdGlobal === 0)
            return 0;
        this._registros.forEach((reg) => {
            reg.modelo.items?.forEach((item) => {
                if (item.tipo === "descarga") {
                    acDescargas += item.subtotal;
                }
            });
        });
        return (acDescargas / totalUsdGlobal) * 100;
    }
}
//# sourceMappingURL=Cl_mImpresiones.js.map