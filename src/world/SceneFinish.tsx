import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

/** Contact shading gives assembled parts weight; low mode retains the direct renderer. */
export function SceneFinish({ low }: { low: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);
  useEffect(() => {
    if (low) return;
    const c = new EffectComposer(gl);
    c.setPixelRatio(Math.min(gl.getPixelRatio(), 1.5));
    const ao = new SSAOPass(scene, camera, size.width, size.height, 16);
    ao.kernelRadius = 7;
    ao.minDistance = .003;
    ao.maxDistance = .12;
    const output = new OutputPass();
    const aa = new SMAAPass();
    const beauty = new RenderPass(scene, camera);
    c.addPass(beauty);
    c.addPass(ao);
    c.addPass(output);
    c.addPass(aa);
    c.setSize(size.width, size.height);
    composer.current = c;
    return () => { composer.current = null; beauty.dispose(); ao.dispose(); output.dispose(); aa.dispose(); c.dispose(); };
  }, [gl, scene, camera, low, size.width, size.height]);
  useFrame((_, dt) => {
    if (composer.current) composer.current.render(dt);
    else gl.render(scene, camera);
  }, 1);
  return null;
}
