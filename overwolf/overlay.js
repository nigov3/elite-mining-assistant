document.getElementById('close').addEventListener('click',()=>overwolf.windows.getCurrentWindow(r=>{if(r.success)overwolf.windows.hide(r.window.id,()=>{})}));
const bar=document.getElementById('drag');bar.addEventListener('mousedown',()=>overwolf.windows.getCurrentWindow(r=>{if(r.success)overwolf.windows.dragMove(r.window.id,()=>{})}));
