/* Optional password-encrypted Firebase sync. No plaintext financial records sent to Firestore. */
const $=id=>document.getElementById(id), status=msg=>{$('cloud-status').textContent=msg};
const config=window.EXCELSIOR_FIREBASE_CONFIG;
const validConfig=config&&config.apiKey&&config.authDomain&&config.projectId&&config.appId;
if(!validConfig){
 status('Firebase not configured. Manual encrypted backup and restore works now. Edit firebase-config.js after creating your Firebase project.');
 for(const id of ['cloud-register','cloud-login','cloud-signout','cloud-auto','cloud-save','cloud-load']) $(id).disabled=true;
}else{
 try{
  const [{initializeApp},{getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged},{getFirestore,doc,setDoc,getDoc}]=await Promise.all([
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
   import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js')]);
  const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app);
  let user=null,autoTimer=null,saving=false;
  const record=()=>doc(db,'users',user.uid,'backups','current');
  const pwd=()=>{const p=$('cloud-encryption-password').value;if(!/^[0-9]{4,12}$/.test(p))throw Error('Enter a numeric encryption PIN of 4 to 12 digits.');return p};
  async function save(){
   if(!user)throw Error('Sign in first.');if(saving)return;
   saving=true;try{
    const encrypted=await window.ExcelsiorBackup.encryptPayload(window.ExcelsiorBackup.getData(),pwd());
    status('Uploading encrypted data…');
    await setDoc(record(),{envelope:encrypted,updatedAt:new Date().toISOString()});
    status('Encrypted cloud backup saved at '+new Date().toLocaleString()+'. You must remember the encryption PIN to restore it.');
   }finally{saving=false}
  }
  async function load(){
   if(!user)throw Error('Sign in first.');status('Downloading encrypted backup…');
   const snap=await getDoc(record());if(!snap.exists())throw Error('No cloud backup yet. Save a backup first.');
   const data=await window.ExcelsiorBackup.decryptPayload(snap.data().envelope,pwd());
   if(!window.ExcelsiorBackup.valid(data))throw Error('Cloud backup data is invalid.');
   status('Encrypted cloud backup successfully decrypted.');
   window.ExcelsiorBackup.restoreData(data);
  }
  async function action(fn){try{await fn()}catch(e){status('Cloud operation failed: '+(e?.message||String(e)));}}
  $('cloud-register').onclick=()=>action(async()=>{await createUserWithEmailAndPassword(auth,$('cloud-email').value,$('cloud-login-password').value);$('cloud-login-password').value='';});
  $('cloud-login').onclick=()=>action(async()=>{await signInWithEmailAndPassword(auth,$('cloud-email').value,$('cloud-login-password').value);$('cloud-login-password').value='';});
  $('cloud-signout').onclick=()=>action(async()=>{await signOut(auth);$('cloud-encryption-password').value='';$('cloud-auto').checked=false;});
  $('cloud-save').onclick=()=>action(save);
  $('cloud-load').onclick=()=>action(load);
  onAuthStateChanged(auth,u=>{user=u;status(u?'Signed in: '+(u.email||'account')+'. Enter encryption PIN and click Back Up Now.':'Signed out. Sign in to use encrypted cloud backup.');});
  window.addEventListener('excelsior:changed',()=>{
   if(!user||!$('cloud-auto').checked||!/^[0-9]{4,12}$/.test($('cloud-encryption-password').value))return;
   clearTimeout(autoTimer);autoTimer=setTimeout(()=>action(save),1400);
  });
  $('cloud-auto').addEventListener('change',()=>{
   if($('cloud-auto').checked){if(!user||!/^[0-9]{4,12}$/.test($('cloud-encryption-password').value)){$('cloud-auto').checked=false;status('Sign in and enter an encryption PIN before enabling automatic cloud uploads.');return;}action(save);}
  });
 }catch(e){status('Firebase SDK could not initialize: '+e.message);}
}
