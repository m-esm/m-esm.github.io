import { Component, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { Group, OrthographicCamera } from "three";

const stories = {
  delivery: [
    ["Partner", "A partner integrates with a unified API to request a robotic delivery."],
    ["Platform", "The delivery platform connects order workflows, operational tools and integration services."],
    ["Robot", "Physical delivery progress becomes status information for the partner and its users."],
  ],
  agents: [
    ["Task", "Task size and reasoning difficulty are considered separately."],
    ["Route", "Available quota and worker fit guide the choice of coding CLI."],
    ["Verify", "Work is isolated in a Git worktree, then the resulting diff is checked."],
  ],
};
type Kind = keyof typeof stories;
function Block({ position, scale, color }: { position: [number,number,number]; scale: [number,number,number]; color: string }) {
  return <RoundedBox position={position} args={scale} radius={.06} smoothness={3} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.3} metalness={.45}/></RoundedBox>;
}
function Diagram({ kind, selected, setSelected, moving }: { kind: Kind; selected:number; setSelected:(n:number)=>void; moving:boolean }) {
  const { camera, size } = useThree();
  useEffect(() => { if (camera instanceof OrthographicCamera) { camera.zoom = Math.min(size.width / 11.5, size.height / 5.8); camera.updateProjectionMatrix(); } }, [camera, size.width, size.height]);
  const packet = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_,dt)=>{if(moving)time.current+=Math.min(dt,.05)*.22;if(packet.current){const t=time.current%1;packet.current.position.set(-3.5+t*7,.55,1.3);}});
  return <>
    <ambientLight intensity={1.25}/><hemisphereLight args={["#ecf7ff","#80958c",1.2]}/>
    <directionalLight position={[-4,8,5]} intensity={3} castShadow shadow-mapSize={[1024,1024]} shadow-normalBias={.04}/>
    <group position={[0,-.6,0]}>
      <Block position={[0,-.2,0]} scale={[11,.25,4.4]} color="#17243e"/>
      <Block position={[0,.02,1.3]} scale={[7.6,.08,.12]} color="#697aaf"/>
      {[0,1,2].map(i=><group key={i} position={[(i-1)*3.5,0,0]} onClick={e=>{e.stopPropagation();setSelected(i);}}>
        <Block position={[0,.13,0]} scale={[2.65,.2,2.7]} color={selected===i?"#8b9ddb":"#2d3d64"}/>
        {i===0 ? <>
          <Block position={[0,1.05,0]} scale={[1.8,1.3,.18]} color="#34466b"/>
          <Block position={[0,1.08,.11]} scale={[1.55,1.05,.04]} color="#9dc8e7"/>
          {[0,1,2].map(j=><Block key={j} position={[-.2,1.38-j*.24,.15]} scale={[.85-j*.15,.055,.02]} color="#8b9ddb"/>)}
          <Block position={[0,.43,0]} scale={[.16,.4,.2]} color="#34466b"/>
        </>:i===1 ? <>
          {[0,1,2].map(j=><group key={j}>
            <Block position={[0,.5+j*.48,0]} scale={[1.8,.34,1.35]} color={j===1?"#9d8bc7":"#c0c5e8"}/>
            <Block position={[-.55,.5+j*.48,.7]} scale={[.12,.08,.03]} color="#83e8ef"/>
          </group>)}
        </>:kind==='delivery'?<>
          <Block position={[0,.8,0]} scale={[1.6,.85,1.2]} color="#c0c5e8"/>
          <Block position={[0,1.26,0]} scale={[1.5,.1,1.1]} color="#34466b"/>
          {[-.7,.7].flatMap(x=>[-.5,.5].map(z=><mesh key={`${x}${z}`} position={[x,.43,z]} rotation={[Math.PI/2,0,0]} castShadow><cylinderGeometry args={[.3,.3,.19,32]}/><meshStandardMaterial color="#34466b" roughness={.85}/></mesh>))}
          <Block position={[.4,1.55,0]} scale={[.06,.6,.06]} color="#34466b"/>
        </>:<>
          <Block position={[0,1,0]} scale={[1.6,1.5,.2]} color="#c0c5e8"/>
          {[0,1,2].map(j=><Block key={j} position={[0,1.45-j*.36,.15]} scale={[1.1,.1,.04]} color={j===2?"#8b9ddb":"#9dbeed"}/>)}
        </>}
      </group>)}
      <group ref={packet}><mesh><sphereGeometry args={[.12,20,16]}/><meshStandardMaterial color="#ffc6a0" metalness={.3} roughness={.25}/></mesh></group>
    </group>
    <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={.55} maxPolarAngle={1.35} minAzimuthAngle={-.65} maxAzimuthAngle={.65}/>
  </>;
}
class SafeGraphic extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};static getDerivedStateFromError(){return {failed:true};}
  render(){return this.state.failed?<p className="graphic-error">The written flow below remains available.</p>:this.props.children;}
}
function Infographic({kind}:{kind:Kind}) {
  const [selected,setSelected]=useState(0);
  const [moving,setMoving]=useState(!matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible,setVisible]=useState(false);
  const box=useRef<HTMLDivElement>(null);
  useEffect(()=>{const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting),{rootMargin:'100px'});if(box.current)observer.observe(box.current);return()=>observer.disconnect();},[]);
  return <div ref={box} className="inline-graphic">
    <div className="graphic-top"><span>{kind==='delivery'?'From an API request to a physical delivery':'From a task to a verified change'}</span><button onClick={()=>setMoving(v=>!v)}>{moving?'Pause motion':'Play motion'}</button></div>
    <div className="graphic-canvas" aria-label="Interactive three-dimensional conceptual flow. Drag to rotate; choose a stage below.">
      {visible&&<SafeGraphic><Canvas orthographic shadows dpr={[1,1.5]} camera={{position:[5,5,10],zoom:55}}><Suspense fallback={null}><Diagram kind={kind} selected={selected} setSelected={setSelected} moving={moving}/></Suspense></Canvas></SafeGraphic>}
      <span className="graphic-hint">Drag to turn the model</span>
    </div>
    <div className="graphic-stages">{stories[kind].map(([name],i)=><button key={name} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{name}</button>)}</div>
    <p className="graphic-description" aria-live="polite">{stories[kind][selected][1]}</p>
    <p className="graphic-note">Conceptual illustration. No live deliveries or agent executions.</p>
  </div>;
}
for(const el of document.querySelectorAll<HTMLElement>('[data-infographic]')) {
  const kind=el.dataset.infographic as Kind;
  if(stories[kind]){createRoot(el).render(<Infographic kind={kind}/>);}
}
