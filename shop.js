/* Category -> product list with inline options and swipeable galleries. */
window.GuildShop=(()=>{
 const base=new URL('.',document.currentScript.src);
 let selected=false;
 const products=[
  {id:'single',name:'가을 길하 스페셜(1구)',desc:'좋아하는 디자인 하나를 골라보세요.',options:Array.from({length:10},(_,i)=>({label:'디자인 '+String(i+1).padStart(2,'0'),image:i===0?'single':'design-'+(i+1),designs:[i+1]}))},
  {id:'trio',name:'가을 길하 스페셜(3구)',desc:'추천 조합을 고르거나 세 가지 디자인을 직접 조합하세요.',options:[{label:'추천 조합 A · 04 / 02 / 07',image:'trioA',designs:[4,2,7]},{label:'추천 조합 B · 01 / 04 / 05',image:'trioB',designs:[1,4,5]},{label:'직접 선택',designs:[4,2,7]}]},
  {id:'sophie',name:'소피 직장인의 애환 시리즈',desc:'우리의 직장 생활을 담은 3구 키링.',options:[{label:'일단 네라고 함',image:'officeA'},{label:'회의 끝나면 회의',image:'officeB'}]}
 ];
 const choices={single:0,trio:0,sophie:0};let custom=[4,2,7];
 const img=file=>new URL('shop-media/'+file+'.webp',base).href;
  const art=()=>`<svg class="keyring-art" viewBox="0 0 400 300" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="244" cy="49" rx="37" ry="31" transform="rotate(-20 244 49)"/><ellipse cx="244" cy="49" rx="29" ry="24" transform="rotate(-20 244 49)"/><path d="M228 76L216 103M239 79L226 107"/><rect x="209" y="96" width="20" height="32" rx="9" transform="rotate(23 219 112)"/></g><path d="M115 123L215 104L276 149L271 230L169 253L111 205Z" fill="#b8ab95" stroke="#8e806b" stroke-width="2"/><path d="M115 123L215 104L276 149L169 176Z" fill="#f1e9d9" stroke="#8e806b" stroke-width="2"/><path d="M126 126L212 111L258 146L171 167Z" fill="#e2d5bc"/><path d="M169 176V253M111 205L169 253L271 230" fill="none" stroke="#8e806b" stroke-width="2"/><g transform="translate(189 142) rotate(12)" fill="#7f6c4d" text-anchor="middle" font-family="Georgia,serif" font-size="25"><text>HKG</text></g><path d="M74 91H86M80 85V97M303 205H319M311 197V213" stroke="#ae9874" stroke-width="2"/></svg>`;

 const designSelect=(value)=>Array.from({length:10},(_,i)=>`<option value="${i+1}" ${i+1===value?'selected':''}>디자인 ${String(i+1).padStart(2,'0')}</option>`).join('');
 function customArt(){return `<div class="shop-custom-preview">${custom.map((n,i)=>`<figure><img src="${img('design-'+n)}" alt="${['왼쪽','가운데','오른쪽'][i]} 디자인 ${n}" loading="lazy"><figcaption>${['왼쪽','가운데','오른쪽'][i]} · ${String(n).padStart(2,'0')}</figcaption></figure>`).join('')}</div>`;}
 function card(p){return `<article class="shop-product" data-shop-product="${p.id}"><div class="shop-gallery" role="region" aria-label="${p.name} 이미지" tabindex="0">${p.options.map((o,i)=>`<div class="shop-slide" data-slide="${i}" role="group" aria-label="${i+1} / ${p.options.length} · ${o.label}">${o.image?`<img src="${img(o.image)}" alt="${p.name} · ${o.label}" loading="lazy" decoding="async">`:customArt()}<span class="shop-image-note">${p.id==='single'&&i>0||!o.image?'디자인 원본':'AI 제작 시안'}</span></div>`).join('')}</div><div class="shop-gallery-controls"><button data-gallery-step="-1" aria-label="${p.name} 이전 이미지">←</button><span class="shop-gallery-count" aria-live="polite">${choices[p.id]+1} / ${p.options.length}</span><span class="shop-swipe-hint">옆으로 넘겨보기</span><button data-gallery-step="1" aria-label="${p.name} 다음 이미지">→</button></div><div class="shop-product-body"><h3>${p.name}</h3><p>${p.desc}</p><label class="shop-option-label" for="shop-option-${p.id}">옵션 선택</label><select class="shop-option" id="shop-option-${p.id}" data-option="${p.id}">${p.options.map((o,i)=>`<option value="${i}" ${choices[p.id]===i?'selected':''}>${o.label}</option>`).join('')}</select>${p.id==='trio'?`<div class="shop-custom-options" ${choices.trio===2?'':'hidden'}>${custom.map((n,i)=>`<label>${['왼쪽','가운데','오른쪽'][i]}<select data-custom="${i}" aria-label="${['왼쪽','가운데','오른쪽'][i]} 키캡 디자인">${designSelect(n)}</select></label>`).join('')}</div>`:''}<p class="shop-selected" aria-live="polite">${p.options[choices[p.id]].label}</p><div class="shop-product-footer"><span class="shop-price">가격 준비 중</span><button class="shop-buy" disabled>판매 준비 중</button></div></div></article>`;}
 function render(){
  if(!selected)return `<section class="guild-shop"><div class="shop-intro"><span class="page-kicker">TAKE A LITTLE CAMP HOME</span><h1>Shop</h1><p>우리의 시간을, 작은 기념품으로.</p></div><button class="shop-category" data-shop-category="keyrings"><div class="shop-category-art"><span class="shop-edition">COLLECTION 01</span>${art()}<span class="shop-preview-pill">COMING SOON</span></div><div class="shop-category-info"><div><span class="shop-overline">KEYCAP KEYRINGS</span><h2>키캡 키링</h2><p>가방에도, 열쇠에도. 길드의 작은 조각.</p></div><span class="shop-arrow" aria-hidden="true">↗</span></div></button></section>`;

 return `<section class="guild-shop shop-collection"><button class="shop-back" data-shop-back>← 카테고리</button><div class="shop-collection-title"><span class="page-kicker">COLLECTION 01 / KEYRINGS</span><h1>키캡 키링</h1><p class="shop-collection-caption">가을 길하의 기억을, 작은 키링에.</p></div><div class="shop-products">${products.map(card).join('')}</div><p class="shop-draft-note">이미지는 제작 시안이며 실제 제품과 다를 수 있습니다. 가격과 판매 일정은 준비 중입니다.</p></section>`;
 }
 function sync(card,p,index){
  choices[p.id]=index;card.querySelector('[data-option]').value=String(index);
  card.querySelector('.shop-gallery-count').textContent=(index+1)+' / '+p.options.length;
  card.querySelector('.shop-selected').textContent=p.options[index].label;
  const customOptions=card.querySelector('.shop-custom-options');if(customOptions)customOptions.hidden=index!==2;
  card.querySelector('[data-gallery-step="-1"]').disabled=index===0;
  card.querySelector('[data-gallery-step="1"]').disabled=index===p.options.length-1;
 }
 function bind(){
  document.querySelectorAll('[data-shop-category]').forEach(b=>b.onclick=()=>{selected=true;window.render();document.querySelector('#main').scrollTop=0;document.querySelector('[data-shop-back]').focus({preventScroll:true});});
  document.querySelectorAll('[data-shop-back]').forEach(b=>b.onclick=()=>{selected=false;window.render();document.querySelector('#main').scrollTop=0;document.querySelector('[data-shop-category]').focus({preventScroll:true});});
  document.querySelectorAll('[data-shop-product]').forEach(card=>{
   const p=products.find(p=>p.id===card.dataset.shopProduct),gallery=card.querySelector('.shop-gallery');
   const go=index=>{index=Math.max(0,Math.min(p.options.length-1,index));sync(card,p,index);gallery.scrollTo({left:gallery.clientWidth*index,behavior:'instant'});};
   card.querySelector('[data-option]').onchange=e=>go(Number(e.target.value));
   card.querySelectorAll('[data-gallery-step]').forEach(b=>b.onclick=()=>go(choices[p.id]+Number(b.dataset.galleryStep)));
   gallery.onkeydown=e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(choices[p.id]+(e.key==='ArrowRight'?1:-1));}};
   gallery.onscroll=()=>{if(gallery.clientWidth)sync(card,p,Math.max(0,Math.min(p.options.length-1,Math.round(gallery.scrollLeft/gallery.clientWidth))));};
   card.querySelectorAll('[data-custom]').forEach(select=>select.onchange=e=>{custom[Number(e.target.dataset.custom)]=Number(e.target.value);card.querySelector('[data-slide="2"] .shop-custom-preview').outerHTML=customArt();});
   sync(card,p,choices[p.id]);requestAnimationFrame(()=>{if(card.isConnected)gallery.scrollLeft=gallery.clientWidth*choices[p.id];});
  });
 }
 return {render,bind};
})();

