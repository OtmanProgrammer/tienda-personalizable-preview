const kindNames={camiseta:'CAMISETA',polo:'POLO',camisa:'CAMISA',sudadera:'SUDADERA'};
const swatchNames={'#f4f0e7':'BLANCO NATURAL','#a6ae98':'VERDE SALVIA','#efd151':'AMARILLO VIVO'};
const garmentSheets={'#f4f0e7':'garment-preview-sprite.png','#a6ae98':'garment-preview-sage.png','#efd151':'garment-preview-yellow.png'};
const kindButtons=[...document.querySelectorAll('[data-kind]')];
const quantity=document.getElementById('preview-quantity');
const designs=document.getElementById('small-designs');
const size=document.getElementById('design-size');
const stage=document.getElementById('garment-stage');
const garmentPhoto=document.getElementById('garment-photo');
let kind='camiseta';
let color='#f4f0e7';
function bounded(input,min,max){const n=Number.parseInt(input.value,10);input.value=String(Number.isFinite(n)?Math.min(max,Math.max(min,n)):min);return Number(input.value)}
function update(){
  const qty=bounded(quantity,1,99), count=bounded(designs,1,10);
  document.getElementById('garment-label').textContent=kindNames[kind];
  document.getElementById('color-label').textContent=swatchNames[color];
  garmentPhoto.setAttribute('aria-label',`Previsualización de ${kindNames[kind].toLowerCase()}`);
  stage.style.setProperty('--garment-sheet',`url("${garmentSheets[color]}")`);
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
  update();
}));
document.querySelectorAll('.swatch').forEach(button=>button.addEventListener('click',()=>{
  color=button.dataset.color;
  document.querySelectorAll('.swatch').forEach(swatch=>swatch.classList.toggle('active',swatch===button));
  update();
}));
document.querySelectorAll('[data-qty]').forEach(button=>button.addEventListener('click',()=>{quantity.value=String(Number(quantity.value)+(button.dataset.qty==='plus'?1:-1));update()}));
document.querySelectorAll('[data-design]').forEach(button=>button.addEventListener('click',()=>{designs.value=String(Number(designs.value)+(button.dataset.design==='plus'?1:-1));update()}));
quantity.addEventListener('input',update);designs.addEventListener('input',update);size.addEventListener('change',update);
update();
