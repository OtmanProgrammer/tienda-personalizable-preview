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
const stage = document.getElementById('garment-stage');
const garmentPhoto = document.getElementById('garment-photo');
let kind = 'camiseta';
let color = '#ffffff';

function bounded(input, min, max) {
  const n = Number.parseInt(input.value, 10);
  input.value = String(Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min);
  return Number(input.value);
}

function renderSizeGuide() {
  const catalog = sizeCatalog[kind];
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
    ? `Seleccionado: ${selected}. ${options.length} ${countLabel}; muestras digitales aproximadas y existencias por confirmar.`
    : 'El proveedor consultado no confirma una carta de colores para esta prenda.';
}

function update() {
  const qty = bounded(quantity, 1, 99), count = bounded(designs, 1, 10);
  const selectedColor = (colorCatalog[kind] || []).find(([, hex]) => hex === color);
  document.getElementById('garment-label').textContent = kindNames[kind];
  document.getElementById('garment-size-label').textContent = `TALLA ${garmentSize.value || 'POR CONFIRMAR'}`;
  document.getElementById('color-label').textContent = (selectedColor?.[0] || 'COLOR POR CONFIRMAR').toLocaleUpperCase('es');
  garmentPhoto.setAttribute('aria-label', `Previsualización ilustrativa de ${kindNames[kind].toLowerCase()} en ${selectedColor?.[0] || 'color por confirmar'}`);
  stage.style.setProperty('--garment-sheet', 'url("garment-preview-framed.png")');
  stage.style.setProperty('--garment-color', selectedColor?.[1] || '#f4f0e7');
  stage.classList.remove('kind-camiseta', 'kind-polo', 'kind-sudadera');
  stage.classList.add(`kind-${kind}`);
  stage.classList.toggle('large', designSize.value === 'large');
  document.getElementById('price-unit').textContent = `${qty} ${qty === 1 ? 'prenda' : 'prendas'}`;
  const priced = kind === 'camiseta' && designSize.value === 'small';
  document.getElementById('price-value').textContent = priced ? `${(qty * (7 + Math.max(0, count - 1))).toFixed(2).replace('.', ',')} €` : 'Por definir';
  document.getElementById('price-note').hidden = !priced;
  document.getElementById('no-price-note').hidden = priced;
  updateOrderLink({ qty, count, selectedColor, priced });
}

const orderConsent = document.getElementById('whatsapp-consent');
const orderLink = document.getElementById('whatsapp-order');
const orderStatus = document.getElementById('order-status');
const orderTitle = document.getElementById('order-title');
const orderIntro = document.getElementById('order-intro');
const orderFootnote = document.getElementById('order-footnote');
const orderButtonLabel = document.getElementById('order-button-label');

function updateOrderLink({ qty, count, selectedColor, priced }) {
  const isShirt = kind === 'camiseta';
  const isSmallPrint = designSize.value === 'small';
  const total = qty * (7 + Math.max(0, count - 1));
  const reference = `TD-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const title = isShirt && isSmallPrint ? 'Pide tu camiseta' : 'Solicita tu presupuesto';
  orderTitle.textContent = title;
  orderButtonLabel.textContent = isShirt && isSmallPrint ? 'Solicitar camiseta por WhatsApp' : 'Pedir presupuesto por WhatsApp';
  orderIntro.textContent = isShirt && isSmallPrint
    ? `La camiseta cuesta 7 € con un diseño pequeño incluido; cada diseño pequeño adicional suma 1 € por prenda. Total estimado: ${total.toFixed(2).replace('.', ',')} €.`
    : 'El precio de esta combinación está pendiente de configurar; solicita presupuesto y confirma disponibilidad antes de producir.';
  orderFootnote.textContent = 'La página no guarda la solicitud ni sube archivos. Incluye tu nombre y adjunta el diseño en el chat. La disponibilidad y la recogida se confirman contigo; pago en efectivo al recoger.';
  const lines = [
    `Hola, quiero solicitar ${isShirt && isSmallPrint ? 'un pedido de camiseta' : 'presupuesto de personalización'}.`,
    `Referencia: ${reference}`,
    `Prenda: ${kindNames[kind]}; color: ${selectedColor?.[0] || 'por confirmar'}; talla: ${garmentSize.value}; cantidad: ${qty}.`,
    `Diseño: ${isSmallPrint ? `${count} pequeño${count === 1 ? '' : 's'}` : '1 grande'}.`,
    priced ? `Total estimado: ${total.toFixed(2).replace('.', ',')} €.` : 'Precio: pendiente de presupuesto.',
    'Adjuntaré el diseño en este chat. Confirma disponibilidad y punto de recogida, por favor. Entiendo que pagaré en efectivo al recoger.'
  ];
  orderLink.href = `https://wa.me/34614683073?text=${encodeURIComponent(lines.join('\n'))}`;
  const enabled = orderConsent.checked;
  orderLink.classList.toggle('is-disabled', !enabled);
  orderLink.setAttribute('aria-disabled', String(!enabled));
  orderStatus.textContent = enabled
    ? 'Listo: se abrirá WhatsApp con el borrador; pulsa Enviar allí para remitirlo.'
    : 'Marca la casilla para continuar.';
}

orderConsent.addEventListener('change', () => update());
orderLink.addEventListener('click', event => {
  if (!orderConsent.checked) event.preventDefault();
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
