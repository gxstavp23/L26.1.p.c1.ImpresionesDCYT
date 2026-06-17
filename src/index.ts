import Cl_vSolicitud from './views/Cl_vSolicitud.js';
import Cl_sSolicitud from './services/Cl_sSolicitud.js';
import Cl_cSolicitud from './controllers/Cl_cSolicitud.js';
import Cl_vImpresiones from './views/Cl_vImpresiones.js';
import Cl_mImpresiones from './models/Cl_mImpresiones.js';
import Cl_cImpresiones from './controllers/Cl_cImpresiones.js';

document.addEventListener('DOMContentLoaded', () => {
  const adminPage = document.getElementById('btn-menu-servicios') !== null;
  const solicitudPage =
    document.getElementById('cliente-nombre') !== null ||
    document.getElementById('clienteNombre') !== null ||
    document.getElementById('cliente-cedula') !== null;

  if (solicitudPage) {
    const vistaSolicitud = new Cl_vSolicitud();
    const servicioSolicitud = new Cl_sSolicitud();
    new Cl_cSolicitud(vistaSolicitud, servicioSolicitud);
  }

  if (adminPage) {
    const modeloImpresiones = new Cl_mImpresiones();
    const vistaImpresiones = new Cl_vImpresiones();
    new Cl_cImpresiones(modeloImpresiones, vistaImpresiones);
  }
});
