import { Bloom, ChromaticAberration, EffectComposer, Vignette } from '@react-three/postprocessing';

export const PostProcessing = () => {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        intensity={1.5}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.8}
      />
      <ChromaticAberration
        offset={[0.002, 0.002]}
      />
      <Vignette
        offset={0.3}
        darkness={0.7}
      />
    </EffectComposer>
  );
};