const kindNames={camiseta:'CAMISETA',polo:'POLO',camisa:'CAMISA',sudadera:'SUDADERA'};
const colorCatalog={
  camiseta:[
    ['Blanco','#ffffff'],['Negro','#30312f'],['Gris','#aeb1b2'],['Aqua','#55b7c1'],['Naranja','#ed8135'],['Celeste','#85c5e8'],
    ['Marino','#273b57'],['Rojo','#c74642'],['Amarillo','#efd151'],['Lima','#92c944'],['Violeta','#79588d'],['Amarillo flúor','#e3eb38']
  ],
  polo:[
    ['Blanco','#ffffff'],['Negro','#30312f'],['Rojo','#c74642'],['Marino','#273b57'],['Azul royal','#3d5eaa'],['Aqua','#55b7c1'],['Naranja','#ed8135'],['Lima flúor','#92c944']
  ],
  camisa:[],sudadera:[]
};
const garmentSheets={'#f4f0e7':'garment-preview-framed.png','#a6ae98':'garment-preview-sage-framed.png','#efd151':'garment-preview-yellow-framed.png'};
const kindButtons=[...document.querySelectorAll('[data-kind]')];
const swatchRoot=document.getElementById('demo-swatches');
const quantity=document.getElementById('preview-quantity');
const designs=document.getElementById('small-designs');
const size=document.getElementById('design-size');
const stage=document.getElementById('garment-stage');
const garmentPhoto=document.getElementById('garment-photo');
let kind='camiseta';
let color='#ffffff';
function bounded(input,min,max){const n=Number.parseInt(input.value,10);input.value=String(Number.isFinite(n)?Math.min(max,Math.max(min,n)):min);return Number(input.value)}
function renderSwatches(){
  const options=colorCatalog[kind]||[];
  if(!options.some(([,hex])=>hex===color))color=options[0]?.[1]||'';
  swatchRoot.replaceChildren(...options.map(([name,hex])=>{
    const button=document.createElement('button');button.type='button';button.className='swatch';button.dataset.color=hex;
    button.title=name;button.setAttribute('aria-label',name);button.setAttribute('aria-pressed',String(hex===color));button.style.setProperty('--swatch',hex);
    const dot=document.createElement('i');const label=document.createElement('span');label.textContent=name;button.append(dot,label);
    button.addEventListener('click',()=>{color=hex;renderSwatches();update()});return button;
  }));
  document.getElementById('color-helper').textContent=options.length
    ? `${options.length} colores anunciados para esta prenda. Stock por confirmar; la foto es ilustrativa y el tono puede variar.`
    : 'Colores disponibles pendientes de confirmar con el proveedor para esta prenda.';
}
function update(){
  const qty=bounded(quantity,1,99), count=bounded(designs,1,10);
  document.getElementById('garment-label').textContent=kindNames[kind];
  const selectedColor=(colorCatalog[kind]||[]).find(([,hex])=>hex===color);
  document.getElementById('color-label').textContent=selectedColor?.[0].toLocaleUpperCase('es')||'COLOR POR CONFIRMAR';
  garmentPhoto.setAttribute('aria-label',`Previsualización ilustrativa de ${kindNames[kind].toLowerCase()}`);
  stage.style.setProperty('--garment-sheet',`url("${garmentSheets[color]||'garment-preview-framed.png'}")`);
  stage.classList.remove('kind-camiseta','kind-polo','kind-camisa','kind-sudadera');
  stage.classList.add(`kind-${kind}`);
  stage.classList.toggle('large',size.value==='large');
  document.getElementById('price-unit').textContent=`${qty} ${qty===1?'prenda':'prendas'}`;
  const priced=kind==='camiseta'&&size.value==='small';
  document.getElementById('price-value').textContent=priced?`${(qty*(7+Math.max(0,count-1))).toFixed(2).replace('.',',')} €`:'Por definir';
  document.getElementById('price-note').hidden=!priced;
  document.getElementById('no-price-note').hidden=priced;
}
kindButtons.forEach(button=>button.addEventListener('click',()=>{
  kind=button.dataset.kind;
  document.querySelectorAll('.category-card').forEach(card=>card.classList.toggle('selected',card.dataset.kind===kind));
  document.querySelectorAll('.choice').forEach(choice=>choice.classList.toggle('active',choice.dataset.kind===kind));
  renderSwatches();update();
}));
document.querySelectorAll('[data-qty]').forEach(button=>button.addEventListener('click',()=>{quantity.value=String(Number(quantity.value)+(button.dataset.qty==='plus'?1:-1));update()}));
document.querySelectorAll('[data-design]').forEach(button=>button.addEventListener('click',()=>{designs.value=String(Number(designs.value)+(button.dataset.design==='plus'?1:-1));update()}));
quantity.addEventListener('input',update);designs.addEventListener('input',update);size.addEventListener('change',update);
renderSwatches();update();
