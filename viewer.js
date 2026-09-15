// Illustrative geometry based on Clami's published Bansang photographs.
// Not an official technical model. Units are an internal visualization scale.
const container=document.querySelector('#canvas-wrap');
const photo=document.querySelector('#bansang-photo');
const hint=document.querySelector('#viewer-hint');
let floor,scene,camera,renderer,controls,table,platter,THREE,ready=false,loading=false,active=false,animation=0;
const defaultPosition=[2.6,1.95,4.2];
function photoMode(){active=false;container.hidden=true;photo.hidden=false;document.querySelector('#view-photo').classList.add('selected');document.querySelector('#view-photo').setAttribute('aria-pressed','true');document.querySelector('#view-3d').classList.remove('selected');document.querySelector('#view-3d').setAttribute('aria-pressed','false');document.querySelector('.view-controls').hidden=true;document.querySelector('#alternate-photo').hidden=false;hint.textContent='Fotografia oficial Clami';}
function render(){if(ready&&active)renderer.render(scene,camera);}
function resize(){if(!renderer||!active)return;const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();render();}
async function initialize(){
 THREE=await import('three');const [{OrbitControls},{RoomEnvironment}]=await Promise.all([import('three/addons/controls/OrbitControls.js'),import('three/addons/environments/RoomEnvironment.js')]);
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;container.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-label','Bansang em 3D ilustrativo. Arraste para girar ou use os botões abaixo.');renderer.domElement.setAttribute('role','img');
 scene=new THREE.Scene();scene.background=new THREE.Color('#f6f6f6');camera=new THREE.PerspectiveCamera(33,1,.05,50);camera.position.set(...defaultPosition);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();scene.environment=pmrem.fromScene(room,.04).texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xffffff,0x9a9185,.7));const light=new THREE.DirectionalLight(0xfff2df,2.2);light.position.set(-2.5,5,3);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:.1,far:15});light.shadow.bias=-.0005;light.shadow.normalBias=.004;scene.add(light);const rim=new THREE.DirectionalLight(0xe5edff,1.4);rim.position.set(3,2,-3);scene.add(rim);
 floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:0xf6f6f6,roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.008;floor.receiveShadow=true;scene.add(floor);
 const wood=new THREE.MeshPhysicalMaterial({color:0x654b38,roughness:.34,metalness:0,envMapIntensity:1.15,clearcoat:.24,clearcoatRoughness:.32});
 wood.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vGrainPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\nvGrainPosition = position;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vGrainPosition;').replace('#include <color_fragment>',`#include <color_fragment>
 vec2 grainUV = vGrainPosition.xy;
 float grain = sin(grainUV.y*420.0 + sin(grainUV.x*1.4 + grainUV.y*9.0)*1.1);
 float fine = sin(grainUV.y*913.7 + sin(grainUV.x*2.8)*.8);
 float broad = sin(grainUV.y*57.3 + sin(grainUV.x*.8)*.5);
 diffuseColor.rgb *= 0.87 + 0.012*grain + 0.007*fine + 0.018*broad;
 `);};
 const metal=new THREE.MeshStandardMaterial({color:0x18191c,roughness:.25,metalness:.8,envMapIntensity:1.3});table=new THREE.Group();scene.add(table);
 const shape=new THREE.Shape();const w=2.8,d=1.2,r=.42;shape.moveTo(-w/2+r,-d/2);shape.lineTo(w/2-r,-d/2);shape.quadraticCurveTo(w/2,-d/2,w/2,-d/2+r);shape.lineTo(w/2,d/2-r);shape.quadraticCurveTo(w/2,d/2,w/2-r,d/2);shape.lineTo(-w/2+r,d/2);shape.quadraticCurveTo(-w/2,d/2,-w/2,d/2-r);shape.lineTo(-w/2,-d/2+r);shape.quadraticCurveTo(-w/2,-d/2,-w/2+r,-d/2);
 const top=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.043,bevelEnabled:true,bevelSize:.007,bevelThickness:.005,bevelSegments:3,steps:1,curveSegments:40}),wood);top.rotation.x=-Math.PI/2;top.position.y=.70;top.castShadow=true;top.receiveShadow=true;table.add(top);
 // Flat steel straps: straight uprights and floor runs, with a small bent elbow only.
 function strap(sx,sz){
 const start=new THREE.Vector3(sx*.50,.032,0),knee=new THREE.Vector3(sx*.98,.032,sz*.37),bendEnd=new THREE.Vector3(sx*1.015,.095,sz*.395),topEnd=new THREE.Vector3(sx*.91,.695,sz*.32);
 const path=new THREE.CurvePath();path.add(new THREE.LineCurve3(start,knee));path.add(new THREE.QuadraticBezierCurve3(knee,new THREE.Vector3(sx*1.035,.032,sz*.41),bendEnd));path.add(new THREE.LineCurve3(bendEnd,topEnd));
 const profile=new THREE.Shape();profile.moveTo(-.037,-.007);profile.lineTo(.037,-.007);profile.lineTo(.037,.007);profile.lineTo(-.037,.007);profile.closePath();
 const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(profile,{steps:120,bevelEnabled:false,extrudePath:path}),metal);mesh.castShadow=true;mesh.receiveShadow=true;table.add(mesh);
 }
 for(const sx of [-1,1])for(const sz of [-1,1])strap(sx,sz);
 const crossbar=new THREE.Mesh(new THREE.BoxGeometry(1.1,.016,.07),metal);crossbar.position.y=.032;crossbar.castShadow=true;table.add(crossbar);
 const slot=new THREE.Mesh(new THREE.BoxGeometry(.9,.002,.01),new THREE.MeshStandardMaterial({color:0x302319,roughness:.9}));slot.position.set(0,.750,0);table.add(slot);
 platter=new THREE.Group();
 // Subtle contact occlusion follows the moving platter, including in AR.
 const contact=new THREE.Mesh(new THREE.CircleGeometry(.323,96),new THREE.MeshBasicMaterial({color:0x27180f,transparent:true,opacity:.24,depthWrite:false}));contact.rotation.x=-Math.PI/2;contact.position.y=-.015;platter.add(contact);
 const edgeWood=wood.clone();edgeWood.color.multiplyScalar(.82);edgeWood.roughness=.4;
 const dishWood=wood.clone();dishWood.onBeforeCompile=wood.onBeforeCompile;dishWood.roughness=.29;dishWood.clearcoat=.3;
 const dish=new THREE.Mesh(new THREE.CylinderGeometry(.325,.31,.024,96),[edgeWood,dishWood,edgeWood]);dish.castShadow=true;dish.receiveShadow=true;platter.add(dish);platter.position.set(-.42,.765,0);table.add(platter);
 controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,.39,0);controls.enablePan=false;controls.enableZoom=false;controls.enableDamping=false;controls.minPolarAngle=.18;controls.maxPolarAngle=Math.PI/2-.07;controls.addEventListener('change',render);controls.update();new ResizeObserver(resize).observe(container);renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();photoMode();hint.textContent='Visualização 3D indisponível. Veja as fotografias oficiais.';});ready=true;resize();
}
document.querySelector('#view-photo').addEventListener('click',photoMode);
async function open3D(){
 if(loading)return;active=true;container.hidden=false;photo.hidden=true;hint.textContent=ready?'Arraste para girar · Representação ilustrativa':'Preparando a experiência 3D…';document.querySelector('#view-3d').classList.add('selected');document.querySelector('#view-3d').setAttribute('aria-pressed','true');document.querySelector('#view-photo').classList.remove('selected');document.querySelector('#view-photo').setAttribute('aria-pressed','false');document.querySelector('#alternate-photo').hidden=true;
 try{if(!ready){loading=true;await initialize();}document.querySelector('.view-controls').hidden=false;hint.textContent='Arraste para girar · Representação ilustrativa';resize();}catch(error){console.error('Não foi possível iniciar o 3D:',error);photoMode();hint.textContent='3D indisponível neste navegador. Veja as fotos oficiais.';}finally{loading=false;}
}
document.querySelector('#view-3d').addEventListener('click',open3D);
document.querySelector('#rotate-left').addEventListener('click',()=>{table.rotation.y-=Math.PI/6;render();});document.querySelector('#rotate-right').addEventListener('click',()=>{table.rotation.y+=Math.PI/6;render();});document.querySelector('#reset-view').addEventListener('click',()=>{cancelAnimationFrame(animation);table.rotation.y=0;camera.position.set(...defaultPosition);controls.target.set(0,.39,0);platter.position.x=-.42;controls.update();render();});
window.addEventListener('bansang-feature',async event=>{if(loading)return;if(!ready||!active)await open3D();if(!ready||!active)return;cancelAnimationFrame(animation);const type=event.detail;let target=type==='base'?[2.7,.9,3.6]:type==='materiais'?[1.8,3.4,2.9]:type==='formatos'?[.7,4.3,1.1]:defaultPosition;const start=camera.position.clone(),end=new THREE.Vector3(...target),plateStart=platter.position.x,plateEnd=type==='prato'?.38:-.42;let startTime=performance.now();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;function frame(now){const t=reduced?1:Math.min(1,(now-startTime)/850),ease=1-Math.pow(1-t,3);camera.position.lerpVectors(start,end,ease);platter.position.x=plateStart+(plateEnd-plateStart)*ease;controls.update();render();if(t<1)animation=requestAnimationFrame(frame);}animation=requestAnimationFrame(frame);});

const arButton=document.querySelector('#view-ar');
const quickLook=document.querySelector('#view-ar-apple');
const supportsQuickLook=!!quickLook.relList?.supports?.('ar');
if(supportsQuickLook){arButton.hidden=true;quickLook.hidden=false;}
let arStarting=false;
const arStatus=document.querySelector('#ar-status');
function arMessage(message){arStatus.textContent=message;arStatus.setAttribute('tabindex','-1');arStatus.focus({preventScroll:true});}

arButton.addEventListener('click',async()=>{
 if(arStarting)return;
 if(!isSecureContext){arMessage('Abra o link HTTPS publicado para usar a câmera em AR.');return;}
 if(!navigator.xr){arMessage(/iPad|iPhone|iPod/.test(navigator.userAgent)?'O AR para iPhone ainda precisa da versão Apple Quick Look deste modelo. A visualização 3D está disponível.':'Abra o link no Chrome de um Android compatível com AR. Este navegador não oferece acesso à câmera em AR.');return;}
 arStarting=true;arButton.disabled=true;arButton.textContent='Abrindo câmera…';
 arStatus.textContent='Autorize a realidade aumentada quando o navegador solicitar.';
 let session;
 try{
 session=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['hit-test'],optionalFeatures:['dom-overlay'],domOverlay:{root:document.querySelector('#ar-overlay')}});
 cancelAnimationFrame(animation);
 if(!ready)await initialize();
 const oldBackground=scene.background,oldPosition=table.position.clone(),oldRotation=table.rotation.clone();
 active=true;container.hidden=false;photo.hidden=true;renderer.xr.enabled=true;renderer.xr.setReferenceSpaceType('local');
 scene.background=null;floor.visible=false;table.visible=false;
 const reticle=new THREE.Mesh(new THREE.RingGeometry(.10,.13,48).rotateX(-Math.PI/2),new THREE.MeshBasicMaterial({color:0xffffff}));reticle.matrixAutoUpdate=false;reticle.visible=false;scene.add(reticle);
 const overlay=document.querySelector('#ar-overlay');overlay.hidden=false;
 const exit=()=>session.end();document.querySelector('#ar-exit').addEventListener('click',exit);
 let source;
 session.addEventListener('end',()=>{source?.cancel();renderer.setAnimationLoop(null);scene.remove(reticle);reticle.geometry.dispose();reticle.material.dispose();scene.background=oldBackground;floor.visible=true;table.visible=true;table.position.copy(oldPosition);table.rotation.copy(oldRotation);overlay.hidden=true;renderer.xr.enabled=false;document.querySelector('#ar-exit').removeEventListener('click',exit);photoMode();},{once:true});
 await renderer.xr.setSession(session);
 source=await session.requestHitTestSource({space:await session.requestReferenceSpace('viewer')});
 session.addEventListener('select',()=>{if(reticle.visible){table.position.setFromMatrixPosition(reticle.matrix);table.visible=true;document.querySelector('#ar-instruction').textContent='Mesa posicionada. Toque para reposicionar. Escala ilustrativa.';}});
 renderer.setAnimationLoop((time,frame)=>{if(frame){const hits=frame.getHitTestResults(source);const pose=hits[0]?.getPose(renderer.xr.getReferenceSpace());reticle.visible=!!pose;if(pose)reticle.matrix.fromArray(pose.transform.matrix);}renderer.render(scene,camera);});
 }catch(error){
 if(session)await session.end().catch(()=>{});
 console.error('Falha ao iniciar AR:',error);
 arMessage(error.name==='NotAllowedError'?'A permissão de AR foi recusada. Autorize o acesso nas configurações do navegador e tente novamente.':error.name==='NotSupportedError'?'Este aparelho não oferece AR com reconhecimento de superfície. Use um Android compatível com AR no Chrome.':'Não foi possível abrir a câmera em AR. Feche outras experiências de câmera e tente novamente.');
 }finally{arStarting=false;arButton.disabled=false;arButton.textContent='Ver em casa · AR';}
});
