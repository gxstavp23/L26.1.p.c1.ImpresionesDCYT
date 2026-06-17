import Cl_mImpresiones from "../models/Cl_mImpresiones.js";
import I_vImpresiones from "../interfaces/I_vImpresiones.js";
import Cl_solicitudes from "../services/Cl_sSolicitudes.js";

export default class Cl_cImpresiones {
  private modelo: Cl_mImpresiones;
  private vista: I_vImpresiones;

  constructor(modelo: Cl_mImpresiones, vista: I_vImpresiones) {
    this.modelo = modelo;
    this.vista = vista;

    this.vista.bindMenuServicios(() => this.vista.showSection("servicios"));
    this.vista.bindMenuPedidos(() => {
      this.cargarDatos();
      this.vista.showSection("pedidos");
    });
    this.vista.bindMenuTasa(() => {
      this.vista.mostrarTasaActual(this.modelo.getTasaBcv());
      this.vista.showSection("tasa");
    });

    this.vista.bindVolverServicios(() => this.vista.showSection("none"));
    this.vista.bindVolverPedidos(() => this.vista.showSection("none"));
    this.vista.bindVolverTasa(() => this.vista.showSection("none"));

    this.vista.bindAddServicio(() => this.handleAgregarServicio());
    this.vista.bindRemoveServicio(() => this.handleEliminarServicio());
    this.vista.bindBuscarPedidos(() => this.actualizarVista());
    this.vista.bindCancelarBusqueda(() => {
      this.vista.limpiarBusqueda();
      this.actualizarVista();
    });
    this.vista.bindChangeBusqueda(() => this.actualizarVista());
    this.vista.bindToggleServicioDisponibilidad((codigo, disponible) => this.handleServicioDisponibilidad(codigo, disponible));
    this.vista.bindPedidoEstadoCambio((id, estado) => this.cambiarEstadoSolicitud(id, estado));
    this.vista.bindTasaChange((valor) => this.handleTasaCambio(valor));

    this.renderServicios();
    this.vista.mostrarTasaActual(this.modelo.getTasaBcv());
    this.cargarDatos();
  }

  async cargarDatos() {
    const resultado = await Cl_solicitudes.getSolicitudes();
    if (!resultado.ok) {
      this.vista.mostrarPedidos("<div>Error cargando pedidos.</div>");
      return;
    }

    this.modelo.setSolicitudes(resultado.tabla);
    this.actualizarVista();
  }

  actualizarVista() {
    let solicitudesFiltradas = this.modelo.getFiltrados();
    const filtro = this.vista.getFiltroBusqueda().toLowerCase();

    if (filtro) {
      solicitudesFiltradas = solicitudesFiltradas.filter((reg) =>
        reg.modelo.codigoOrden.toLowerCase().includes(filtro)
      );
    }

    const html = solicitudesFiltradas.length
      ? solicitudesFiltradas
          .map((reg) => {
            const cliente = reg.modelo.clienteRaw ?? {};
            const codigoOrden = reg.modelo.codigoOrden || reg.id || "R000";
            const nombre = typeof cliente === 'string'
              ? cliente
              : cliente?.nombre || reg.modelo.nombre || "Sin nombre";
            const fecha = reg.modelo.fecha || "";
            const pago = reg.modelo.pago || {};
            const items = reg.modelo.items || [];
            const totalUsd = Number(reg.modelo.tarifaTotalUsd()).toFixed(2);
            const detalleItems = Array.isArray(items)
              ? items
                  .map((item: any) => {
                    const descripcion = item.descripcion || item.nombre || item.tipo || "Item";
                    const cantidad = item.cantidad || item.copias || 1;
                    const precio = Number(item.precio || item.precioUnitario || 0).toFixed(2);
                    const subtotal = Number((item.precio || item.precioUnitario || 0) * cantidad).toFixed(2);
                    return `> ${descripcion}, ${cantidad}, $${precio}, $${subtotal}`;
                  })
                  .join("<br/>")
              : "";
            const estado = reg.modelo.estado || "Desconocido";
            const nextStateMap: Record<string, string | null> = {
              "Verificando pago": "Imprimiendo",
              "Imprimiendo": "Disponible",
              "Disponible": "Entregado",
              "Entregado": null,
            };
            const estadoSiguiente = nextStateMap[estado] ?? null;
            const botonesEstado = estadoSiguiente
              ? `<button type="button" class="estado-btn btn-cambiar-estado" data-id="${reg.id}" data-estado="${estadoSiguiente}">${estadoSiguiente}</button>`
              : "";

            const estadoLabel = estado === "Disponible" ? "Listo" : estado;
            return `<div style="margin-bottom:1rem;line-height:1.4; border:1px solid #ccc; padding:0.75rem; background:#fafafa;">
              <strong>+ ID: ${codigoOrden} - ${nombre}, ${fecha}</strong><br>
              Estado: <strong>${estadoLabel}</strong><br>
              ${detalleItems}<br>
              > Total a pagar: $${totalUsd}<br>
              > Pago móvil - CI: ${pago.cedula || ""}, Tel: ${pago.telefono || ""}, Banco: ${pago.banco || ""}, Ref: ${pago.referencia4 || ""}<br>
              <div style="margin-top:0.5rem; display:flex; flex-wrap:wrap; gap:0.4rem;">${botonesEstado}</div>
            </div>`;
          })
          .join("")
      : "<div>No se encontraron pedidos.</div>";

    this.vista.mostrarPedidos(html);
    this.actualizarResumen();
  }

  private renderServicios() {
    this.vista.mostrarServicios(this.modelo.getServicios());
  }

  private handleAgregarServicio() {
    const datos = this.vista.getServicioDatos();
    if (!datos.codigo || !datos.nombre || datos.precio <= 0) {
      alert("Código, nombre y precio son obligatorios para agregar un servicio.");
      return;
    }

    const servicios = this.modelo.getServicios();
    if (servicios.some((item) => item.codigo.toUpperCase() === datos.codigo.toUpperCase())) {
      alert("El código ya existe.");
      return;
    }

    this.modelo.agregarServicio(datos.codigo, datos.nombre, datos.precio);
    this.renderServicios();
    this.vista.limpiarServicioInputs();
  }

  private handleEliminarServicio() {
    const codigo = this.vista.getServicioEliminarCodigo();
    if (!codigo) {
      alert("Ingrese código a eliminar");
      return;
    }

    this.modelo.eliminarServicio(codigo);
    this.renderServicios();
    this.vista.limpiarServicioInputs();
  }

  private handleTasaCambio(valor: number) {
    if (valor <= 0) {
      return;
    }

    this.modelo.setTasaBcv(valor);
    this.vista.mostrarTasaActual(this.modelo.getTasaBcv());
  }

  async cambiarEstadoSolicitud(id: string, nuevoEstado: string) {
    const confirmacion = confirm(`¿Está seguro de cambiar el estado de esta solicitud a "${nuevoEstado}"?`);
    if (!confirmacion) return;

    const clienteRaw = this.modelo.getClienteRawPorId(id);
    const resultado = await Cl_solicitudes.cambiarEstado(id, nuevoEstado, clienteRaw);
    alert(resultado.mensaje);

    if (resultado.ok) {
      this.modelo.actualizarEstadoSolicitud(id, nuevoEstado);
      this.actualizarVista();
    }
  }

  private actualizarResumen() {
    const resumen = this.modelo.obtenerResumenPorServicio();
    const totalVerificando = this.modelo.calcularTotalVerificandoPago();
    const promedioDisponible = this.modelo.calcularPromedioDisponible();

    const resumenHtml = `
      <div><strong>Ingreso total (Verificando pago):</strong> $${totalVerificando.toFixed(2)}</div>
      <div><strong>Promedio servicios Disponibles:</strong> $${promedioDisponible.toFixed(2)}</div>
      <div style="margin-top:0.75rem;"><strong>Ingreso y cantidad por servicio</strong></div>
      <div style="max-height:160px; overflow:auto; margin-top:0.35rem;">
        ${resumen.length > 0 ? resumen.map((item) => `
          <div style="margin-bottom:0.3rem;">${item.codigo}: ${item.nombre} - Cant: ${item.cantidad} - Ingreso: $${item.ingreso.toFixed(2)}</div>
        `).join("") : "<div>No hay datos de servicios.</div>"}
      </div>
    `;

    this.vista.mostrarResumen(resumenHtml);
  }

  private handleServicioDisponibilidad(codigo: string, disponible: boolean) {
    this.modelo.setServicioDisponibilidad(codigo, disponible);
    this.renderServicios();
  }
}
