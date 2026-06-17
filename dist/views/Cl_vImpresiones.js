export default class Cl_vImpresiones {
    btnServicios;
    btnPedidos;
    btnTasa;
    secServicios;
    secPedidos;
    secTasa;
    svcBack;
    pedBack;
    tasaBack;
    inSvcCodigo;
    inSvcNombre;
    inSvcPrecio;
    btnSvcAdd;
    btnSvcRemove;
    svcList;
    searchInput;
    btnBuscar;
    btnCancelarBuscar;
    ordersContainer;
    tasaInput;
    summaryDataContainer;
    constructor() {
        this.btnServicios = this.getElement("btn-menu-servicios");
        this.btnPedidos = this.getElement("btn-menu-pedidos");
        this.btnTasa = this.getElement("btn-menu-tasa");
        this.secServicios = this.getElement("section-servicios");
        this.secPedidos = this.getElement("section-pedidos");
        this.secTasa = this.getElement("section-tasa");
        this.svcBack = this.getElement("svcBack");
        this.pedBack = this.getElement("pedBack");
        this.tasaBack = this.getElement("tasaBack");
        this.inSvcCodigo = this.getElement("svcCodigo");
        this.inSvcNombre = this.getElement("svcNombre");
        this.inSvcPrecio = this.getElement("svcPrecio");
        this.btnSvcAdd = this.getElement("svcAdd");
        this.btnSvcRemove = this.getElement("svcRemove");
        this.svcList = this.getElement("svcList");
        this.searchInput = this.getElement("sel-hash-codigo");
        this.btnBuscar = this.getElement("btn-aceptar");
        this.btnCancelarBuscar = this.getElement("btn-cancelar");
        this.ordersContainer = this.getElement("ordersContainer");
        this.tasaInput = this.getElement("tasa-bcv");
        this.summaryDataContainer = this.getElement("admin-summary-data");
        this.showSection("none");
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`No se encontró el elemento con id "${id}"`);
        }
        return element;
    }
    showSection(section) {
        this.secServicios.style.display = section === "servicios" ? "block" : "none";
        this.secPedidos.style.display = section === "pedidos" ? "block" : "none";
        this.secTasa.style.display = section === "tasa" ? "block" : "none";
    }
    getFiltroBusqueda() {
        return this.searchInput.value.trim();
    }
    getServicioDatos() {
        return {
            codigo: this.inSvcCodigo.value.trim().toUpperCase(),
            nombre: this.inSvcNombre.value.trim(),
            precio: parseFloat(this.inSvcPrecio.value) || 0,
        };
    }
    getServicioEliminarCodigo() {
        return this.inSvcCodigo.value.trim().toUpperCase();
    }
    bindMenuServicios(handler) {
        this.btnServicios.addEventListener("click", handler);
    }
    bindMenuPedidos(handler) {
        this.btnPedidos.addEventListener("click", handler);
    }
    bindMenuTasa(handler) {
        this.btnTasa.addEventListener("click", handler);
    }
    bindVolverServicios(handler) {
        this.svcBack.addEventListener("click", handler);
    }
    bindVolverPedidos(handler) {
        this.pedBack.addEventListener("click", handler);
    }
    bindVolverTasa(handler) {
        this.tasaBack.addEventListener("click", handler);
    }
    bindAddServicio(handler) {
        this.btnSvcAdd.addEventListener("click", handler);
    }
    bindRemoveServicio(handler) {
        this.btnSvcRemove.addEventListener("click", handler);
    }
    bindBuscarPedidos(handler) {
        this.btnBuscar.addEventListener("click", handler);
    }
    bindCancelarBusqueda(handler) {
        this.btnCancelarBuscar.addEventListener("click", handler);
    }
    bindChangeBusqueda(handler) {
        this.searchInput.addEventListener("input", handler);
    }
    bindTasaChange(handler) {
        this.tasaInput.addEventListener("input", () => {
            const tasa = parseFloat(this.tasaInput.value) || 0;
            handler(tasa);
        });
    }
    bindToggleServicioDisponibilidad(handler) {
        this.svcList.addEventListener("click", (event) => {
            const target = event.target;
            const btn = target.closest(".btn-toggle-disponibilidad");
            if (!btn)
                return;
            const codigo = btn.dataset.codigo;
            const disponible = btn.dataset.disponible === "true";
            if (!codigo)
                return;
            handler(codigo, !disponible);
        });
    }
    bindPedidoEstadoCambio(handler) {
        this.ordersContainer.addEventListener("click", (event) => {
            const target = event.target;
            const btn = target.closest(".btn-cambiar-estado");
            if (!btn)
                return;
            const id = btn.dataset.id;
            const estado = btn.dataset.estado;
            if (!id || !estado)
                return;
            handler(id, estado);
        });
    }
    limpiarServicioInputs() {
        this.inSvcCodigo.value = "";
        this.inSvcNombre.value = "";
        this.inSvcPrecio.value = "";
    }
    limpiarBusqueda() {
        this.searchInput.value = "";
    }
    mostrarServicios(servicios) {
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
    mostrarPedidos(contenido) {
        this.ordersContainer.innerHTML = contenido;
    }
    mostrarResumen(contenido) {
        this.summaryDataContainer.innerHTML = contenido;
    }
    mostrarTasaActual(tasa) {
        this.tasaInput.value = tasa.toFixed(2);
    }
}
//# sourceMappingURL=Cl_vImpresiones.js.map