import * as THREE from "three";

(() => {
  const stage = document.getElementById("stage");
  const camera = new THREE.Camera();
  camera.position.z = 1;

  const scene = new THREE.Scene();
  const geometry = new THREE.PlaneBufferGeometry(2, 2);

  const texture = new THREE.TextureLoader().load("assets/hexagons.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;

  const color = new THREE.Color(0x103b9f);
  const tiles = new THREE.Vector2(2, 4);

  const uniforms = {
    u_time: { type: "f", value: 1.0 },
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    u_texture: { type: "sampler2D", value: texture },
    u_color: { type: "v2", value: color },
    u_tiles: { type: "v2", value: tiles },
  };

  const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  stage.appendChild(renderer.domElement);

  onCanvasResize();
  window.addEventListener("resize", onCanvasResize);
  document.addEventListener("mousemove", onMouseMove);

  animate();

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    uniforms.u_time.value += 1 / 60;
    renderer.render(scene, camera);
  }

  function onCanvasResize() {
    renderer.setSize(stage.clientWidth, stage.clientHeight);
    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;

    // expected w/h ratio for the texture image to be at
    const ratio = 3;
    let tx = Math.round(stage.clientWidth / 300);
    let ty = Math.round((ratio * stage.clientHeight * tx) / stage.clientWidth);
    uniforms.u_tiles.value.x = tx;
    uniforms.u_tiles.value.y = ty;
  }

  function onMouseMove(event: MouseEvent) {
    uniforms.u_mouse.value.x = event.pageX;
    uniforms.u_mouse.value.y = event.pageY;
  }
})();
