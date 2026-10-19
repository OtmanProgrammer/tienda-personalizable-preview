const kindNames = { camiseta: 'CAMISETA', polo: 'POLO', sudadera: 'SUDADERA' };
const colorCatalog = {
  camiseta: [
    ['Blanco', '#ffffff'], ['Negro', '#30312f'], ['Gris', '#aeb1b2'], ['Aqua', '#55b7c1'],
    ['Naranja', '#ed8135'], ['Celeste', '#85c5e8'], ['Marino', '#273b57'], ['Rojo', '#c74642'],
    ['Amarillo', '#efd151'], ['Lima', '#92c944'], ['Violeta', '#79588d'], ['Amarillo flúor', '#e3eb38']
  ],
  polo: [
    ['Blanco', '#ffffff'], ['Negro', '#30312f'], ['Rojo', '#c74642'], ['Marino', '#273b57'],
    ['Azul royal', '#3d5eaa'], ['Aqua', '#55b7c1'], ['Naranja', '#ed8135'], ['Lima flúor', '#92c944']
  ],
  sudadera: [['Blanco', '#ffffff']]
};
const colorPhotoSheets = {
  camiseta: { image: 'camiseta-colores-v2.png', columns: 4, rows: 3 },
  polo: { image: 'polo-colores.png', columns: 4, rows: 2 },
  sudadera: { image: 'sudadera-blanca.png', columns: 1, rows: 1 }
};
const sizeCatalog = {
  camiseta: {
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    note: 'TheMagicTouch anuncia estas seis tallas, pero no publica medidas de ancho y largo en la ficha consultada. No se inventan medidas.',
    rows: [],
    source: ['TheMagicTouch · Camiseta Técnica', 'https://www.themagictouch.es/productos/soportes/prendas/camisetas-unisex/camiseta-tecnica.html']
  },
  polo: {
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    note: 'JHK SPORTPIQUE · ancho plano de pecho × largo de la prenda, en centímetros.',
    rows: [['S', '52 × 70'], ['M', '54 × 72'], ['L', '56 × 74'], ['XL', '58 × 76'], ['XXL', '60 × 78']],
    source: ['JHK · SPORTPIQUE', 'https://www.jhktshirt.com/en/catalogo/datasheet/document/sportpique']
  },
  sudadera: {
    sizes: ['3/4', '5/6', '7/8', '9/11', '12/14', 'S', 'M', 'L', 'XL', 'XXL'],
    note: 'ANBOR GOBI · medidas en cm, conservadas como A/B/C según el esquema del fabricante. Revisa el gráfico original antes de escoger; tallas y stock dependen de disponibilidad.',
    rows: [['3/4', '42 · 36 · 35'], ['5/6', '48 · 39 · 40'], ['7/8', '54 · 42 · 45'], ['9/11', '58 · 46 · 50'], ['12/14', '61 · 49 · 55'], ['S', '70 · 52 · 62'], ['M', '73 · 55 · 64'], ['L', '75 · 58 · 68'], ['XL', '77 · 61 · 70'], ['XXL', '79 · 64 · 72']],
    source: ['ANBOR · GOBI', 'https://anbor.eu/sudadera-gobi']
  }
};
const kindButtons = [...document.querySelectorAll('[data-kind]')];
const swatchRoot = document.getElementById('demo-swatches');
const quantity = document.getElementById('preview-quantity');
const designs = document.getElementById('small-designs');
const designSize = document.getElementById('design-size');
const garmentSize = document.getElementById('garment-size');
const extraSizeRoot = document.getElementById('extra-size-rows');
const stage = document.getElementById('garment-stage');
const garmentPhoto = document.getElementById('garment-photo');
const designPreviewText = document.querySelector('.design-preview-text');
let kind = 'camiseta';
let color = '#ffffff';

function bounded(input, min, max) {
  const n = Number.parseInt(input.value, 10);
  input.value = String(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);
  return Number(input.value);
}

function collectSizeQuantities() {
  const quantities = new Map();
  const firstQty = bounded(quantity, 1, 99);
  quantities.set(garmentSize.value, firstQty);
  extraSizeRoot.querySelectorAll('.extra-size-row').forEach(row => {
    const size = row.querySelector('select').value;
    const qtyInput = row.querySelector('input');
    const qty = bounded(qtyInput, 0, 99);
    if (qty > 0) quantities.set(size, (quantities.get(size) || 0) + qty);
  });
  return sizeCatalog[kind].sizes
    .filter(size => quantities.has(size))
    .map(size => [size, quantities.get(size)]);
}

function addExtraSizeRow() {
  const row = document.createElement('div');
  row.className = 'extra-size-row';
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Otra talla solicitada');
  sizeCatalog[kind].sizes.forEach(size => {
    const option = document.createElement('option'); option.value = size; option.textContent = size;
    select.append(option);
  });
  const input = document.createElement('input');
  input.type = 'number'; input.min = '1'; input.max = '99'; input.value = '1'; input.inputMode = 'numeric';
  input.setAttribute('aria-label', 'Cantidad de esta otra talla');
  const remove = document.createElement('button');
  remove.type = 'button'; remove.textContent = '×'; remove.setAttribute('aria-label', 'Quitar esta talla');
  select.addEventListener('change', update); input.addEventListener('input', update);
  remove.addEventListener('click', () => { row.remove(); update(); });
  row.append(select, input, remove); extraSizeRoot.append(row);
  input.focus();
}

function renderSizeGuide() {
  const catalog = sizeCatalog[kind];
  extraSizeRoot.replaceChildren();
  garmentSize.replaceChildren(...catalog.sizes.map(value => {
    const option = document.createElement('option');
    option.value = value; option.textContent = value;
    return option;
  }));
  garmentSize.value = kind === 'sudadera' ? 'S' : (catalog.sizes[0] || '');
  document.getElementById('size-helper').textContent = `${catalog.sizes.length} tallas anunciadas; disponibilidad exacta por confirmar.`;
  document.getElementById('size-guide-note').textContent = catalog.note;
  const tableWrap = document.getElementById('size-table-wrap');
  tableWrap.replaceChildren();
  if (catalog.rows.length) {
    const table = document.createElement('table');
    const header = document.createElement('tr');
    header.append(Object.assign(document.createElement('th'), { textContent: 'Talla' }), Object.assign(document.createElement('th'), { textContent: kind === 'polo' ? 'Ancho × largo (cm)' : 'A/B/C (cm)' }));
    const thead = document.createElement('thead'); thead.append(header); table.append(thead);
    const tbody = document.createElement('tbody');
    catalog.rows.forEach(([size, measures]) => {
      const row = document.createElement('tr');
      row.append(Object.assign(document.createElement('td'), { textContent: size }), Object.assign(document.createElement('td'), { textContent: measures }));
      tbody.append(row);
    });
    table.append(tbody); tableWrap.append(table);
  }
  const link = document.getElementById('size-source');
  link.href = catalog.source[1]; link.textContent = `Consultar ficha de ${catalog.source[0]} ↗`;
}

function renderSwatches() {
  const options = colorCatalog[kind] || [];
  if (!options.some(([, hex]) => hex === color)) color = options[0]?.[1] || '';
  swatchRoot.replaceChildren(...options.map(([name, hex]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'swatch'; button.dataset.color = hex;
    button.title = `Seleccionar ${name}`; button.setAttribute('aria-label', `Seleccionar ${name}`);
    button.setAttribute('aria-pressed', String(hex === color)); button.classList.toggle('active', hex === color);
    button.style.setProperty('--swatch', hex);
    const dot = document.createElement('i'); const label = document.createElement('span');
    label.textContent = name; button.append(dot, label);
    button.addEventListener('click', () => { color = hex; renderSwatches(); update(); });
    return button;
  }));
  const selected = options.find(([, hex]) => hex === color)?.[0];
  const countLabel = options.length === 1 ? 'color anunciado' : 'colores anunciados';
  document.getElementById('color-helper').textContent = selected
    ? `Seleccionado: ${selected}. ${options.length} ${countLabel}; carta y existencias por confirmar. La compatibilidad del tono con sublimación se confirma antes de producir.`
    : 'El proveedor consultado no confirma una carta de colores para esta prenda.';
}

function update() {
  const count = bounded(designs, 1, 10);
  const sizeRows = collectSizeQuantities();
  const qty = sizeRows.reduce((sum, [, countForSize]) => sum + countForSize, 0);
  const selectedColor = (colorCatalog[kind] || []).find(([, hex]) => hex === color);
  document.getElementById('garment-label').textContent = kindNames[kind];
  designPreviewText.textContent = designText.value.trim().slice(0, 18) || 'TU DISEÑO';
  document.getElementById('garment-size-label').textContent = sizeRows.length > 1 ? 'TALLAS VARIAS' : `TALLA ${sizeRows[0]?.[0] || 'POR CONFIRMAR'}`;
  document.getElementById('color-label').textContent = (selectedColor?.[0] || 'COLOR POR CONFIRMAR').toLocaleUpperCase('es');
  garmentPhoto.setAttribute('aria-label', `Previsualización ilustrativa de ${kindNames[kind].toLowerCase()} en ${selectedColor?.[0] || 'color por confirmar'}`);
  const photoSheet = colorPhotoSheets[kind];
  const colorIndex = Math.max(0, (colorCatalog[kind] || []).findIndex(([, hex]) => hex === color));
  const column = colorIndex % photoSheet.columns;
  const row = Math.floor(colorIndex / photoSheet.columns);
  const xPercent = photoSheet.columns === 1 ? 50 : (column / (photoSheet.columns - 1)) * 100;
  const yPercent = photoSheet.rows === 1 ? 50 : (row / (photoSheet.rows - 1)) * 100;
  stage.style.setProperty('--garment-sheet', `url("${photoSheet.image}")`);
  stage.style.setProperty('--garment-sheet-size', `${photoSheet.columns * 100}% ${photoSheet.rows * 100}%`);
  stage.style.setProperty('--tile-x', `${xPercent}%`);
  stage.style.setProperty('--tile-y', `${yPercent}%`);
  stage.style.setProperty('--garment-color', selectedColor?.[1] || '#f4f0e7');
  stage.classList.remove('kind-camiseta', 'kind-polo', 'kind-sudadera');
  stage.classList.add(`kind-${kind}`);
  stage.classList.toggle('large', designSize.value === 'large');
  document.getElementById('price-unit').textContent = `${qty} ${qty === 1 ? 'prenda' : 'prendas'}`;
  const priced = kind === 'camiseta' && designSize.value === 'small';
  document.getElementById('price-value').textContent = priced ? `${(qty * (7 + Math.max(0, count - 1))).toFixed(2).replace('.', ',')} €` : 'Por definir';
  document.getElementById('price-note').hidden = !priced;
  document.getElementById('no-price-note').hidden = priced;
  updateOrderForm({ qty, count, selectedColor, priced, sizeRows });
}

const orderConsent = document.getElementById('email-consent');
const orderForm = document.getElementById('order-form');
const orderButton = document.getElementById('email-order');
const orderMessage = document.getElementById('order-message');
const orderEmailFields = {
  reference: document.getElementById('order-reference'),
  garment: document.getElementById('order-garment'),
  color: document.getElementById('order-color'),
  sizes: document.getElementById('order-sizes'),
  quantity: document.getElementById('order-quantity'),
  design: document.getElementById('order-design'),
  location: document.getElementById('order-location'),
  fileName: document.getElementById('order-file-name'),
  total: document.getElementById('order-total')
};
const orderStatus = document.getElementById('order-status');
const orderTitle = document.getElementById('order-title');
const orderIntro = document.getElementById('order-intro');
const orderFootnote = document.getElementById('order-footnote');
const orderButtonLabel = document.getElementById('order-button-label');
let orderReference = '';
const customerName = document.getElementById('customer-name');
const customerPhone = document.getElementById('customer-phone');
const customerEmail = document.getElementById('customer-email');
const deliveryMethod = document.getElementById('delivery-method');
const designText = document.getElementById('design-text');
const designFile = document.getElementById('design-file');
const orderNotes = document.getElementById('order-notes');

function updateOrderForm({ qty, count, selectedColor, priced, sizeRows }) {
  const isShirt = kind === 'camiseta';
  const isSmallPrint = designSize.value === 'small';
  const total = qty * (7 + Math.max(0, count - 1));
  const title = isShirt && isSmallPrint ? 'Pide tu camiseta' : 'Solicita tu presupuesto';
  orderTitle.textContent = title;
  orderButtonLabel.textContent = isShirt && isSmallPrint ? 'Enviar solicitud por correo' : 'Pedir presupuesto por correo';
  orderIntro.textContent = isShirt && isSmallPrint
    ? `La camiseta cuesta 7 € con un diseño pequeño incluido; cada diseño pequeño adicional suma 1 € por prenda. Total estimado: ${total.toFixed(2).replace('.', ',')} €.`
    : 'El precio de esta combinación está pendiente de configurar; solicita presupuesto y confirma disponibilidad antes de producir.';
  orderFootnote.textContent = deliveryMethod.value === 'Consultar envío'
    ? 'La solicitud y el archivo adjunto se enviarán por correo. Coste, zona, transportista y plazo de envío se confirman antes de producir; no hay pagos online.'
    : 'La solicitud y el archivo adjunto se enviarán por correo. La disponibilidad y el punto de recogida se confirman contigo; pago en efectivo al recoger.';
  const sizeSummary = sizeRows.map(([size, sizeQty]) => `${size} × ${sizeQty}`).join(', ');
  const name = customerName.value.trim();
  const emailValid = !customerEmail.value.trim() || customerEmail.checkValidity();
  const fileName = designFile.files?.[0]?.name || '';
  const designSummary = isSmallPrint ? `${count} diseño(s) pequeño(s)` : '1 diseño grande';
  const totalSummary = priced ? `${total.toFixed(2).replace('.', ',')} €` : 'Pendiente de presupuesto';
  orderEmailFields.reference.value = orderReference || 'Se asignará al enviar';
  orderEmailFields.garment.value = kindNames[kind];
  orderEmailFields.color.value = selectedColor?.[0] || 'Por confirmar';
  orderEmailFields.sizes.value = sizeSummary || 'Por confirmar';
  orderEmailFields.quantity.value = String(qty);
  orderEmailFields.design.value = designSummary;
  orderEmailFields.location.value = document.getElementById('print-location').value;
  orderEmailFields.fileName.value = fileName || 'No se adjuntó archivo';
  orderEmailFields.total.value = totalSummary;
  const lines = [
    `Hola, quiero solicitar ${isShirt && isSmallPrint ? 'un pedido de camiseta' : 'presupuesto de personalización'}.`,
    `Referencia de consulta: ${orderReference}`,
    `Responsable: ${name || 'por indicar'}.`,
    customerPhone.value.trim() ? `Teléfono adicional: ${customerPhone.value.trim()}.` : '',
    customerEmail.value.trim() ? `Correo: ${customerEmail.value.trim()}.` : '',
    `Prenda: ${kindNames[kind]}; color: ${selectedColor?.[0] || 'por confirmar'}; tallas y cantidades: ${sizeSummary}.`,
    `Diseño: ${designSummary}.`,
    `Zona preferida: ${document.getElementById('print-location').value}.`,
    designText.value.trim() ? `Texto para imprimir: ${designText.value.trim()}.` : '',
    fileName ? `Archivo adjunto: ${fileName}.` : 'No se adjuntó archivo de diseño.',
    `Entrega solicitada: ${deliveryMethod.value}.`,
    orderNotes.value.trim() ? `Observaciones: ${orderNotes.value.trim()}.` : '',
    `Total estimado: ${totalSummary}.`,
    deliveryMethod.value === 'Consultar envío'
      ? 'Confirma disponibilidad, coste y plazo del envío antes de producir. Entiendo que no hay pago online.'
      : 'Confirma disponibilidad y punto de recogida, por favor. Entiendo que pagaré en efectivo al recoger.'
  ].filter(Boolean);
  orderMessage.value = lines.join('\n');
  const enabled = orderConsent.checked && name.length > 0 && emailValid;
  orderButton.disabled = !enabled;
  orderButton.classList.toggle('is-disabled', !enabled);
  orderStatus.textContent = !name
    ? 'Escribe el nombre de la persona responsable.'
    : !emailValid
      ? 'Revisa el formato del correo electrónico.'
      : !orderConsent.checked
        ? 'Marca la casilla para continuar.'
        : 'Listo: al pulsar el botón, la solicitud se enviará por correo.';
}

orderConsent.addEventListener('change', update);
document.querySelectorAll('#customer-name,#customer-phone,#customer-email,#design-text,#order-notes').forEach(input => input.addEventListener('input', update));
document.getElementById('design-file').addEventListener('change', update);
document.querySelectorAll('#delivery-method,#print-location').forEach(input => input.addEventListener('change', update));
document.getElementById('add-size-row').addEventListener('click', addExtraSizeRow);
orderForm.addEventListener('submit', event => {
  const file = designFile.files?.[0];
  if (file && file.size > 10 * 1024 * 1024) {
    event.preventDefault();
    orderStatus.textContent = 'El archivo supera el límite de 10 MB. Elige uno más pequeño.';
    return;
  }
  if (!orderConsent.checked || !customerName.value.trim() || !customerEmail.checkValidity()) {
    event.preventDefault();
    orderStatus.textContent = 'Completa el nombre, revisa el correo y acepta el aviso para continuar.';
    return;
  }
  orderReference = `TD-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  update();
  orderStatus.textContent = 'Enviando tu solicitud por correo…';
  orderButton.disabled = true;
});

kindButtons.forEach(button => button.addEventListener('click', () => {
  kind = button.dataset.kind;
  document.querySelectorAll('.category-card').forEach(card => card.classList.toggle('selected', card.dataset.kind === kind));
  document.querySelectorAll('.choice').forEach(choice => choice.classList.toggle('active', choice.dataset.kind === kind));
  renderSwatches(); renderSizeGuide(); update();
}));
document.querySelectorAll('[data-qty]').forEach(button => button.addEventListener('click', () => { quantity.value = String(Number(quantity.value) + (button.dataset.qty === 'plus' ? 1 : -1)); update(); }));
document.querySelectorAll('[data-design]').forEach(button => button.addEventListener('click', () => { designs.value = String(Number(designs.value) + (button.dataset.design === 'plus' ? 1 : -1)); update(); }));
quantity.addEventListener('input', update); designs.addEventListener('input', update); designSize.addEventListener('change', update); garmentSize.addEventListener('change', update);
renderSwatches(); renderSizeGuide(); update();
if (new URLSearchParams(window.location.search).get('pedido') === 'recibido') {
  orderStatus.textContent = 'Solicitud enviada. Te responderemos por correo para confirmar precio, disponibilidad y entrega.';
}

