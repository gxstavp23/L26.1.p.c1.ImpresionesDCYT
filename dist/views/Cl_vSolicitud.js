export default class Cl_vSolicitud {
    legacyMode;
    listaCarrito = null;
    carritoVacio = null;
    spanTotal = null;
    spanTotalUsd = null;
    spanTasa = null;
    badgeCarrito = null;
    divMensaje = null;
    inCedula = null;
    inNombre = null;
    clienteNombreInput = null;
    btnVerProductos = null;
    productosLista = null;
    codigoProductoInput = null;
    cantidadProductoInput = null;
    btnAgregarProducto = null;
    btnEliminarProducto = null;
    btnHacerPedido = null;
    totalUsdLegacy = null;
    totalBsLegacy = null;
    bcvValorLegacy = null;
    metodoPagoSelect = null;
    pagoTelefonoInput = null;
    pagoReferenciaInput = null;
    modalPago = null;
    pagoTitulo = null;
    pagoDescripcion = null;
    pagoPreviewText = null;
    pagoMetodoRadios = null;
    pagoCedula = null;
    pagoBanco = null;
    pagoTelf = null;
    pagoRef4 = null;
    ordenCodigo = null;
    btnConfirmPago = null;
    btnCancelPago = null;
    inImpNombre = null;
    inImpHolja = null;
    inImpColor = null;
    inImpCopias = null;
    btnAddImp = null;
    inDescEnlace = null;
    btnAddDesc = null;
    inArtTipo = null;
    inArtCantidad = null;
    btnAddArt = null;
    btnEnviar = null;
    constructor() {
        this.legacyMode = document.getElementById("clienteNombre") !== null;
        if (this.legacyMode) {
            this.clienteNombreInput = this.getElementOptional("clienteNombre");
            this.btnVerProductos = this.getElementOptional("btnVerProductos");
            this.productosLista = this.getElementOptional("productosLista");
            this.codigoProductoInput = this.getElementOptional("codigoProducto");
            this.cantidadProductoInput = this.getElementOptional("cantidadProducto");
            this.btnAgregarProducto = this.getElementOptional("btnAgregar");
            this.btnEliminarProducto = this.getElementOptional("btnEliminar");
            this.btnHacerPedido = this.getElementOptional("btnHacerPedido");
            this.totalUsdLegacy = this.getElementOptional("totalUsd");
            this.totalBsLegacy = this.getElementOptional("totalBs");
            this.bcvValorLegacy = this.getElementOptional("bcvValor");
            this.metodoPagoSelect = this.getElementOptional("metodoPago");
            this.pagoCedula = this.getElementOptional("pagoCedula");
            this.pagoBanco = this.getElementOptional("pagoBanco");
            this.pagoTelefonoInput = this.getElementOptional("pagoTelefono");
            this.pagoReferenciaInput = this.getElementOptional("pagoReferencia");
            this.listaCarrito = this.getElementOptional("listaAgregados");
            this.spanTotal = null;
            this.spanTotalUsd = null;
            this.spanTasa = null;
        }
        else {
            this.listaCarrito = this.getElement("lista-carrito");
            this.carritoVacio = this.getElement("carrito-vacio");
            this.spanTotal = this.getElement("tarifa-total");
            this.spanTotalUsd = this.getElement("tarifa-total-usd");
            this.spanTasa = this.getElement("tasa-dia");
            this.badgeCarrito = this.getElement("carrito-badge");
            this.divMensaje = this.getElement("mensaje-notificacion");
            this.inCedula = this.getElement("cliente-cedula");
            this.inNombre = this.getElement("cliente-nombre");
            this.modalPago = this.getElement("modal-pago");
            this.pagoTitulo = this.getElement("modal-pago-titulo");
            this.pagoDescripcion = this.getElement("modal-pago-descripcion");
            this.pagoPreviewText = this.getElement("pago-preview-text");
            this.pagoMetodoRadios = document.querySelectorAll('input[name="pago-metodo"]');
            this.pagoCedula = this.getElement("pago-cedula");
            this.pagoBanco = this.getElement("pago-banco");
            this.pagoTelf = this.getElement("pago-telefono");
            this.pagoRef4 = this.getElement("pago-ref4");
            this.ordenCodigo = this.getElement("orden-codigo");
            this.btnConfirmPago = this.getElement("btn-confirm-pago");
            this.btnCancelPago = this.getElement("btn-cancel-pago");
            this.inImpNombre = this.getElement("imp-nombre");
            this.inImpHolja = this.getElement("imp-hoja");
            this.inImpColor = this.getElement("imp-color");
            this.inImpCopias = this.getElement("imp-copias");
            this.btnAddImp = this.getElement("btn-add-impresion");
            this.inDescEnlace = this.getElement("desc-enlace");
            this.btnAddDesc = this.getElement("btn-add-descarga");
            this.inArtTipo = this.getElement("art-tipo");
            this.inArtCantidad = this.getElement("art-cantidad");
            this.btnAddArt = this.getElement("btn-add-articulo");
            this.btnEnviar = this.getElement("btn-enviar-solicitud");
        }
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`No se encontró el elemento con id "${id}"`);
        }
        return element;
    }
    getElementOptional(id) {
        const element = document.getElementById(id);
        return element ? element : null;
    }
    getDatosCliente() {
        if (this.legacyMode) {
            return {
                cedula: this.pagoCedula?.value ?? "",
                nombre: this.clienteNombreInput?.value ?? "",
                fecha: new Date().toISOString().split('T')[0]
            };
        }
        return {
            cedula: this.inCedula?.value ?? "",
            nombre: this.inNombre?.value ?? "",
            fecha: new Date().toISOString().split('T')[0]
        };
    }
    getDatosPago() {
        const cedula = this.pagoCedula?.value.trim() ?? "";
        const tipoTexto = this.metodoPagoSelect?.value ?? "Pago Móvil";
        const banco = this.pagoBanco?.value ?? null;
        const telefono = this.pagoTelefonoInput?.value ?? null;
        const referencia = this.pagoReferenciaInput?.value.trim() ?? null;
        const tipo = tipoTexto === "Transferencia"
            ? "transferencia"
            : tipoTexto === "Pago en Efectivo"
                ? "efectivo"
                : "movil";
        return {
            tipo,
            cedula,
            banco: tipo === "efectivo" ? null : banco,
            telefono: tipo === "efectivo" ? null : telefono,
            referencia4: tipo === "efectivo" ? null : referencia
        };
    }
    getDatosImpresion() {
        return {
            nombre: this.inImpNombre?.value ?? "",
            hoja: this.inImpHolja?.value ?? "carta",
            formato: this.inImpColor?.value ?? "bn",
            copias: parseInt(this.inImpCopias?.value ?? "1") || 1
        };
    }
    getDatosDescarga() {
        return { enlace: this.inDescEnlace?.value ?? "" };
    }
    getDatosArticulo() {
        return {
            tipo: this.inArtTipo?.value ?? "lapicero",
            cantidad: parseInt(this.inArtCantidad?.value ?? "1") || 1
        };
    }
    getCodigoProducto() {
        return this.codigoProductoInput?.value.trim().toUpperCase() ?? "";
    }
    getCantidadProducto() {
        return parseInt(this.cantidadProductoInput?.value ?? "1") || 1;
    }
    limpiarInputsImpresion() {
        if (!this.legacyMode) {
            if (this.inImpNombre)
                this.inImpNombre.value = "";
            if (this.inImpCopias)
                this.inImpCopias.value = "1";
        }
    }
    limpiarInputsDescarga() {
        if (!this.legacyMode) {
            if (this.inDescEnlace)
                this.inDescEnlace.value = "";
        }
    }
    limpiarInputsArticulo() {
        if (!this.legacyMode) {
            if (this.inArtCantidad)
                this.inArtCantidad.value = "1";
        }
    }
    limpiarTodo() {
        if (this.legacyMode) {
            if (this.clienteNombreInput)
                this.clienteNombreInput.value = "";
            if (this.codigoProductoInput)
                this.codigoProductoInput.value = "";
            if (this.cantidadProductoInput)
                this.cantidadProductoInput.value = "1";
            if (this.pagoCedula)
                this.pagoCedula.value = "";
            if (this.pagoBanco)
                this.pagoBanco.value = "";
            if (this.pagoTelefonoInput)
                this.pagoTelefonoInput.value = "";
            if (this.pagoReferenciaInput)
                this.pagoReferenciaInput.value = "";
            if (this.productosLista) {
                this.productosLista.style.display = "none";
            }
            if (this.listaCarrito) {
                this.listaCarrito.innerHTML = "No hay productos agregados.";
            }
            if (this.totalUsdLegacy)
                this.totalUsdLegacy.textContent = "$0.00";
            if (this.totalBsLegacy)
                this.totalBsLegacy.textContent = "0.00";
        }
        else {
            if (this.inCedula)
                this.inCedula.value = "";
            if (this.inNombre)
                this.inNombre.value = "";
            this.limpiarInputsImpresion();
            this.limpiarInputsDescarga();
            this.limpiarInputsArticulo();
        }
    }
    // Mostrar/ocultar modal de pago
    showPaymentModal(prefillCedula, ordenCodigo) {
        if (!this.legacyMode && this.modalPago && this.pagoCedula && this.ordenCodigo) {
            if (prefillCedula)
                this.pagoCedula.value = prefillCedula;
            if (ordenCodigo)
                this.ordenCodigo.textContent = ordenCodigo;
            this.setPaymentMethod('movil');
            this.actualizarCamposPago();
            this.actualizarPagoPreview();
            this.modalPago.classList.remove('hidden');
        }
    }
    hidePaymentModal() {
        if (!this.legacyMode && this.modalPago) {
            this.modalPago.classList.add('hidden');
        }
    }
    actualizarCamposPago() {
        if (!this.pagoMetodoRadios || !this.pagoCedula || !this.pagoBanco || !this.pagoTelf || !this.pagoRef4)
            return;
        const metodo = this.getSelectedPaymentMethod();
        const esEfectivo = metodo === 'divisas' || metodo === 'bolivares';
        this.pagoCedula.disabled = false;
        this.pagoBanco.disabled = esEfectivo;
        this.pagoTelf.disabled = esEfectivo;
        this.pagoRef4.disabled = esEfectivo;
        if (esEfectivo) {
            this.pagoBanco.classList.add('bg-gray-100', 'cursor-not-allowed');
            this.pagoTelf.classList.add('bg-gray-100', 'cursor-not-allowed');
            this.pagoRef4.classList.add('bg-gray-100', 'cursor-not-allowed');
        }
        else {
            this.pagoBanco.classList.remove('bg-gray-100', 'cursor-not-allowed');
            this.pagoTelf.classList.remove('bg-gray-100', 'cursor-not-allowed');
            this.pagoRef4.classList.remove('bg-gray-100', 'cursor-not-allowed');
        }
    }
    actualizarPagoPreview() {
        if (!this.pagoMetodoRadios || !this.pagoTitulo || !this.pagoDescripcion || !this.pagoPreviewText)
            return;
        const metodo = this.getSelectedPaymentMethod();
        if (metodo === 'divisas') {
            this.pagoTitulo.textContent = 'Confirmar Pago - Divisas';
            this.pagoDescripcion.textContent = 'El usuario pagará en efectivo en dólares. No se requieren datos bancarios ni referencia.';
            this.pagoPreviewText.textContent = 'Vista previa: Pago en Divisas seleccionado. Se enviará un objeto pago con banco y referencia como null.';
        }
        else if (metodo === 'bolivares') {
            this.pagoTitulo.textContent = 'Confirmar Pago - Bolívares';
            this.pagoDescripcion.textContent = 'El usuario pagará en efectivo en bolívares. No se requieren datos bancarios ni referencia.';
            this.pagoPreviewText.textContent = 'Vista previa: Pago en Bolívares seleccionado. Se enviará un objeto pago con banco y referencia como null.';
        }
        else {
            this.pagoTitulo.textContent = 'Confirmar Pago - Pago Móvil';
            this.pagoDescripcion.textContent = 'Completa los datos de Pago Móvil para enviar la referencia correctamente.';
            this.pagoPreviewText.textContent = 'Vista previa: Pago Móvil activo. Ingresa cédula, banco y referencia.';
        }
    }
    getSelectedPaymentMethod() {
        if (!this.pagoMetodoRadios)
            return 'movil';
        const seleccionado = Array.from(this.pagoMetodoRadios).find(radio => radio.checked);
        return seleccionado?.value ?? 'movil';
    }
    setPaymentMethod(value) {
        this.pagoMetodoRadios?.forEach(radio => {
            radio.checked = radio.value === value;
        });
    }
    bindConfirmPayment(handler) {
        if (!this.pagoMetodoRadios || !this.btnConfirmPago || !this.btnCancelPago || !this.pagoCedula || !this.pagoBanco || !this.pagoTelf || !this.pagoRef4)
            return;
        this.pagoMetodoRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.actualizarCamposPago();
                this.actualizarPagoPreview();
            });
        });
        this.btnConfirmPago.addEventListener('click', () => {
            const metodo = this.getSelectedPaymentMethod();
            const ced = this.pagoCedula.value.trim();
            if (!ced) {
                this.mostrarMensaje('Ingrese la cédula para el pago.', 'error');
                return;
            }
            if (metodo === 'divisas') {
                handler({ tipo: 'Divisas', cedula: ced, banco: null, telefono: null, referencia4: null });
                this.hidePaymentModal();
                return;
            }
            if (metodo === 'bolivares') {
                handler({ tipo: 'Bolívares', cedula: ced, banco: null, telefono: null, referencia4: null });
                this.hidePaymentModal();
                return;
            }
            const banco = this.pagoBanco.value;
            const ref4 = this.pagoRef4.value.trim();
            const telf = this.pagoTelf.value;
            if (!/^\d{4}$/.test(ref4)) {
                this.mostrarMensaje('Ingrese los últimos 4 dígitos de la referencia (solo números).', 'error');
                return;
            }
            handler({ tipo: 'movil', cedula: ced, banco, telefono: telf, referencia4: ref4 });
            this.hidePaymentModal();
        });
        this.btnCancelPago.addEventListener('click', () => this.hidePaymentModal());
    }
    mostrarTasaDelDia(tasa) {
        if (this.legacyMode) {
            if (this.bcvValorLegacy) {
                this.bcvValorLegacy.textContent = tasa.toFixed(2);
            }
            return;
        }
        if (this.spanTasa) {
            this.spanTasa.textContent = `${tasa.toFixed(2)} Bs/$`;
        }
    }
    renderizarCarrito(items, totalBs, totalUsd, tasa) {
        if (this.legacyMode) {
            if (this.totalUsdLegacy) {
                this.totalUsdLegacy.textContent = `$${totalUsd.toFixed(2)}`;
            }
            if (this.totalBsLegacy) {
                this.totalBsLegacy.textContent = totalBs.toFixed(2);
            }
            if (this.bcvValorLegacy) {
                this.bcvValorLegacy.textContent = tasa.toFixed(2);
            }
            if (this.listaCarrito) {
                if (items.length === 0) {
                    this.listaCarrito.innerHTML = 'No hay productos agregados.';
                    return;
                }
                this.listaCarrito.innerHTML = items
                    .map(item => `
            <div style="border-bottom:1px solid #ccc; padding:0.5rem 0;">
              <strong>${item.descripcion}</strong><br>
              Cant: ${item.cantidad} | P/U: ${item.precioUnitario.toFixed(2)} $ | Subtotal: ${item.subtotal.toFixed(2)} $
            </div>
          `)
                    .join('');
            }
            return;
        }
        if (!this.listaCarrito || !this.carritoVacio || !this.badgeCarrito || !this.spanTotal || !this.spanTotalUsd)
            return;
        this.spanTotal.textContent = `${totalBs.toFixed(2)} Bs`;
        this.spanTotalUsd.textContent = `${totalUsd.toFixed(2)} $`;
        this.badgeCarrito.textContent = `${items.length} items`;
        if (items.length === 0) {
            this.listaCarrito.innerHTML = '';
            const emptyClone = this.carritoVacio.cloneNode(true);
            emptyClone.style.display = 'block';
            this.listaCarrito.appendChild(emptyClone);
            return;
        }
        this.carritoVacio.style.display = 'none';
        this.listaCarrito.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = "flex flex-col gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100";
            const subtotalBs = item.subtotal * tasa;
            div.innerHTML = `
        <div class="flex justify-between items-start gap-4">
          <div class="pr-2 flex-1">
            <p class="text-sm font-bold text-gray-800">${item.descripcion}</p>
            <p class="text-xs text-gray-500">Cant: ${item.cantidad} | P/U: ${item.precioUnitario.toFixed(2)} $</p>
            <p class="text-sm font-semibold text-blue-600 mt-1">
              ${subtotalBs.toFixed(2)} Bs 
              <span class="text-green-600 text-xs ml-1 font-bold">(${item.subtotal.toFixed(2)} $)</span>
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <button class="text-red-400 hover:text-red-600 p-1 btn-eliminar-item" data-id="${item.id}" title="Eliminar">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
            <div class="flex items-center gap-1">
              <button class="text-gray-500 hover:text-gray-900 p-1 rounded-full border border-gray-200 btn-modificar-item" data-id="${item.id}" data-action="decrementar" title="Disminuir cantidad">-</button>
              <span class="text-sm font-semibold">${item.cantidad}</span>
              <button class="text-gray-500 hover:text-gray-900 p-1 rounded-full border border-gray-200 btn-modificar-item" data-id="${item.id}" data-action="incrementar" title="Aumentar cantidad">+</button>
            </div>
          </div>
        </div>
      `;
            this.listaCarrito.appendChild(div);
        });
    }
    mostrarMensaje(mensaje, tipo) {
        if (this.divMensaje) {
            this.divMensaje.textContent = mensaje;
            this.divMensaje.className = `p-3 mb-3 rounded-lg text-sm font-semibold text-center transition-all ${tipo === 'exito' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;
            this.divMensaje.classList.remove('hidden');
            const mensajeDiv = this.divMensaje;
            setTimeout(() => mensajeDiv?.classList.add('hidden'), 5000);
            return;
        }
        alert(mensaje);
    }
    bindAddImpresion(handler) {
        this.btnAddImp?.addEventListener("click", handler);
    }
    bindAddDescarga(handler) {
        this.btnAddDesc?.addEventListener("click", handler);
    }
    bindAddArticulo(handler) {
        this.btnAddArt?.addEventListener("click", handler);
    }
    bindEliminarItem(handler) {
        if (!this.listaCarrito)
            return;
        this.listaCarrito.addEventListener("click", (e) => {
            const target = e.target;
            const btn = target.closest('.btn-eliminar-item');
            if (btn) {
                const id = btn.getAttribute('data-id');
                if (id)
                    handler(id);
            }
        });
    }
    bindModificarItem(handler) {
        if (!this.listaCarrito)
            return;
        this.listaCarrito.addEventListener("click", (e) => {
            const target = e.target;
            const btn = target.closest('.btn-modificar-item');
            if (btn) {
                const id = btn.getAttribute('data-id');
                const accion = btn.getAttribute('data-action');
                if (id && accion && (accion === 'incrementar' || accion === 'decrementar')) {
                    handler(id, accion);
                }
            }
        });
    }
    bindVerProductos(handler) {
        this.btnVerProductos?.addEventListener("click", handler);
    }
    bindAgregarProducto(handler) {
        this.btnAgregarProducto?.addEventListener("click", handler);
    }
    bindEliminarProducto(handler) {
        this.btnEliminarProducto?.addEventListener("click", handler);
    }
    bindHacerPedido(handler) {
        this.btnHacerPedido?.addEventListener("click", handler);
    }
    bindEnviarPedido(handler) {
        this.btnEnviar?.addEventListener("click", handler);
    }
    mostrarProductos(servicios) {
        if (!this.productosLista)
            return;
        this.productosLista.style.display = 'block';
        this.productosLista.innerHTML = servicios
            .map(servicio => `
        <div style="margin-bottom: 0.5rem;">
          <strong>${servicio.codigo}</strong> - ${servicio.nombre} (<span>$${servicio.precio.toFixed(2)}</span>)
        </div>
      `)
            .join('');
    }
}
//# sourceMappingURL=Cl_vSolicitud.js.map