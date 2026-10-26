import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Group } from "three";
import { Bake, Beam, Box, Cyl, Orb, Planter } from "./kit";
import { Label } from "./Settlement";

const steel = "#394b56", silver = "#b9c3c5", cream = "#e4e9e3";

function Orrery({ paused, reduced }: { paused: boolean; reduced: boolean }) {
  const spin = useRef<Group>(null);
  const [moving, setMoving] = useState(true);
  useFrame((_, dt) => {
    if (spin.current && moving && !paused && !reduced) spin.current.rotation.y += Math.min(dt, .05) * .12;
  });
  return <group position={[-27, 0, 15]}>
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[3.5, .65, 3.5]} position={[0, .65, 0]} />
    </RigidBody>
    <Bake>
      <Cyl at={[0,.25,0]} size={[4,.5,4]} color={steel}/>
      <Cyl at={[0,.54,0]} size={[3.8,.08,3.8]} color={silver}/>
      <Cyl at={[0,.64,0]} size={[3.55,.12,3.55]} color="#355a68"/>
      <Cyl at={[0,1.15,0]} size={[.65,1,.65]} color={steel}/>
      <Cyl at={[0,1.68,0]} size={[.85,.15,.85]} color={silver}/>
      {Array.from({length:48},(_,i)=>{const a=i*Math.PI/24;return <Box key={i} at={[Math.sin(a)*3.2,.72,Math.cos(a)*3.2]} rotation={[0,a,0]} size={[.025,.025,i%4===0?.3:.13]} color={cream}/>;})}
      {[-1,1].map(s=><group key={s}>
        <Box at={[s*4.7,1.3,-2]} size={[.23,2.6,.23]} color={steel}/>
        <Beam from={[s*4.7,2.5,-2]} to={[s*3.4,3.2,-2]} r={.065} color={silver}/>
        <Box at={[s*3.4,3.2,-2]} size={[.65,.1,.4]} color={cream} round/>
      </group>)}
      <Box at={[0,1.25,4]} size={[5.7,1.3,.22]} color={steel} round/>
      <Box at={[0,.4,4]} size={[.25,.8,.3]} color={silver}/>
    </Bake>
    <group onClick={(e)=>{e.stopPropagation();setMoving(v=>!v);}}>
      <Orb at={[0,3,0]} size={[1.05,1.05,1.05]} color="#397ca5"/>
      <group ref={spin} position={[0,3,0]}>
        {[0,1,2].map(i=><group key={i} rotation={[.35+i*.48,0,i*.7]}>
          <mesh><torusGeometry args={[1.55+i*.55,.025,8,96]}/><meshStandardMaterial color={i===1?"#c69b62":silver} metalness={.75} roughness={.3}/></mesh>
          <Orb at={[1.55+i*.55,0,0]} size={[.14,.14,.14]} color={i===1?"#c66b3c":cream}/>
        </group>)}
        <Beam from={[0,-1.3,0]} to={[0,1.5,0]} r={.035} color={silver}/>
      </group>
    </group>
    <Label at={[0,1.6,4.13]} size={.27} color={cream}>Orbital mechanics / Kinetic study</Label>
    <Label at={[0,1.15,4.13]} size={.19} color="#b9c3c5">{moving ? "Touch the rings to pause" : "Touch the rings to resume"}</Label>
    <Label at={[0,.83,4.13]} size={.14} color="#b9c3c5">Illustrative sculpture / not to scale</Label>
  </group>;
}

function DockingHall() {
  return <group position={[0,0,35]}>
    <Bake>
      <Box at={[0,1.2,2]} size={[16,2.4,11]} color={steel} round/>
      <Box at={[0,2.48,2]} size={[15.8,.16,10.8]} color={silver}/>
      {[-6,0,6].map(x=><group key={x}>
        <Box at={[x,-1,2]} size={[.6,4,8]} color={steel}/>
        <Beam from={[x,-3,-2]} to={[x,1,6]} r={.14} color={silver}/>
      </group>)}
      {[-2,2,6].map(z=><group key={z}>
        {[-7,7].map(x=><group key={x}>
          <Box at={[x,5.5,z]} size={[.32,6,.4]} color={silver} round/>
          <Beam from={[x,8.5,z]} to={[x*.7,10,z]} r={.18} color={silver}/>
          <Box at={[x,3.1,z]} size={[.7,1.2,.8]} color={steel} round/>
        </group>)}
        <Box at={[0,10,z]} size={[9.8,.3,.4]} color={silver}/>
      </group>)}
      <Box at={[0,8.3,-2.2]} size={[10,1.3,.3]} color={steel} round/>
      <Box at={[0,9.94,2]} size={[9.6,.12,8]} color="#8d9e9c"/>
      <Box at={[0,5.8,6.1]} size={[13.5,6.7,.5]} color="#718680" round/>
      <Box at={[0,5.4,5.8]} size={[7,5.8,.3]} color={steel} round/>
      {[-1,1].map(s=><group key={s}>
        <Box at={[s*1.65,5.4,5.6]} size={[3.15,5.4,.15]} color={silver} round/>
        {[3.1,4.1,7.6].map(y=><Box key={y} at={[s*1.65,y,5.48]} size={[2.9,.045,.055]} color={steel}/>)}
        <Box at={[s*.3,5,5.4]} size={[.12,.65,.12]} color={steel} round/>
        <Box at={[s*1.65,6.25,5.49]} size={[2.5,1.4,.04]} color="#355a68" round/>
        <Box at={[s*3.7,5.4,5.5]} size={[.09,4,.06]} color="#b6e4df"/>
        <Box at={[s*5.3,3.8,3]} size={[2,2.3,2]} color="#9b8e6c" round/>
        <Box at={[s*5.3,3.8,3]} size={[2.03,.15,2.03]} color={steel}/>
        {[-.9,.9].map(x=><Box key={x} at={[s*5.3+x,3.8,1.98]} size={[.13,2.2,.09]} color={silver}/>)}
        <Box at={[s*5.3,4.3,1.97]} size={[.7,.4,.035]} color={cream}/>
        <Box at={[s*5.3,4.3,1.94]} size={[.4,.045,.025]} color={steel}/>
        <Box at={[s*5.3,2.68,3]} size={[2.2,.12,2.2]} color={steel}/>
        <Box at={[s*5.3,4.98,3]} size={[2.2,.1,2.2]} color={silver}/>
        <Box at={[s*5.2,5.8,5.78]} size={[1.5,2.8,.16]} color={steel} round/>
        {[0,1,2,3,4,5,6,7].map(i=><Box key={i} at={[s*5.2,4.7+i*.29,5.67]} size={[1.2,.08,.13]} color={silver}/> )}
      </group>)}
      {[0,1,2,3,4].map(i=><Box key={i} at={[0,2.58,-1+i*1.4]} size={[.09,.025,.7]} color="#c66b3c"/>)}
    </Bake>
    <Label at={[0,8.45,-2.38]} rotation={[0,Math.PI,0]} size={.45} color={cream}>MOSHE'S LAB / ORBITAL HABITAT</Label>
    <Label at={[0,7.98,-2.39]} rotation={[0,Math.PI,0]} size={.19} color={silver}>Dock 01 / Service arrivals</Label>
    {/* The docking wing is exterior scenery, beyond the existing safety rail. */}
    {[-1,1].map(s=><mesh key={s} position={[s*7,6,2]}>
      <boxGeometry args={[.06,6,8]}/>
      <meshPhysicalMaterial color="#b6d7da" transparent opacity={.16} roughness={.2} depthWrite={false}/>
    </mesh>)}
  </group>;
}

function GreenhouseWing() {
  return <group position={[44,0,7]}>
    <Bake>
      <Box at={[0,.4,0]} size={[8,.8,27]} color={steel} round/>
      <Box at={[0,.85,0]} size={[7.8,.1,26.8]} color="#8f9c90"/>
      {[-12,-6,0,6,12].map(z=><group key={z}>
        {[-3.7,3.7].map(x=><group key={x}>
          <Box at={[x,3.6,z]} size={[.16,5.6,.2]} color={silver}/>
          <Beam from={[x,6.4,z]} to={[0,8,z]} r={.09} color={silver}/>
        </group>)}
        <Beam from={[-3.7,6.4,z]} to={[3.7,6.4,z]} r={.04} color={silver}/>
      </group>)}
      <Beam from={[0,8,-12]} to={[0,8,12]} r={.12} color={steel}/>
      {[-1,1].map(s=><group key={s}>
        <Beam from={[s*3.7,6.4,-12]} to={[s*3.7,6.4,12]} r={.12} color={steel}/>
        {[1.1,2.8].map(y=><group key={y}>
          <Box at={[s*2.2,y,0]} size={[2.2,.2,23]} color={cream} round/>
          {[-9,-5,-1,3,7].map(z=><Planter key={z} at={[s*2.2,y+.1,z]} long={2.6}/>)}
        </group>)}
        <Beam from={[s*3.6,1,-12]} to={[s*3.6,1,12]} r={.09} color="#397ca5"/>
      </group>)}
      <Box at={[0,5.2,12.2]} size={[6,.8,.2]} color={steel} round/>
    </Bake>
    <Label at={[0,5.2,12.32]} size={.28} color={cream}>Habitat nursery / Water recovery</Label>
    {[-1,1].map(s=><mesh key={s} position={[s*1.85,7.22,0]} rotation={[0,0,-s*.409]}>
      <boxGeometry args={[4.04,.035,24]}/>
      <meshPhysicalMaterial color="#c7e3d9" transparent opacity={.16} roughness={.3} depthWrite={false}/>
    </mesh>)}
  </group>;
}
export function OrbitalLife(props: { paused: boolean; reduced: boolean }) {
  return <><Orrery {...props}/><DockingHall/><GreenhouseWing/></>;
}
