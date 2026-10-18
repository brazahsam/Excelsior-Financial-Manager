/* Excelsior encrypted backup envelope v1. Requires HTTPS (GitHub Pages). */
(function(){
  'use strict';
  const KEY='excelsior_soldier_fin_data_v3';
  const enc = new TextEncoder(), dec = new TextDecoder();
  const $=id=>document.getElementById(id);
  const status=(message)=>{$('backup-status').textContent=message;};
  const b64=bytes=>btoa(String.fromCharCode(...bytes));
  const bytes64=str=>Uint8Array.from(atob(str),x=>x.charCodeAt(0));
  const passwordOk=p=>typeof p==='string' && /^[0-9]{4,12}$/.test(p);
  async function derive(password,salt){
    const base=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveKey']);
    return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:310000,hash:'SHA-256'},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
  }
  async function encryptPayload(data,password){
    if(!passwordOk(password))throw Error('Enter a numeric backup PIN of 4 to 12 digits.');
    const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
    const key=await derive(password,salt);
    const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},key,enc.encode(JSON.stringify(data)));
    return {format:'excelsior-encrypted-backup',version:1,createdAt:new Date().toISOString(),kdf:'PBKDF2-SHA256',iterations:310000,cipher:'AES-256-GCM',salt:b64(salt),iv:b64(iv),ciphertext:b64(new Uint8Array(ct))};
  }
  async function decryptPayload(envelope,password){
    if(!envelope||envelope.format!=='excelsior-encrypted-backup'||envelope.version!==1||envelope.iterations!==310000||envelope.cipher!=='AES-256-GCM')throw Error('Unsupported encrypted backup format.');
    if(!password)throw Error('Enter the backup PIN.');
    try{
      const key=await derive(password,bytes64(envelope.salt));
      const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes64(envelope.iv)},key,bytes64(envelope.ciphertext));
      return JSON.parse(dec.decode(plain));
    }catch(e){throw Error('Incorrect backup PIN/password or damaged backup file.');}
  }
  function valid(data){
    return !!(data&&typeof data==='object'&&Array.isArray(data.debts)&&Array.isArray(data.savings)&&Array.isArray(data.moneyEntries)&&typeof data.soldierName==='string'&&Number.isFinite(data.sliderLoanExtra)&&Number.isFinite(data.sliderMortgageCurtailment));
  }
  function getData(){
    const raw=localStorage.getItem(KEY);
    if(!raw)throw Error('No stored data found. Open the app and save an entry first.');
    const d=JSON.parse(raw);if(!valid(d))throw Error('Stored data is missing required fields.');return d;
  }
  function restoreData(d){
    if(!valid(d))throw Error('Backup does not contain valid Excelsior financial data.');
    if(!confirm('Restore backup? This will REPLACE all current debts, savings, income and expense records on this device. Export a backup first if you want to preserve them.'))return false;
    localStorage.setItem(KEY,JSON.stringify(d));
    location.reload();return true;
  }
  async function exportFile(){
    try{
      if(!crypto.subtle)throw Error('Encrypted backups require HTTPS.');
      const password=$('backup-password').value;
      if(password!==$('backup-confirm').value)throw Error('The PINs do not match.');
      status('Encrypting backup…');
      const encrypted=await encryptPayload(getData(),password);
      const blob=new Blob([JSON.stringify(encrypted,null,2)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='excelsior-backup-'+new Date().toISOString().slice(0,10)+'.json';document.body.append(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      $('backup-password').value='';$('backup-confirm').value='';
      status('Encrypted backup prepared. Confirm the file is saved in Files / iCloud Drive / Google Drive before deleting the app. Keep the backup PIN separately.');
    }catch(e){status('Backup failed: '+e.message);}
  }
  async function importFile(file){
    if(!file)return;
    try{
      status('Reading encrypted backup…');
      if(file.size>5*1024*1024)throw Error('Backup file is too large.');
      const envelope=JSON.parse(await file.text());
      const data=await decryptPayload(envelope,$('backup-password').value);
      if(!valid(data))throw Error('Decrypted file does not contain a valid financial planner backup.');
      status('Backup decrypted. Awaiting restore confirmation.');
      restoreData(data);
    }catch(e){status('Restore failed: '+e.message);}
    finally{$('backup-file').value='';}
  }
  window.ExcelsiorBackup={encryptPayload,decryptPayload,getData,restoreData,valid};
  $('export-backup').addEventListener('click',exportFile);
  $('restore-backup').addEventListener('click',()=>{$('backup-file').click();});
  $('backup-file').addEventListener('change',e=>importFile(e.target.files[0]));
})();
