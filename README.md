# Tu diseño, tu prenda — solicitudes por WhatsApp

Demo estática adaptable a móvil para camisetas, polos y sudaderas personalizadas. El cliente configura la prenda, talla y cantidad, prepara los datos de diseño y abre un borrador en WhatsApp. La solicitud solo se envía cuando pulsa **Enviar** en WhatsApp.

## Archivos

- `index.html`: contenido, formulario y flujo de solicitud.
- `styles.css`: diseño adaptable a escritorio y móvil.
- `preview.js`: selector de prendas y colores, guía de tallas, cálculo de camiseta, tallas múltiples y creación del borrador de WhatsApp.
- `garment-preview-framed.png`: imagen ilustrativa del configurador.
- `prendas-hero.png`: imagen de portada.

## Funciones del configurador

- Selección de camiseta, polo o sudadera, color y tallas anunciadas por los proveedores enlazados.
- Cantidad por talla: se pueden añadir varias tallas en una misma solicitud.
- Zona preferida para impresión, texto para imprimir (aparece abreviado en la vista ilustrativa), nombre de archivo de diseño y observaciones.
- Nombre responsable obligatorio; teléfono y correo opcionales.
- Recogida a convenir o consulta de envío. Los gastos, zona, transportista y plazo de envío se cotizan aparte.
- Estimación de camiseta de **7 €** con un diseño pequeño incluido; cada diseño pequeño adicional suma **1 € por prenda**. Los precios de polo, sudadera e impresión grande quedan pendientes de configurar, por lo que solo se solicita presupuesto.

La guía muestra únicamente medidas publicadas en las fichas enlazadas; la ficha consultada para la camiseta no publica ancho y largo, así que esos datos no se inventan. La carta de colores y las existencias se deben confirmar antes de producir. La sublimación tradicional funciona mejor en prendas blancas o claras con alto contenido de poliéster y no imprime tinta blanca; la compatibilidad de cada prenda y color debe confirmarse.

## Límites de esta demo

Esta página estática no almacena pedidos, no envía archivos, no procesa pagos online y no tiene un panel administrativo ni sincronización con Windows. El archivo elegido permanece en el dispositivo del cliente y debe adjuntarse manualmente en WhatsApp. La referencia identifica la consulta en ese borrador; no confirma un pedido. El pago está previsto en efectivo al recoger.

Antes de usarla como tienda en producción hay que definir las medidas no publicadas, catálogo y compatibilidad real de prendas/colores, precios pendientes, política de privacidad, datos definitivos de recogida y cualquier coste/plazo de envío. No hay descuentos por cantidad configurados ni se muestran costes de proveedor.

