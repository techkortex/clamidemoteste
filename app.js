'use strict';
const stores = {
 gabriel:{name:'Gabriel Monteiro da Silva',address:'Alameda Gabriel Monteiro da Silva, 1572',district:'Jardim Paulista, São Paulo',hours:'Segunda a sexta, 10h às 19h<br>Sábado, 10h às 15h<br>Domingo fechado',phone:'5511991863051'},
 pinheiros:{name:'Pinheiros',address:'Rua Teodoro Sampaio, 1650',district:'Pinheiros, São Paulo',hours:'Segunda a sábado, 10h às 19h<br>Domingo fechado',phone:'5511999074162'},
 lar:{name:'Shopping Lar Center',address:'Av. Otto Baumgart, 500 — Piso 1',district:'Vila Guilherme, São Paulo',hours:'Segunda a sábado, 10h às 21h<br>Domingos e feriados, 14h às 20h',phone:'5511999078176'},
 dd:{name:'Shopping D&D',address:'Av. das Nações Unidas, 12.555 — Térreo',district:'Brooklin Novo, São Paulo',hours:'Segunda a sexta, 10h às 21h<br>Sábado, 10h às 20h<br>Domingos e feriados, 14h às 19h',phone:'5511999078680'}
};
let selectedStore='gabriel', interest='', lastFocus=null;
const dialog=document.querySelector('#detail-dialog');
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function showDialog(html){lastFocus=document.activeElement;document.querySelector('#dialog-content').innerHTML=html;dialog.showModal();document.body.style.overflow='hidden';dialog.scrollTop=0;}
function closeDialog(){dialog.close();}
dialog.querySelector('.close-dialog').addEventListener('click',closeDialog);
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';document.querySelector('#dialog-content').innerHTML='';lastFocus?.focus({preventScroll:true});});
const featureData={
 forma:['Forma e proporção.','Tampo amplo e base metálica. Versões quadradas e retangulares.'],
 materiais:['Madeira ou laca.','Tampo em lâmina de madeira ou laca. Amostras disponíveis nas lojas.'],
 base:['Leveza no desenho. Presença no espaço.','Base metálica com acabamento em pintura e planos que se encontram sob o tampo.'],
 prato:['Tudo ao alcance do encontro.','Prato giratório opcional, também deslizante nas versões retangulares.'],
 formatos:['Uma mesa. Diferentes possibilidades.','Duas configurações quadradas e quatro retangulares. Confirme as medidas com a equipe.']
};
document.querySelectorAll('[data-feature]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-feature]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-expanded',active);b.querySelector('.feature-symbol').textContent=active?'−':'+';});
 const [title,copy]=featureData[button.dataset.feature];document.querySelector('#feature-copy').innerHTML=`<h3>${title}</h3><p>${copy}</p>`;
 window.dispatchEvent(new CustomEvent('bansang-feature',{detail:button.dataset.feature}));
}));
let squarePhoto=false;
document.querySelector('#alternate-photo').textContent='Ver versão quadrada';
document.querySelector('#alternate-photo').addEventListener('click',()=>{squarePhoto=!squarePhoto;const img=document.querySelector('#bansang-photo');img.dataset.focus='forma';img.src=squarePhoto?'./assets/bansang-2.jpg':'./assets/bansang-1.jpg';img.alt=squarePhoto?'Versão quadrada da Bansang com prato giratório e objetos sobre o tampo':'Versão retangular da mesa de jantar Bansang';document.querySelector('#alternate-photo').textContent=squarePhoto?'Ver versão retangular':'Ver versão quadrada';});
function renderProducts(category='Todos'){
 const collectionSlugs=["clean", "domo", "lago", "ayra", "buba", "cadeira-julia", "woody", "belize", "copan", "pomme2", "fruteira-chie", "aparador-zina"]; const list=products.filter(p=>collectionSlugs.includes(p.slug)&&(category==='Todos'||p.category===category));document.querySelector('#product-grid').innerHTML=list.map(p=>`<a class="product-card" href="./produto.html?produto=${p.slug}" aria-label="Conhecer ${p.type} ${p.name}"><div class="product-image"><img src="./assets/${p.image}" alt="${p.type} ${p.name} — fotografia oficial Clami" loading="lazy" width="800" height="800"><span class="round-plus" aria-hidden="true">+</span></div><h3>${p.name}</h3><p>${p.type} · ${p.designer}</p></a>`).join('');
 document.querySelector('#collection-status').textContent=`${list.length} ${list.length===1?'peça':'peças'} em ${category.toLowerCase()}`;
}
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-category]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);});renderProducts(button.dataset.category);}));
document.addEventListener('click',e=>{const b=e.target.closest('[data-consult]');if(b) window.open(contactUrl(b.dataset.consult),'_blank','noopener');});
document.querySelectorAll('[data-interest]').forEach(a=>{a.href=contactUrl(a.dataset.interest);a.target='_blank';a.rel='noopener';});
function renderStores(){
 const photos={gabriel:'showroom-gabriel.jpg',pinheiros:'showroom-teodoro.jpg',lar:'showroom-lar-center.jpg',dd:'showroom-dd.jpg'};
 document.querySelector('.store-layout').innerHTML=Object.entries(stores).map(([key,s])=>`<article class="store-card"><img src="./assets/${photos[key]}" alt="Loja Clami ${s.name}" loading="lazy" width="800" height="500"><div class="store-card-body"><p class="eyebrow">${s.district}</p><h3>${s.name}</h3><p>${s.address}</p><details><summary>Ver horários</summary><p>${s.hours}</p></details><a class="pill dark" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Clami '+s.address+', São Paulo')}" target="_blank" rel="noopener">Como chegar</a></div></article>`).join('');
}
document.querySelector('#open-specs').addEventListener('click',()=>showDialog(`<p class="eyebrow">Design por Sung Sook Kim</p><h2 id="dialog-title">Bansang, em detalhe.</h2><p>Base em metal pintado. Tampo em lâmina de madeira ou laca. Prato giratório opcional, com alternativa deslizante para as versões retangulares.</p><table class="spec-table"><caption>Configurações publicadas pela Clami</caption><thead><tr><th>Formato</th><th>Largura × profundidade × altura</th></tr></thead><tbody><tr><td>Quadrada</td><td>1600 × 1600 × 740</td></tr><tr><td>Quadrada</td><td>1800 × 1800 × 740</td></tr><tr><td>Retangular</td><td>2400 × 1800 × 740</td></tr><tr><td>Retangular</td><td>2800 × 1200 × 740</td></tr><tr><td>Retangular</td><td>3000 × 1400 × 740</td></tr><tr><td>Retangular</td><td>3000 × 1800 × 740</td></tr></tbody></table><p class="model-note">A ficha online não explicita a unidade dessas medidas. Confirme as dimensões e os acabamentos com a Clami antes de especificar seu projeto.</p><p class="model-note">A experiência 3D desta demonstração é uma interpretação ilustrativa baseada nas fotografias. Não é um modelo técnico ou arquivo 3D oficial da Clami.</p><div class="product-actions"><button class="pill dark" data-consult="Mesa de jantar Bansang">Consultar a Clami</button><a class="pill outline" href="https://clami.com.br/produto/bansang" target="_blank" rel="noopener">Ver ficha oficial</a></div>`));
document.querySelector('#editorial-grid').innerHTML=`<article class="editorial-card"><a href="https://www.youtube.com/watch?v=QPPfrP5wsMo" target="_blank" rel="noopener" aria-label="Assistir Coleção Himalaya no YouTube da Clami"><img src="./assets/himalaya-film-cover.png" alt="Capa ilustrativa inspirada na cena do filme Himalaya" loading="lazy" width="1600" height="800"></a><h3>Himalaya. O desenho do conforto.</h3><p>Coleção de Ricardo Bello Dias.</p><button class="text-link" data-video="QPPfrP5wsMo" data-video-title="Coleção Himalaya">Assistir ao filme <span aria-hidden="true">▷</span></button></article><article class="editorial-card"><a href="https://www.youtube.com/watch?v=PhouN5vVWAA" target="_blank" rel="noopener" aria-label="Assistir ao filme Clami 50 anos"><img src="./assets/anniversary-original.jpg" alt="Depoimento no documentário dos 50 anos da Clami" loading="lazy" width="1280" height="720"><span class="film-cover-title" aria-hidden="true">Clami<span>50 anos</span></span></a><h3>Uma história que continua.</h3><p>O filme dos 50 anos da Clami.</p><button class="text-link" data-video="PhouN5vVWAA" data-video-title="Clami 50 anos">Assistir ao filme <span aria-hidden="true">▷</span></button></article>`;
document.querySelector('#editorial-grid').addEventListener('click',e=>{const b=e.target.closest('[data-video]');if(!b)return;showDialog(`<h2 id="dialog-title">${b.dataset.videoTitle}</h2><iframe style="width:100%;aspect-ratio:16/9;border:0" title="${b.dataset.videoTitle} — canal oficial Clami" src="https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="model-note">Vídeo do canal oficial Clamioficial. Se o player estiver indisponível, <a href="https://www.youtube.com/watch?v=${b.dataset.video}" target="_blank" rel="noopener">assista no YouTube</a>.</p>`);});
document.querySelector('#open-sources').addEventListener('click',()=>showDialog(`<h2 id="dialog-title">Fontes e informações.</h2><p>Esta é uma demonstração independente de conceito para apresentação à Clami. As fotografias, o logotipo e a fonte foram obtidos no site oficial da marca.</p><ul class="source-list"><li><a href="https://clami.com.br" target="_blank" rel="noopener">Clami — site oficial e catálogo</a></li><li><a href="https://clami.com.br/produto/bansang" target="_blank" rel="noopener">Bansang — fotografias, materiais e configurações</a></li><li><a href="https://dwsemanadedesign.com.br/festival/dwsp2026/eventos/cafe-dw-talks-na-clami-com-lancamento-da-mesa-de-jantar-bansang/" target="_blank" rel="noopener">DW! 2026 — autoria de Sung Sook Kim</a></li><li><a href="https://clami.com.br/lojas/" target="_blank" rel="noopener">Lojas — endereços, horários e WhatsApp</a></li><li><a href="https://br.linkedin.com/company/clami" target="_blank" rel="noopener">Perfil corporativo — fundação em 1969</a></li><li><a href="https://www.youtube.com/@Clamioficial" target="_blank" rel="noopener">Canal Clamioficial no YouTube</a></li><li><a href="https://www.instagram.com/clamioficial/" target="_blank" rel="noopener">Instagram oficial</a> e <a href="https://www.facebook.com/ClamiOficial/" target="_blank" rel="noopener">Facebook oficial</a></li></ul><p class="model-note">Consulta: 14 de setembro de 2026. Preços e disponibilidade devem ser confirmados com a marca. Os links de contato abrem os canais oficiais, sem enviar mensagens automaticamente. A representação 3D é ilustrativa e não substitui desenhos técnicos.</p>`));
const menuButton=document.querySelector('.menu-button'),mobileMenu=document.querySelector('#mobile-menu');
function setMenu(open){menuButton.setAttribute('aria-expanded',open);menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');mobileMenu.hidden=!open;}
menuButton.addEventListener('click',()=>setMenu(mobileMenu.hidden));mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileMenu.hidden){setMenu(false);menuButton.focus();}});
renderProducts();renderStores();

const slides=[{image:'hero-patou.jpg',label:'Patou',alt:'Ambiente Clami com sofá Patou'}, {image:'hero-himalaya.jpg',label:'Himalaya',alt:'Ambiente Clami com a coleção Himalaya'}, {image:'hero-mondrian.jpg',label:'Mondrian',alt:'Coleção Mondrian da Clami'}];
let slideIndex=0;
function showSlide(index){slideIndex=(index+slides.length)%slides.length;const s=slides[slideIndex];const img=document.querySelector('#hero-image');img.src='./assets/'+s.image;img.alt=s.alt;document.querySelector('#slide-caption').textContent=s.label;document.querySelectorAll('[data-slide]').forEach((b,i)=>b.setAttribute('aria-pressed',i===slideIndex));}
document.querySelectorAll('[data-slide]').forEach(b=>b.addEventListener('click',()=>showSlide(Number(b.dataset.slide))));
let touchStart=0;
document.querySelector('.hero-photo').addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});
document.querySelector('.hero-photo').addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchStart;if(Math.abs(distance)>50)showSlide(slideIndex+(distance<0?1:-1));},{passive:true});
showSlide(0);

// Start automatically; only explicit pause or a hidden page suspends playback.
const carousel=document.querySelector('.hero-photo');

let playing=true, carouselTimer;
function syncAutoplay(){clearInterval(carouselTimer);document.querySelector('#slide-caption').setAttribute('aria-live',playing?'off':'polite');if(playing&&!document.hidden)carouselTimer=setInterval(()=>showSlide(slideIndex+1),5500);}




document.addEventListener('visibilitychange',syncAutoplay);

slides.forEach(s=>{const preload=new Image();preload.src='./assets/'+s.image;});
syncAutoplay();
const atelierGroups=[{label:'01 / Sofá',slugs:['adana','aurora']},{label:'02 / Poltrona',slugs:['alma','arco']},{label:'03 / Mesa de centro',slugs:['aral','pisac','santiago']}];
const composition=['adana','alma','aral'];
function renderAtelier(){
 document.querySelector('#mood-pieces').innerHTML=composition.map((slug,i)=>{const p=products.find(p=>p.slug===slug);return `<a class="mood-piece mood-piece-${i}" href="./produto.html?produto=${slug}"><img src="./assets/${p.image}" alt="${p.type} ${p.name}"><span>${String(i+1).padStart(2,'0')} / ${p.name}</span></a>`;}).join('');
 document.querySelector('#atelier-choices').innerHTML=atelierGroups.map((group,i)=>`<fieldset><legend>${group.label}</legend><div class="atelier-swatches">${group.slugs.map(slug=>{const p=products.find(p=>p.slug===slug);return `<button data-composition="${i}" data-slug="${slug}" aria-pressed="${composition[i]===slug}" aria-label="Selecionar ${p.type} ${p.name}"><span>${p.name}</span></button>`;}).join('')}</div></fieldset>`).join('');
 document.querySelector('#atelier-explore').href='./produto.html?produto='+composition[0];
}
document.querySelector('#atelier-choices').addEventListener('click',e=>{const b=e.target.closest('[data-composition]');if(!b)return;composition[Number(b.dataset.composition)]=b.dataset.slug;renderAtelier();document.querySelector(`[data-composition="${b.dataset.composition}"][data-slug="${b.dataset.slug}"]`).focus({preventScroll:true});});
renderAtelier();
