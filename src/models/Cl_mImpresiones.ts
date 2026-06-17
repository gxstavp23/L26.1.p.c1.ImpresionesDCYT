
import Cl_mSolicitud from "./Cl_mSolicitud.js";

export interface ISolicitudRegistro {
  id: string;
  modelo: Cl_mSolicitud;
}

interface IServicioBase {
  codigo: string;
  nombre: string;
  precio: number;
  disponible?: boolean;
}

export default class Cl_mImpresiones {
  private _registros: ISolicitudRegistro[] = [];
  private _mapaHash: Map<string, ISolicitudRegistro> = new Map();
  private readonly servicioStorageKey = "impresiones_services";
  private readonly tasaStorageKey = "app_tasa_bs";
  private readonly serviciosIniciales: IServicioBase[] = [
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

  public setSolicitudes(array: any[]): void {
    this._registros = [];
    this._mapaHash.clear();

    array.forEach((item) => {
      const cliente = item.cliente ?? item;
      const items = item.items ?? [];
      const copias = items.length > 0
        ? items.reduce((acc: number, actual: any) => {
            const tipo = String(actual.tipo ?? "").trim().toLowerCase();
            return acc + ((tipo.includes("impres") ? Number(actual.cantidad) || 0 : 0));
          }, 0)
        : Number(item.copias) || 0;
      const documento = items.length > 0
        ? items.map((it: any) => it.descripcion).join(" | ")
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

  public buscarPorHash(codigo: string): ISolicitudRegistro | undefined {
    return this._mapaHash.get(codigo.toLowerCase().trim());
  }

  public calcularTotalCopias(): number {
    return this._registros.reduce((acc, reg) => acc + reg.modelo.copias, 0);
  }

  public calcularTotalIngresos(): number {
    return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotal(), 0);
  }

  public calcularTotalIngresosUsd(): number {
    return this._registros.reduce((acc, reg) => acc + reg.modelo.tarifaTotalUsd(), 0);
  }

  public actualizarEstadoSolicitud(id: string, nuevoEstado: string): void {
    const registro = this._registros.find((reg) => reg.id === id);
    if (registro) {
      registro.modelo.estado = nuevoEstado as any;
    }
  }

  public get registros(): ISolicitudRegistro[] {
    return this._registros;
  }

  public getClienteRawPorId(id: string): any {
    const registro = this._registros.find((reg) => reg.id === id);
    return registro ? registro.modelo.clienteRaw : null;
  }

  public getFiltrados(): ISolicitudRegistro[] {
    return this._registros.slice();
  }

  public getServicios(): IServicioBase[] {
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
    } catch (error) {
      console.warn("No se pudo leer servicios desde localStorage", error);
    }

    this.guardarServicios(this.serviciosIniciales.slice());
    return this.serviciosIniciales.slice();
  }

  public guardarServicios(servicios: IServicioBase[]): void {
    localStorage.setItem(this.servicioStorageKey, JSON.stringify(servicios));
  }

  public agregarServicio(codigo: string, nombre: string, precio: number): void {
    const servicios = this.getServicios();
    servicios.push({ codigo, nombre, precio, disponible: true });
    this.guardarServicios(servicios);
  }

  public setServicioDisponibilidad(codigo: string, disponible: boolean): void {
    const servicios = this.getServicios();
    const index = servicios.findIndex((item) => item.codigo.toUpperCase() === codigo.toUpperCase());
    if (index === -1) return;
    servicios[index].disponible = disponible;
    this.guardarServicios(servicios);
  }

  public calcularTotalVerificandoPago(): number {
    return this._registros.reduce((acc, reg) => {
      if (reg.modelo.estado === "Verificando pago") {
        return acc + reg.modelo.tarifaTotal();
      }
      return acc;
    }, 0);
  }

  public calcularPromedioDisponible(): number {
    const solicitudesDisponibles = this._registros.filter((reg) => reg.modelo.estado === "Disponible");
    if (solicitudesDisponibles.length === 0) return 0;
    const total = solicitudesDisponibles.reduce((acc, reg) => acc + reg.modelo.tarifaTotal(), 0);
    return total / solicitudesDisponibles.length;
  }

  public obtenerResumenPorServicio(): { codigo: string; nombre: string; cantidad: number; ingreso: number }[] {
    const resumen = new Map<string, { codigo: string; nombre: string; cantidad: number; ingreso: number }>();

    this._registros.forEach((reg) => {
      (reg.modelo.items || []).forEach((item: any) => {
        const codigo = (item.detalles?.codigo || item.codigo || item.descripcion || item.tipo || "Sin código").toString();
        const nombre = item.descripcion || item.nombre || codigo;
        const cantidad = Number(item.cantidad || item.copias || 1) || 1;
        const ingreso = Number(item.subtotal || item.precio || item.precioUnitario || 0) * cantidad;
        const llave = codigo.toUpperCase();

        if (!resumen.has(llave)) {
          resumen.set(llave, { codigo: llave, nombre, cantidad: 0, ingreso: 0 });
        }

        const registro = resumen.get(llave)!;
        registro.cantidad += cantidad;
        registro.ingreso += ingreso;
      });
    });

    return Array.from(resumen.values()).sort((a, b) => b.ingreso - a.ingreso);
  }

  public eliminarServicio(codigo: string): void {
    const servicios = this.getServicios();
    this.guardarServicios(servicios.filter((item) => item.codigo.toUpperCase() !== codigo.toUpperCase()));
  }

  public getTasaBcv(): number {
    const raw = localStorage.getItem(this.tasaStorageKey);
    const valor = raw ? parseFloat(raw) : NaN;
    return Number.isFinite(valor) && valor > 0 ? valor : 30.0;
  }

  public setTasaBcv(valor: number): void {
    if (valor <= 0) return;
    localStorage.setItem(this.tasaStorageKey, valor.toFixed(2));
  }

  public calcularPorcentajeIngresosImpresiones(): number {
    let acImpresiones = 0;
    const totalUsdGlobal = this.calcularTotalIngresosUsd();

    if (totalUsdGlobal === 0) return 0;

    this._registros.forEach((reg) => {
      reg.modelo.items?.forEach((item: any) => {
        if (item.tipo === "impresion") {
          acImpresiones += item.subtotal;
        }
      });
    });

    return (acImpresiones / totalUsdGlobal) * 100;
  }

  public calcularPorcentajeIngresosArticulos(): number {
    let acArticulos = 0;
    const totalUsdGlobal = this.calcularTotalIngresosUsd();

    if (totalUsdGlobal === 0) return 0;

    this._registros.forEach((reg) => {
      reg.modelo.items?.forEach((item: any) => {
        if (item.tipo === "articulo") {
          acArticulos += item.subtotal;
        }
      });
    });

    return (acArticulos / totalUsdGlobal) * 100;
  }

  public calcularPorcentajeIngresosdescargas(): number {
    let acDescargas = 0;
    const totalUsdGlobal = this.calcularTotalIngresosUsd();

    if (totalUsdGlobal === 0) return 0;

    this._registros.forEach((reg) => {
      reg.modelo.items?.forEach((item: any) => {
        if (item.tipo === "descarga") {
          acDescargas += item.subtotal;
        }
      });
    });

    return (acDescargas / totalUsdGlobal) * 100;
  }
}

