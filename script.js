// Catalogue product titles and photos are returned together by DummyJSON.
// This is a demo catalogue, NOT verified South African supplier inventory.
const INITIAL=[];
const IMAGE_CATALOGUE='https://dummyjson.com/products?limit=0&select=id,title,description,category,thumbnail,images,price,brand';
const CURATED_CATEGORIES=new Set(['smartphones','laptops','tablets','mobile-accessories','kitchen-accessories','home-decoration','furniture','beauty','fragrances','skin-care','mens-watches','womens-watches','sunglasses','sports-accessories','automotive','motorcycle','mens-shoes','womens-shoes','womens-bags','tops','mens-shirts','womens-dresses']);
const categoryName=c=>c.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ');
// Illustrative SA retail estimates by department, NOT live competitor quotes.
// Preserve the catalogue's actual product name and image together.
const PRICE_BANDS={
 'smartphones':[899,4499], 'laptops':[2999,11999], 'tablets':[1099,4999],
 'mobile-accessories':[99,699], 'kitchen-accessories':[99,899],
 'home-decoration':[129,1299], 'furniture':[599,5999],
 'beauty':[79,599], 'fragrances':[149,1299], 'skin-care':[79,599],
 'mens-watches':[249,1499], 'womens-watches':[249,1499],
 'sunglasses':[99,699], 'sports-accessories':[129,1199],
 'automotive':[99,999], 'motorcycle':[149,1499],
 'mens-shoes':[249,1299], 'womens-shoes':[249,1299],
 'womens-bags':[199,1499], 'tops':[99,499],
 'mens-shirts':[149,699], 'womens-dresses':[199,999]
};
const seededPrice=item=>{
 const [floor,ceiling]=PRICE_BANDS[item.category]||[149,1499];
 // Convert demo catalogue's USD-like numeric price to an illustrative rand value.
 const indicative=Math.round(Number(item.price||20)*17.5);
 const bounded=Math.max(floor,Math.min(ceiling,indicative));
 return {price:Math.round(bounded/10)*10-1};
};
async function loadPhotoMatchedCatalogue(){
 const note=document.querySelector('#catalogueStatus');
 try{
  const response=await fetch(IMAGE_CATALOGUE,{cache:'no-store'});
  if(!response.ok)throw Error('Catalogue service unavailable');
  const data=await response.json();
  const entries=(data.products||[]).filter(p=>CURATED_CATEGORIES.has(p.category)&&p.thumbnail&&p.title).slice(0,90);
  if(!entries.length)throw Error('No matching items');
  const matched=entries.map(item=>{const v=seededPrice(item);return {
   id:'catalogue-'+item.id,name:item.title,category:categoryName(item.category),price:v.price,
   description:(item.brand?item.brand+' · ':'')+(item.description||'')+' | Demonstration listing: supplier, landed cost and retail price unverified.',
   image:item.thumbnail,photoVerified:true,source:'DummyJSON demo catalogue',supplier:'https://dummyjson.com/products/'+item.id
  }});
  // Admin-added products stay saved; demo products refresh from the same source as their photos.
  products=[...matched,...products.filter(p=>String(p.id).startsWith('custom-'))];
  categories();render();renderCart();
  if(note)note.textContent=`${matched.length} matched product photographs loaded. Prices are illustrative retail estimates, not verified competitor or supplier quotes.`;
 }catch(err){
  if(note)note.textContent='Live photo catalogue could not load. Connect to the internet and refresh. No unrelated substitute photos will be shown.';
  products=products.filter(p=>String(p.id).startsWith('custom-'));categories();render();renderCart();
 }
}
const $=s=>document.querySelector(s);const KEY='sashopping_photo_matched_v2';const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};let products=load(KEY,INITIAL),cart=load('sashopping_cart_v1',{}),pages=load('sashopping_pages_v1',[]),activeCat='all';const money=n=>'R'+Number(n).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2});const save=()=>{localStorage.setItem(KEY,JSON.stringify(products));localStorage.setItem('sashopping_cart_v1',JSON.stringify(cart));localStorage.setItem('sashopping_pages_v1',JSON.stringify(pages))};const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function categories(){let cats=[...new Set(products.map(p=>p.category))].sort();$('#category').innerHTML='<option value="all">All categories</option>'+cats.map(c=>`<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join('');$('#category').value=cats.includes(activeCat)?activeCat:'all'}
function render(){const q=$('#search').value.trim().toLowerCase();let items=products.filter(p=>(activeCat==='all'||p.category===activeCat)&&(p.name+' '+p.category+' '+p.description).toLowerCase().includes(q));let sort=$('#sort').value;if(sort==='low')items.sort((a,b)=>a.price-b.price);if(sort==='high')items.sort((a,b)=>b.price-a.price);$('#products').innerHTML=items.length?items.map(p=>`<article class="product"><div class="product-photo">${p.image?`<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.photoVerified?p.name:'Product photograph supplied with this product catalogue record')}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.hidden=false"><div class="photo-empty" hidden>Photograph unavailable</div>`:`<div class="photo-empty">Photograph not supplied</div>`}<span class="tag">${p.source?'CATALOGUE PHOTO':'YOUR PRODUCT'}</span>${''}</div><div class="product-body"><span class="categorylabel">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description)}</p><div class="price">${money(p.price)}</div><button data-add="${escapeHTML(p.id)}">Add to bag ↗</button></div></article>`).join(''):'<div class="empty">No matching products. Try another search.</div>';document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>add(b.dataset.add));}
function add(id){cart[id]=(cart[id]||0)+1;save();renderCart();openDrawer()}function renderCart(){let count=Object.values(cart).reduce((a,b)=>a+b,0),total=0;$('#cartCount').textContent=count;let rows=Object.entries(cart).map(([id,qty])=>{let p=products.find(x=>x.id===id);if(!p)return '';total+=p.price*qty;return `<div class="cartrow"><div><h4>${escapeHTML(p.name)}</h4><small>${money(p.price)} each</small><div class="qty"><button data-qty="${escapeHTML(id)}" data-delta="-1">−</button>${qty}<button data-qty="${escapeHTML(id)}" data-delta="1">+</button></div></div><b>${money(p.price*qty)}</b></div>`}).join('');$('#cartItems').innerHTML=rows||'<div class="empty">Your bag is empty.</div>';$('#cartTotal').textContent=money(total);document.querySelectorAll('[data-qty]').forEach(b=>b.onclick=()=>{let id=b.dataset.qty;cart[id]+=Number(b.dataset.delta);if(cart[id]<=0)delete cart[id];save();renderCart()});$('#checkoutBtn').disabled=count===0}
function openDrawer(){$('#shade').hidden=false;$('#drawer').classList.add('open');$('#drawer').setAttribute('aria-hidden','false')}function closeDrawer(){$('#shade').hidden=true;$('#drawer').classList.remove('open');$('#drawer').setAttribute('aria-hidden','true')}
$('#cartBtn').onclick=openDrawer;$('#closeCart').onclick=closeDrawer;$('#shade').onclick=closeDrawer;$('#checkoutBtn').onclick=()=>{closeDrawer();$('#checkout').hidden=false};$('#closeCheckout').onclick=()=>$('#checkout').hidden=true;$('#checkoutForm').onsubmit=async e=>{e.preventDefault();const msg=$('#checkoutMsg');msg.textContent='Checking approved products and payment availability…';try{const r=await fetch('/api/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart})});const q=await r.json();if(!r.ok)throw Error(q.error||'Checkout unavailable');msg.textContent=`Approved total: USD ${q.totalUSD} (R${q.totalZAR} reference). Confirm the USD amount and any conversion fees with PayPal.`;const old=document.querySelector('#paypal-buttons');if(old)old.remove();const div=document.createElement('div');div.id='paypal-buttons';msg.after(div);if(!window.paypal){const cfg=await (await fetch('/api/config')).json();if(!cfg.clientId)throw Error('PayPal sandbox credentials not configured');await new Promise((resolve,reject)=>{const sc=document.createElement('script');sc.src='https://www.paypal.com/sdk/js?client-id='+encodeURIComponent(cfg.clientId)+'&currency=USD&intent=capture';sc.onload=resolve;sc.onerror=reject;document.head.appendChild(sc)});}window.paypal.Buttons({createOrder:async()=>{const r=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart,customer:Object.fromEntries(new FormData($('#checkoutForm'))),quoteToken:q.quoteToken})});const d=await r.json();if(!r.ok)throw Error(d.error||'Order creation failed');return d.id},onApprove:async data=>{const r=await fetch('/api/orders/'+encodeURIComponent(data.orderID)+'/capture',{method:'POST'});const d=await r.json();if(!r.ok)throw Error(d.error||'Capture not confirmed');msg.textContent='Payment confirmed. Order reference: '+d.orderReference;div.remove();cart={};save();renderCart()},onError:()=>{msg.textContent='PayPal could not complete the payment. Please try again.'},onCancel:()=>{msg.textContent='Payment cancelled. No order confirmed.'}}).render('#paypal-buttons')}catch(err){msg.textContent=err.message}};$('#adminBtn').onclick=()=>{$('#admin').hidden=false;renderAdmin()};$('#closeAdmin').onclick=()=>$('#admin').hidden=true;$('#closePage').onclick=()=>$('#pageView').hidden=true;
$('#category').onchange=e=>{activeCat=e.target.value;render()};$('#sort').onchange=render;$('#search').oninput=render;$('#searchBtn').onclick=()=>{location.hash='shop';render()};document.querySelectorAll('[data-cat]').forEach(a=>a.onclick=()=>{activeCat=a.dataset.cat;$('#category').value=activeCat;render()});$('#bundleLink').onclick=()=>{activeCat='Bundles';$('#category').value=activeCat;render()};
$('#productForm').onsubmit=e=>{e.preventDefault();let d=new FormData(e.target),price=Number(d.get('price'));if(!Number.isFinite(price)||price<0)return;products.push({id:'custom-'+Date.now(),name:String(d.get('name')).trim(),category:String(d.get('category')).trim(),price,description:String(d.get('description')).trim()||'New product',image:String(d.get('image')).trim(),photoVerified:false});save();e.target.reset();categories();render();renderAdmin()};
function renderAdmin(){$('#adminProducts').innerHTML='<h3>Products ('+products.length+')</h3>'+products.map(p=>`<div class="adminrow"><span>${escapeHTML(p.name)} · ${money(p.price)}</span><button data-delete="${escapeHTML(p.id)}">Remove</button></div>`).join('');document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{if(!confirm('Remove this product?'))return;products=products.filter(p=>p.id!==b.dataset.delete);delete cart[b.dataset.delete];save();categories();render();renderCart();renderAdmin()});renderPages()}
$('#pageForm').onsubmit=e=>{e.preventDefault();let d=new FormData(e.target);pages.push({id:'page-'+Date.now(),title:String(d.get('title')).trim(),content:String(d.get('content')).trim()});save();e.target.reset();renderPages()};function renderPages(){$('#pagesList').innerHTML='<h3>Custom pages</h3>'+pages.map(p=>`<div class="adminrow"><button class="textbtn" data-page="${escapeHTML(p.id)}">${escapeHTML(p.title)}</button><button data-removepage="${escapeHTML(p.id)}">Remove</button></div>`).join('');document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{let p=pages.find(x=>x.id===b.dataset.page);$('#pageTitle').textContent=p.title;$('#pageContent').textContent=p.content;$('#admin').hidden=true;$('#pageView').hidden=false});document.querySelectorAll('[data-removepage]').forEach(b=>b.onclick=()=>{pages=pages.filter(p=>p.id!==b.dataset.removepage);save();renderPages()})}
categories();render();renderCart();

loadPhotoMatchedCatalogue();
