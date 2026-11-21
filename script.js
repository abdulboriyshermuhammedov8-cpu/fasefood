const products = [
 {id:1,name:"Cheese Burger",cat:"Burger",price:32000,emoji:"🍔",desc:"Mol go‘shti, pishloq, maxsus sous",tag:"TOP"},
 {id:2,name:"Double Burger",cat:"Burger",price:42000,emoji:"🍔",desc:"Ikki kotlet, ikki karra lazzat",tag:""},
 {id:3,name:"Chicken Burger",cat:"Burger",price:29000,emoji:"🍔",desc:"Qarsildoq tovuq va yangi sabzavot",tag:""},
 {id:4,name:"Maxi Lavash",cat:"Lavash",price:35000,emoji:"🌯",desc:"Go‘sht, fri, pomidor va sous",tag:"TOP"},
 {id:5,name:"Mini Lavash",cat:"Lavash",price:27000,emoji:"🌯",desc:"Yengil va mazali lavash",tag:""},
 {id:6,name:"Pishloqli Pizza",cat:"Pizza",price:58000,emoji:"🍕",desc:"Pishloq, pomidor va maxsus sous",tag:""},
 {id:7,name:"Pepperoni Pizza",cat:"Pizza",price:65000,emoji:"🍕",desc:"Pepperoni va mo‘l pishloq",tag:""},
 {id:8,name:"Kartoshka Fri",cat:"Fri",price:15000,emoji:"🍟",desc:"Qarsildoq kartoshka fri",tag:""},
 {id:9,name:"Naggets",cat:"Fri",price:22000,emoji:"🍗",desc:"6 dona tovuqli naggets",tag:""},
 {id:10,name:"Coca-Cola",cat:"Ichimlik",price:10000,emoji:"🥤",desc:"Sovuq ichimlik, 0.5 L",tag:""},
 {id:11,name:"Muzli choy",cat:"Ichimlik",price:12000,emoji:"🧋",desc:"Yoqimli va salqin ichimlik",tag:""},
 {id:12,name:"Kombo menyu",cat:"Burger",price:49000,emoji:"🍔🍟",desc:"Burger + fri + ichimlik",tag:"FOYDALI"}
];
let activeCat="Barchasi", cart={};
const money=n=>new Intl.NumberFormat('uz-UZ').format(n)+" so‘m";
function renderProducts(){
 let list=products.filter(p=>(activeCat==="Barchasi"||p.cat===activeCat)&&p.name.toLowerCase().includes(document.getElementById('search').value.toLowerCase()));
 const sort=document.getElementById('sort').value;
 if(sort==="low")list.sort((a,b)=>a.price-b.price); if(sort==="high")list.sort((a,b)=>b.price-a.price);
 document.getElementById('products').innerHTML=list.length?list.map(p=>`<article class="product"><div class="product-art"><span>${p.emoji}</span>${p.tag?`<div class="tag">${p.tag}</div>`:""}</div><div class="product-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" aria-label="${p.name} savatga qo‘shish" onclick="addToCart(${p.id})">+</button></div></div></article>`).join(''):'<div class="empty">😕 Bu nomda taom topilmadi.</div>';
}
function addToCart(id){cart[id]=(cart[id]||0)+1;updateCart();showToast("Savatga qo‘shildi!");}
function changeQty(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];updateCart();}
function updateCart(){
 const entries=Object.entries(cart);let count=entries.reduce((s,[id,q])=>s+q,0),total=entries.reduce((s,[id,q])=>s+products.find(p=>p.id==id).price*q,0);
 document.getElementById('cartCount').textContent=count;document.getElementById('total').textContent=money(total);
 document.getElementById('cartItems').innerHTML=entries.length?entries.map(([id,q])=>{let p=products.find(x=>x.id==id);return `<div class="cart-item"><div class="cart-emoji">${p.emoji}</div><div class="cart-detail"><strong>${p.name}</strong><small>${money(p.price*q)}</small></div><div class="qty"><button onclick="changeQty(${id},-1)">−</button><b>${q}</b><button onclick="changeQty(${id},1)">+</button></div></div>`}).join(''):'<div class="cart-empty"><div style="font-size:55px">🛒</div><p>Savatingiz hozircha bo‘sh.</p><small>Menyudan taom tanlang.</small></div>';
}
function openCart(){document.getElementById('cartBackdrop').classList.add('show');}
function closeCart(){document.getElementById('cartBackdrop').classList.remove('show');}
function showCheckout(){if(!Object.keys(cart).length){showToast("Avval savatga taom qo‘shing");return;}document.getElementById('checkoutForm').classList.toggle('show');}
function sendOrder(){
 const name=document.getElementById('customerName').value.trim(),phone=document.getElementById('customerPhone').value.trim(),address=document.getElementById('customerAddress').value.trim();
 if(!name||!phone||!address){showToast("Iltimos, barcha maydonlarni to‘ldiring");return;}
 let lines=Object.entries(cart).map(([id,q])=>{let p=products.find(x=>x.id==id);return `${p.name} x ${q} — ${money(p.price*q)}`});
 let total=Object.entries(cart).reduce((s,[id,q])=>s+products.find(p=>p.id==id).price*q,0);
 let msg=`Salom! FastBite saytidan buyurtma:%0A${encodeURIComponent(lines.join('\n'))}%0AJami: ${encodeURIComponent(money(total))}%0AIsm: ${encodeURIComponent(name)}%0ATelefon: ${encodeURIComponent(phone)}%0AManzil: ${encodeURIComponent(address)}`;
 // Replace 998900000000 with the restaurant's real WhatsApp number (country code + number, digits only).
 window.open('https://wa.me/998900000000?text='+msg,'_blank');
}
function showToast(t){let el=document.getElementById('toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),1800);}
document.querySelectorAll('.cat').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCat=b.dataset.cat;renderProducts();}));
document.getElementById('search').addEventListener('input',renderProducts);
document.getElementById('sort').addEventListener('change',renderProducts);
renderProducts();updateCart();
