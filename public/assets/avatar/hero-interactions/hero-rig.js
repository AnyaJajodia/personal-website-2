/* Vanilla reference implementation. Adapt to the repository's framework. */
(function(global){
  const RIG={width:1300,height:1600,seatAnchor:[720,970],layers:[
    {key:'leg-viewer-left',file:'layers/leg-viewer-left.png',width:1024,height:1536,sx:.62,sy:.42,x:172.56,y:811.86,pivot:[470,1030],z:1},
    {key:'leg-viewer-right',file:'layers/leg-viewer-right.png',width:1024,height:1536,sx:.62,sy:.42,x:489.42,y:820.26,pivot:[795,1030],z:2},
    {key:'forearm-matcha',file:'layers/forearm-matcha.png',width:1226,height:1283,sx:.4,sy:.4,x:700,y:476,pivot:[885,780],z:3},
    {key:'body',file:'layers/body.png',width:1024,height:1536,sx:1,sy:1,x:80,y:0,pivot:[0,0],z:4}
  ]};
  function mountHeroRig(host,options={}){
    const base=(options.assetBase||'.').replace(/\/$/,'');
    const root=document.createElement('div');root.className='hero-rig';
    const parts={};const active=new Set();const listeners=[];let destroyed=false;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
    function on(el,event,fn){el.addEventListener(event,fn);listeners.push(()=>el.removeEventListener(event,fn));}
    for(const p of RIG.layers){
      const layer=document.createElement('div');layer.className='hero-rig__layer';layer.dataset.part=p.key;
      layer.style.zIndex=p.z;layer.style.transformOrigin=`${p.pivot[0]/13}% ${p.pivot[1]/16}%`;
      const img=document.createElement('img');img.src=base+'/'+p.file;img.alt='';img.draggable=false;
      img.width=p.width;img.height=p.height;img.decoding='async';img.loading='eager';
      if(p.key==='body')img.fetchPriority='high';
      Object.assign(img.style,{left:p.x/13+'%',top:p.y/16+'%',width:p.width*p.sx/13+'%',height:p.height*p.sy/16+'%'});
      layer.appendChild(img);root.appendChild(layer);parts[p.key]=layer;
    }
    function button(kind,label,fn){const b=document.createElement('button');b.type='button';b.className='hero-rig__target hero-rig__target--'+kind;b.setAttribute('aria-label',label);on(b,'click',e=>{e.stopPropagation();fn();});root.appendChild(b);return b;}
    let swinging=false,cheering=false;
    function play(el,angles,duration){
      const animation=el.animate(angles.map(([offset,angle,y=0])=>({offset,transform:`translateY(${y}px) rotate(${angle}deg)`})),{duration,easing:'ease-in-out',fill:'none'});
      active.add(animation);animation.finished.catch(()=>{}).finally(()=>active.delete(animation));return animation;
    }
    function swing(){
      if(destroyed||reduced.matches||swinging||!root.isConnected)return;
      swinging=true;
      const a=play(parts['leg-viewer-left'],[[0,0],[.23,-2.5],[.5,2],[.75,-.9],[1,0]],1450);
      const b=play(parts['leg-viewer-right'],[[0,0],[.23,2],[.5,-1.7],[.75,.7],[1,0]],1450);
      Promise.allSettled([a.finished,b.finished]).then(()=>swinging=false);
    }
    function cheers(){
      if(destroyed||reduced.matches||cheering||!root.isConnected)return;
      cheering=true;
      const a=play(parts['forearm-matcha'],[[0,0],[.32,-9],[.55,-9],[1,0]],1400);
      a.finished.catch(()=>{}).finally(()=>cheering=false);
    }
    const legs=button('legs','Gently swing the avatar’s feet',swing);
    const cup=button('cup','Raise the matcha in a small cheers',cheers);
    on(root,'pointerenter',e=>{if(e.pointerType!=='touch')swing();});
    on(cup,'pointerenter',e=>{if(e.pointerType!=='touch')cheers();});
    on(legs,'focus',swing);on(cup,'focus',cheers);
    function stop(){active.forEach(a=>a.cancel());active.clear();swinging=false;cheering=false;}
    on(document,'visibilitychange',()=>{if(document.hidden)stop();});
    const motionChange=()=>{if(reduced.matches)stop();};reduced.addEventListener('change',motionChange);
    host.appendChild(root);
    if(options.entry!==false)Promise.allSettled([...root.querySelectorAll('img')].map(i=>i.decode())).then(()=>{if(!destroyed&&!document.hidden)swing();});
    return {root,swing,cheers,rig:RIG,destroy(){destroyed=true;stop();listeners.forEach(fn=>fn());reduced.removeEventListener('change',motionChange);root.remove();}};
  }
  global.mountHeroRig=mountHeroRig;
})(window);
