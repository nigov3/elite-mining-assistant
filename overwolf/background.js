/* Prototype: toggle window via Overwolf hotkey. */
const WINDOW='overlay';
function toggle(){overwolf.windows.obtainDeclaredWindow(WINDOW,result=>{if(!result.success){console.error('Window lookup failed',result);return;}const w=result.window;if(w.state==='normal'||w.state==='maximized'){overwolf.windows.hide(w.id,()=>{});}else{overwolf.windows.restore(w.id,()=>{});}})}
overwolf.settings.hotkeys.onPressed.addListener(event=>{if(event.name==='toggle_mining')toggle()});
