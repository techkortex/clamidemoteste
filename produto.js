const params=new URLSearchParams(location.search),slug=params.get('produto');
const product=products.find(p=>p.slug===slug),root=document.querySelector('#produto');
const embedded=params.get('modal')==='1';document.body.classList.toggle('product-embedded',embedded);
if(!product){root.innerHTML='<h1>Peça não encontrada.</h1><a href="./index.html#colecao">Voltar à coleção</a>';}else{
 document.title=product.name+' — Clami';
 const has3D=product.slug==='bansang';
 const description=product.description.startsWith(product.type+' '+product.name+'. Consulte')?'':product.description;
 root.innerHTML=`<div class="product-salon"><div class="salon-visual"><div class="salon-caption"><span>CLAMI / COLEÇÃO</span><span id="salon-mode">FOTOGRAFIA</span></div><div id="salon-media"><img src="./assets/${product.detailImage||product.image}" alt="${product.type} ${product.name}"></div><div class="salon-tools"><button id="salon-photo" aria-pressed="true">Fotografia</button><button id="salon-3d" aria-pressed="false" ${has3D?'':'disabled'}>${has3D?'Explorar em 3D':'3D · Em breve'}</button></div></div><div class="salon-copy"><p class="salon-category">${product.type}</p><h1>${product.name}</h1><p class="salon-designer">${product.designer==='Curadoria Clami'?'Curadoria Clami':'Design por '+product.designer}</p>${description?`<p class="salon-description">${description}</p>`:''}<div class="salon-details"><span>Acabamentos & medidas</span><p>Consulte as opções com a Clami.</p></div><a class="salon-contact" href="${contactUrl(product.type+' '+product.name)}" target="_blank" rel="noopener">Conversar com a Clami</a><p class="salon-footnote">${has3D?'Modelo 3D ilustrativo.':'Visualização 3D e AR em breve.'}</p><a class="salon-stores" href="./index.html#lojas" target="_top">Conheça nossas lojas</a></div></div>`;
 const media=document.querySelector('#salon-media'),photoMarkup=media.innerHTML;
 function showMode(is3D){media.innerHTML=is3D?'<iframe title="Bansang em 3D — arraste para girar" src="./bansang-viewer.html?v=23"></iframe>':photoMarkup;document.querySelector('#salon-mode').textContent=is3D?'MODELO 3D':'FOTOGRAFIA';document.querySelector('#salon-photo').setAttribute('aria-pressed',!is3D);document.querySelector('#salon-3d').setAttribute('aria-pressed',is3D);}
 document.querySelector('#salon-photo').addEventListener('click',()=>showMode(false));
 document.querySelector('#salon-3d').addEventListener('click',()=>showMode(true));
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&embedded)parent.postMessage('close-product',location.origin);});

window.addEventListener('message',e=>{if(embedded&&e.origin===location.origin&&e.source===document.querySelector('#salon-media iframe')?.contentWindow&&e.data==='close-product')parent.postMessage('close-product',location.origin);});
