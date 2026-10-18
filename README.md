# Tu diseño, tu prenda — solicitudes por correo

Demo estática adaptable a móvil para camisetas, polos y sudaderas personalizadas. El cliente elige prenda, color y tallas, adjunta un diseño y envía una solicitud por correo. No hay pago online; la forma de entrega se confirma por correo y el pago se mantiene en efectivo al recoger.

## Archivos

- `index.html`: contenido, formulario y flujo de solicitud por correo.
- `styles.css`: diseño adaptable a escritorio y móvil.
- `preview.js`: selector, precios, tallas, imágenes por color y preparación del pedido.
- `camiseta-colores.png`: hoja fotográfica con 12 camisetas, una por color seleccionable.
- `polo-colores.png`: hoja fotográfica con 8 polos, una por color seleccionable.
- `sudadera-blanca.png`: imagen de la sudadera blanca actualmente anunciada.
- `garment-preview-framed.png`: imágenes de categoría y portada existentes.
- `prendas-hero.png`: imagen de portada.

## Colores e imágenes

Cada color del selector muestra su propia foto de prenda. Las camisetas tienen 12 variantes, los polos 8 y la sudadera blanca 1. Las imágenes generadas son ilustrativas y no acreditan existencias, composición ni color exacto del proveedor. La compatibilidad de la prenda y el tono con sublimación debe confirmarse antes de producir; la sublimación tradicional funciona mejor en poliéster blanco o claro y no imprime tinta blanca.

## Configurador y precios

- Selección de camiseta, polo o sudadera, color y tallas anunciadas por los proveedores enlazados.
- Cantidad por talla, zona preferida de impresión, texto opcional y archivo adjunto.
- Estimación de camiseta de **7 €** con un diseño pequeño incluido; cada diseño pequeño adicional suma **1 € por prenda**.
- Los precios de polo, sudadera e impresión grande quedan pendientes de configurar, por lo que se solicita presupuesto. No hay descuentos por cantidad configurados.
- La guía muestra únicamente medidas publicadas en las fichas enlazadas; no se inventan medidas donde el fabricante no las publica.

## Envío de solicitudes por correo

El formulario envía la solicitud al correo configurado mediante FormSubmit. La primera solicitud activa el formulario: el responsable debe abrir el correo de activación enviado por FormSubmit. Hasta completar esa activación no se debe dar por verificada la recepción. FormSubmit documenta un límite combinado de 10 MB para archivos adjuntos y retención de solicitudes de hasta 30 días; revisa su [aviso de privacidad](https://formsubmit.co/privacy). El endpoint contiene la dirección receptora y es visible en el código fuente público.

La solicitud incluye la referencia, datos de contacto aportados, prenda, color, tallas/cantidades, diseño, texto, entrega, observaciones y total estimado. El archivo seleccionado se adjunta al correo. La página no guarda los pedidos ni tiene panel administrativo o sincronización con Windows.

## Antes de usar como tienda en producción

Confirma la dirección receptora, activa el formulario desde el correo de FormSubmit y realiza una prueba controlada. Configura la política de privacidad y los datos del responsable, disponibilidad y compatibilidad real de prendas/colores, medidas no publicadas, precios pendientes, recogida y cualquier coste/plazo de envío. No se muestran costes de proveedor.
