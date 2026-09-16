const productPopup=document.createElement('dialog');
productPopup.className='product-popup';productPopup.setAttribute('aria-label','Detalhes do produto');
productPopup.innerHTML='<button class="popup-close" aria-label="Fechar produto">×</button><iframe title="Detalhes do produto"></iframe>';
document.body.append(productPopup);let productReturnFocus,previousOverflow;
function closeProduct(){productPopup.close();}
productPopup.querySelector('button').addEventListener('click',closeProduct);
productPopup.addEventListener('click',e=>{if(e.target===productPopup){const r=productPopup.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeProduct();}});
productPopup.addEventListener('close',()=>{productPopup.querySelector('iframe').src='about:blank';document.body.style.overflow=previousOverflow;productReturnFocus?.focus({preventScroll:true});});
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href*="produto.html?produto="],#open-specs');
 if(!link||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||e.button!==0)return;
 e.preventDefault();e.stopImmediatePropagation();
 const url=new URL(link.href||'./produto.html?produto=bansang',location.href);url.searchParams.set('modal','1');
 productReturnFocus=link;previousOverflow=document.body.style.overflow;productPopup.querySelector('iframe').src=url.href;productPopup.showModal();document.body.style.overflow='hidden';
},true);
window.addEventListener('message',e=>{if(e.origin===location.origin&&e.source===productPopup.querySelector('iframe').contentWindow&&e.data==='close-product')closeProduct();});
