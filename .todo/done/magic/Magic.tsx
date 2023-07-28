import * as THREE from "https://esm.sh/three@0.154.0";
import { useEffect, useRef } from "preact/hooks";

function create(options: {
  canvas: HTMLCanvasElement;
}) {
  const { canvas } = options;

  const scene = new THREE.Scene();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    canvas,
  });

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  let running = true;
  function render() {
    if (!running) return;
    requestAnimationFrame(render);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000,
    );
    camera.position.z = 5;

    renderer.render(scene, camera);
  }

  render();

  return {
    dispose() {
      running = false;
      observer.disconnect();
      renderer.dispose();
    },
  };
}

export function Magic() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let dispose: () => void;

    requestAnimationFrame(() => {
      const canvas = ref.current;
      if (!canvas) return;

      const renderer = create({
        canvas,
      });

      dispose = renderer.dispose;
    });

    return () => {
      dispose?.();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      class="w-full h-full shadow-lg rounded-lg"
    />
  );
}
