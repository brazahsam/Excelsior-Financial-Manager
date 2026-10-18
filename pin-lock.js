/* Screen-only access PIN. Does NOT encrypt localStorage and cannot protect against a device attacker. */
(function(){
'use strict';
const KEY='excelsior_access_pin_v1';
const $=id=>document.getElementById(id);
const box=$('pin-gate'),input=$('pin-gate-input'),confirmation=$('pin-gate-confirm'),notice=$('pin-gate-instructions'),error=$('pin-gate-error'),title=$('pin-gate-title'),button=$('pin-gate-action');
let stored=null,attempts=0,lockedUntil=0;
try{stored=JSON.parse(localStorage.getItem(KEY)||'null')}catch(_){stored=null}
const pinOk=pin=>/^[0-9]{4,12}$/.test(pin);
const bytes=b=>Array.from(b,x=>x.toString(16).padStart(2,'0')).join('');
async function hash(pin,salt){
 const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);
 return bytes(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},base,256)));
}
function showError(msg){error.textContent=msg;input.value='';confirmation.value='';input.focus()}
function unlock(){box.hidden=true;input.value='';confirmation.value='';}
if(!stored || !stored.hash || !stored.salt){stored=null; title.textContent='Set Your Access PIN';notice.textContent='Create a 4–12 digit PIN to unlock the app on this device. Use a longer PIN when possible.';confirmation.hidden=false;button.textContent='Save PIN & Open';}
else{title.textContent='Enter Your Access PIN';notice.textContent='Enter your PIN to open the app. This is a convenience screen lock, not encryption.';confirmation.hidden=true;button.textContent='Unlock App';}
async function submit(){
 error.textContent='';
 const pin=input.value;
 if(!pinOk(pin)){showError('PIN must contain 4–12 digits only.');return}
 if(!crypto.subtle){showError('Secure PIN access requires HTTPS.');return}
 if(stored){
   if(Date.now()<lockedUntil){showError('Too many incorrect attempts. Please wait before retrying.');return}
   button.disabled=true;
   try{
     const actual=await hash(pin,Uint8Array.from(atob(stored.salt),x=>x.charCodeAt(0)));
     if(actual!==stored.hash){attempts++;if(attempts>=5){lockedUntil=Date.now()+60000;attempts=0;}showError('Incorrect PIN.');return}
     attempts=0;unlock();
   }finally{button.disabled=false}
 }else{
   if(pin!==confirmation.value){showError('PINs do not match.');return}
   button.disabled=true;
   try{
     const salt=crypto.getRandomValues(new Uint8Array(16));
     const hashValue=await hash(pin,salt);
     localStorage.setItem(KEY,JSON.stringify({salt:btoa(String.fromCharCode(...salt)),hash:hashValue}));
     stored={hash:hashValue};unlock();
   }catch(e){showError('Could not save PIN: '+e.message)}finally{button.disabled=false}
 }
}
button.addEventListener('click',submit);
for(const el of [input,confirmation])el.addEventListener('keydown',e=>{if(e.key==='Enter')submit()});
})();
