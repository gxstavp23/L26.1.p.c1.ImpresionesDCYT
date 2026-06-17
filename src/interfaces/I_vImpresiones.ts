export default interface I_vImpresiones {
  showSection(section: "servicios" | "pedidos" | "tasa" | "none"): void;
  getFiltroBusqueda(): string;
  getServicioDatos(): { codigo: string; nombre: string; precio: number };
  getServicioEliminarCodigo(): string;
  bindMenuServicios(handler: () => void): void;
  bindMenuPedidos(handler: () => void): void;
  bindMenuTasa(handler: () => void): void;
  bindVolverServicios(handler: () => void): void;
  bindVolverPedidos(handler: () => void): void;
  bindVolverTasa(handler: () => void): void;
  bindAddServicio(handler: () => void): void;
  bindRemoveServicio(handler: () => void): void;
  bindBuscarPedidos(handler: () => void): void;
  bindCancelarBusqueda(handler: () => void): void;
  bindChangeBusqueda(handler: () => void): void;
  bindTasaChange(handler: (valor: number) => void): void;
  bindToggleServicioDisponibilidad(handler: (codigo: string, disponible: boolean) => void): void;
  bindPedidoEstadoCambio(handler: (id: string, nuevoEstado: string) => void): void;
  limpiarServicioInputs(): void;
  limpiarBusqueda(): void;
  mostrarServicios(servicios: { codigo: string; nombre: string; precio: number; disponible?: boolean }[]): void;
  mostrarPedidos(contenido: string): void;
  mostrarResumen(contenido: string): void;
  mostrarTasaActual(tasa: number): void;
}