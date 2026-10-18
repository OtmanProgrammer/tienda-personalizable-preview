# Tu diseño, tu prenda — solicitudes por WhatsApp

Página estática para mostrar prendas y preparar solicitudes manuales por WhatsApp. El cliente revisa el mensaje y pulsa Enviar en WhatsApp; el sitio no guarda solicitudes, recibe archivos, cobra online ni confirma existencias.

## Archivos

- `index.html`: página para camiseta, polo y sudadera con solicitud por WhatsApp.
- `styles.css`: estilos adaptables a móvil y guías de talla.
- `preview.js`: selector interactivo de prendas, colores y tallas; prepara el texto de WhatsApp con color, talla, cantidad, diseño y referencia. Incluye 12 tonos anunciados para la camiseta TheMagicTouch y 8 para el polo JHK SPORTPIQUE; no afirma que haya existencias. Muestra medidas de polo publicadas por JHK y los datos A/B/C del gráfico ANBOR GOBI. En la camiseta el fabricante no publica medidas de ancho/largo en la ficha enlazada, así que no se inventan.
- `prendas-hero.png`: imagen de prendas.

La camiseta se muestra a 7 € con un diseño pequeño incluido y 1 € por cada diseño pequeño adicional, conforme a la configuración inicial solicitada. Polo, sudadera e impresión grande aparecen como «Por definir» y solo admiten consultas de presupuesto. El formulario requiere confirmar que abrirá WhatsApp con el borrador; el cliente debe revisarlo y pulsar Enviar. Los colores y medidas en pantalla son referencias visuales; las existencias y la compatibilidad con sublimación se confirman antes de producir. El teléfono de contacto se muestra en el pie de la página.

Las solicitudes llegan directamente al WhatsApp del propietario, pero no se almacenan en un panel de administración ni se sincronizan automáticamente con un ordenador. Para recepción persistente con historial y sincronización se necesita desplegar el servidor de la aplicación en un alojamiento compatible y configurar sus credenciales.
