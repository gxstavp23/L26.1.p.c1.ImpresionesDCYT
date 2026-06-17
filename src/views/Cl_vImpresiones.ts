import I_vImpresiones from "../interfaces/I_vImpresiones.js";

type TServicio = { codigo: string; nombre: string; precio: number; disponible?: boolean };

export default class Cl_vImpresiones implements I_vImpresiones {
  private btnServicios: HTMLButtonElement;
  private btnPedidos: HTMLButtonElement;
  private btnTasa: HTMLButtonElement;
  private secServicios: HTMLElement;
  private secPedidos: HTMLElement;
  private secTasa: HTMLElement;
  private svcBack: HTMLButtonElement;
  private pedBack: HTMLButtonElement;
  private tasaBack: HTMLButtonElement;
  private inSvcCodigo: HTMLInputElement;
  private inSvcNombre: HTMLInputElement;
  private inSvcPrecio: HTMLInputElement;
  private btnSvcAdd: HTMLButtonElement;
  private btnSvcRemove: HTMLButtonElement;
  private svcList: HTMLTableSectionElement;
  private searchInput: HTMLInputElement;
  private btnBuscar: HTMLButtonElement;
  private btnCancelarBuscar: HTMLButtonElement;
  private ordersContainer: HTMLDivElement;
  private tasaInput: HTMLInputElement;
  private summaryDataContainer: HTMLDivElement;

  constructor() {
    this.btnServicios = this.getElement<HTMLButtonElement>("btn-menu-servicios");
    this.btnPedidos = this.getElement<HTMLButtonElement>("btn-menu-pedidos");
    this.btnTasa = this.getElement<HTMLButtonElement>("btn-menu-tasa");
    this.secServicios = this.getElement<HTMLElement>("section-servicios");
    this.secPedidos = this.getElement<HTMLElement>("section-pedidos");
    this.secTasa = this.getElement<HTMLElement>("section-tasa");
    this.svcBack = this.getElement<HTMLButtonElement>("svcBack");
    this.pedBack = this.getElement<HTMLButtonElement>("pedBack");
    this.tasaBack = this.getElement<HTMLButtonElement>("tasaBack");
    this.inSvcCodigo = this.getElement<HTMLInputElement>("svcCodigo");
    this.inSvcNombre = this.getElement<HTMLInputElement>("svcNombre");
    this.inSvcPrecio = this.getElement<HTMLInputElement>("svcPrecio");
    this.btnSvcAdd = this.getElement<HTMLButtonElement>("svcAdd");
    this.btnSvcRemove = this.getElement<HTMLButtonElement>("svcRemove");
    this.svcList = this.getElement<HTMLTableSectionElement>("svcList");
    this.searchInput = this.getElement<HTMLInputElement>("sel-hash-codigo");
    this.btnBuscar = this.getElement<HTMLButtonElement>("btn-aceptar");
    this.btnCancelarBuscar = this.getElement<HTMLButtonElement>("btn-cancelar");
    this.ordersContainer = this.getElement<HTMLDivElement>("ordersContainer");
    this.tasaInput = this.getElement<HTMLInputElement>("tasa-bcv");
    this.summaryDataContainer = this.getElement<HTMLDivElement>("admin-summary-data");

    this.showSection("none");
  }

  private getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`No se encontró el elemento con id "${id}"`);
    }
    return element as T;
  }

  public showSection(section: "servicios" | "pedidos" | "tasa" | "none"): void {
    this.secServicios.style.display = section === "servicios" ? "block" : "none";
    this.secPedidos.style.display = section === "pedidos" ? "block" : "none";
    this.secTasa.style.display = section === "tasa" ? "block" : "none";
  }

  public getFiltroBusqueda(): string {
    return this.searchInput.value.trim();
  }

  public getServicioDatos() {
    return {
      codigo: this.inSvcCodigo.value.trim().toUpperCase(),
      nombre: this.inSvcNombre.value.trim(),
      precio: parseFloat(this.inSvcPrecio.value) || 0,
    };
  }

  public getServicioEliminarCodigo(): string {
    return this.inSvcCodigo.value.trim().toUpperCase();
  }

  public bindMenuServicios(handler: () => void): void {
    this.btnServicios.addEventListener("click", handler);
  }

  public bindMenuPedidos(handler: () => void): void {
    this.btnPedidos.addEventListener("click", handler);
  }

  public bindMenuTasa(handler: () => void): void {
    this.btnTasa.addEventListener("click", handler);
  }

  public bindVolverServicios(handler: () => void): void {
    this.svcBack.addEventListener("click", handler);
  }

  public bindVolverPedidos(handler: () => void): void {
    this.pedBack.addEventListener("click", handler);
  }

  public bindVolverTasa(handler: () => void): void {
    this.tasaBack.addEventListener("click", handler);
  }

  public bindAddServicio(handler: () => void): void {
    this.btnSvcAdd.addEventListener("click", handler);
  }

  public bindRemoveServicio(handler: () => void): void {
    this.btnSvcRemove.addEventListener("click", handler);
  }

  public bindBuscarPedidos(handler: () => void): void {
    this.btnBuscar.addEventListener("click", handler);
  }

  public bindCancelarBusqueda(handler: () => void): void {
    this.btnCancelarBuscar.addEventListener("click", handler);
  }

  public bindChangeBusqueda(handler: () => void): void {
    this.searchInput.addEventListener("input", handler);
  }

  public bindTasaChange(handler: (valor: number) => void): void {
    this.tasaInput.addEventListener("input", () => {
      const tasa = parseFloat(this.tasaInput.value) || 0;
      handler(tasa);
    });
  }

  public bindToggleServicioDisponibilidad(handler: (codigo: string, disponible: boolean) => void): void {
    this.svcList.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const btn = target.closest(".btn-toggle-disponibilidad") as HTMLButtonElement | null;
      if (!btn) return;
      const codigo = btn.dataset.codigo;
      const disponible = btn.dataset.disponible === "true";
      if (!codigo) return;
      handler(codigo, !disponible);
    });
  }

  public bindPedidoEstadoCambio(handler: (id: string, nuevoEstado: string) => void): void {
    this.ordersContainer.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      const btn = target.closest(".btn-cambiar-estado") as HTMLButtonElement | null;
      if (!btn) return;
      const id = btn.dataset.id;
      const estado = btn.dataset.estado;
      if (!id || !estado) return;
      handler(id, estado);
    });
  }

  public limpiarServicioInputs(): void {
    this.inSvcCodigo.value = "";
    this.inSvcNombre.value = "";
    this.inSvcPrecio.value = "";
  }

  public limpiarBusqueda(): void {
    this.searchInput.value = "";
  }

  public mostrarServicios(servicios: TServicio[]): void {
    this.svcList.innerHTML = "";
    servicios.forEach((servicio) => {
      const fila = document.createElement("tr");
      fila.className = servicio.disponible === false ? "service-disabled" : "";
      fila.innerHTML = `
        <td style="border:1px solid #999;padding:6px">${servicio.codigo}</td>
        <td style="border:1px solid #999;padding:6px">${servicio.nombre}</td>
        <td style="border:1px solid #999;padding:6px;text-align:right">${servicio.precio.toFixed(2)}</td>
        <td style="border:1px solid #999;padding:6px;text-align:center">${servicio.disponible ? "Sí" : "No"}</td>
        <td style="border:1px solid #999;padding:6px;text-align:center">
          <button type="button" class="estado-btn btn-toggle-disponibilidad" data-codigo="${servicio.codigo}" data-disponible="${servicio.disponible === true}">
            ${servicio.disponible ? "Marcar no disponible" : "Marcar disponible"}
          </button>
        </td>
      `;
      this.svcList.appendChild(fila);
    });
  }

  public mostrarPedidos(contenido: string): void {
    this.ordersContainer.innerHTML = contenido;
  }

  public mostrarResumen(contenido: string): void {
    this.summaryDataContainer.innerHTML = contenido;
  }

  public mostrarTasaActual(tasa: number): void {
    this.tasaInput.value = tasa.toFixed(2);
  }
}
