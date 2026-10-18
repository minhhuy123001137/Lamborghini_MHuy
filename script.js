/* ==========================================================================
   LAMBORGHINI AVENTADOR SVJ 3D SHOWCASE — BEYOND THE LIMITS
   Authentic 3D Aventador SVJ Model, Aerodynamic Wind Tunnel & Dynamic Drive-By Reveals
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
   * 1. NAVIGATION & GENERAL UI
   * ------------------------------------------------------------------------ */
  const hamburger = document.querySelector('#hamburger');
  const nav = document.querySelector('#nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      hamburger.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');

        const targetId = link.getAttribute('href')?.replace('#', '');
        const targetSection = document.getElementById(targetId);
        if (targetSection && targetSection.classList.contains('car-reveal-section')) {
          setTimeout(() => executeDriveBy(targetSection, true), 350);
        }
      });
    });
  }

  // Model Selector
  const modelInfo = {
    revuelto: {
      title: 'AVENTADOR SVJ',
      text: 'Đỉnh cao của dòng siêu xe V12 hút khí tự nhiên thuần khiết từ Lamborghini. Thiết kế nêm khí động học ALA 2.0 chủ động với cánh gió đuôi carbon và màu cam Arancio Atlas rực lửa, từng lập kỷ lục hoàn thành vòng đua Nürburgring Nordschleife.'
    },
    temerario: {
      title: 'TEMERARIO',
      text: 'Mẫu siêu xe hybrid thế hệ mới sử dụng động cơ V8 tăng áp kép với vòng tua máy lên đến 10,000 RPM, kết hợp luồng khí động học giải nhiệt tối ưu.'
    },
    urus: {
      title: 'URUS SE',
      text: 'Mẫu Super SUV plug-in hybrid kết hợp tư thế mạnh mẽ, không gian sử dụng đa dụng và DNA khí động học tốc độ đặc trưng của Lamborghini.'
    }
  };

  document.querySelectorAll('.model-more').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.target;
      const info = modelInfo[id];
      if (!info) return;

      document.querySelectorAll('.model-card').forEach(card => {
        card.classList.toggle('active', card.dataset.model === id);
      });

      const titleEl = document.querySelector('#detailTitle');
      const textEl = document.querySelector('#detailText');
      if (titleEl) titleEl.textContent = info.title;
      if (textEl) textEl.textContent = info.text;

      document.querySelector('#modelDetail')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  // Cursor Glow Follower
  const glow = document.querySelector('#cursorGlow');
  window.addEventListener('pointermove', e => {
    if (glow) {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }
  });


  /* ------------------------------------------------------------------------
   * 2. WEB AUDIO API — REAL-TIME SUPERCAR V12 ENGINE & WHOOSH SOUNDS
   * ------------------------------------------------------------------------ */
  let audioCtx = null;
  let engineGain = null;
  let engineOsc1 = null;
  let engineOsc2 = null;
  let isSoundEnabled = false;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      engineGain = audioCtx.createGain();
      engineGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      engineGain.connect(audioCtx.destination);

      engineOsc1 = audioCtx.createOscillator();
      engineOsc1.type = 'sawtooth';
      engineOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      engineOsc2 = audioCtx.createOscillator();
      engineOsc2.type = 'triangle';
      engineOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);

      const engineFilter = audioCtx.createBiquadFilter();
      engineFilter.type = 'lowpass';
      engineFilter.frequency.setValueAtTime(260, audioCtx.currentTime);

      engineOsc1.connect(engineFilter);
      engineOsc2.connect(engineFilter);
      engineFilter.connect(engineGain);

      engineOsc1.start();
      engineOsc2.start();
    } catch (e) {
      console.warn('AudioContext not available:', e);
    }
  }

  function setSoundState(enabled) {
    isSoundEnabled = enabled;
    const soundBtn = document.querySelector('#soundToggle');
    if (soundBtn) {
      soundBtn.classList.toggle('active', enabled);
      soundBtn.querySelector('.btn-icon').textContent = enabled ? '🔊' : '🔇';
      soundBtn.querySelector('.btn-text').textContent = enabled ? 'SOUND: BẬT' : 'SOUND: TẮT';
    }

    if (enabled) {
      initAudio();
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (engineGain) {
        engineGain.gain.cancelScheduledValues(audioCtx.currentTime);
        engineGain.gain.exponentialRampToValueAtTime(0.06, audioCtx.currentTime + 0.3);
      }
    } else {
      if (engineGain && audioCtx) {
        engineGain.gain.cancelScheduledValues(audioCtx.currentTime);
        engineGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      }
    }
  }

  document.querySelector('#soundToggle')?.addEventListener('click', () => {
    setSoundState(!isSoundEnabled);
  });

  function playDriveBySound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const duration = 1.25;

      const bufferSize = audioCtx.sampleRate * duration;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(3.0, now);
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(220, now + duration);

      let panner = null;
      if (audioCtx.createStereoPanner) {
        panner = audioCtx.createStereoPanner();
        panner.pan.setValueAtTime(-0.95, now);
        panner.pan.linearRampToValueAtTime(0.95, now + duration);
      }

      const whooshGain = audioCtx.createGain();
      whooshGain.gain.setValueAtTime(0.001, now);
      whooshGain.gain.exponentialRampToValueAtTime(0.35, now + 0.45);
      whooshGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const revOsc = audioCtx.createOscillator();
      revOsc.type = 'sawtooth';
      revOsc.frequency.setValueAtTime(140, now);
      revOsc.frequency.exponentialRampToValueAtTime(320, now + 0.48);
      revOsc.frequency.exponentialRampToValueAtTime(110, now + duration);

      const revGain = audioCtx.createGain();
      revGain.gain.setValueAtTime(0.001, now);
      revGain.gain.exponentialRampToValueAtTime(0.12, now + 0.48);
      revGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      revOsc.connect(filter);
      if (panner) {
        filter.connect(panner);
        panner.connect(whooshGain);
      } else {
        filter.connect(whooshGain);
      }
      whooshGain.connect(audioCtx.destination);

      noise.start(now);
      revOsc.start(now);
      noise.stop(now + duration);
      revOsc.stop(now + duration);
    } catch (err) {
      console.warn('Drive-by sound error:', err);
    }
  }


  /* ------------------------------------------------------------------------
   * 3. CAR DRIVE-BY SECTION REVEAL MECHANISM ("KÉO RA PHẦN NỘI DUNG")
   * ------------------------------------------------------------------------ */
  const driveByRunningMap = new Map();

  function executeDriveBy(section, force = false) {
    if (!section) return;
    if (driveByRunningMap.get(section)) return;

    const vehicle = section.querySelector('.car-driveby-vehicle');
    const content = section.querySelector('.car-reveal-content');
    if (!vehicle || !content) return;

    driveByRunningMap.set(section, true);
    section.classList.remove('revealed');
    section.classList.add('driving-by');
    vehicle.style.opacity = '1';

    playDriveBySound();

    const duration = 1200;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const sectionWidth = section.offsetWidth || window.innerWidth;
      const startX = -480;
      const endX = sectionWidth + 120;
      const currentX = startX + (endX - startX) * ease;

      vehicle.style.left = `${currentX}px`;

      const trailingEdgeX = currentX + 80;
      const percentage = Math.max(0, Math.min(100, (trailingEdgeX / sectionWidth) * 100));

      section.style.setProperty('--car-x', `${percentage}%`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        section.classList.remove('driving-by');
        section.classList.add('revealed');
        vehicle.style.opacity = '0';
        vehicle.style.left = '-500px';
        driveByRunningMap.set(section, false);
      }
    }

    requestAnimationFrame(animate);
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        if (!section.classList.contains('revealed') && !driveByRunningMap.get(section)) {
          executeDriveBy(section);
        }
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.car-reveal-section').forEach(section => {
    sectionObserver.observe(section);
  });

  document.querySelectorAll('.driveby-replay-btn').forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = button.dataset.target;
      const section = document.getElementById(targetId);
      if (section) {
        executeDriveBy(section, true);
      }
    });
  });

  document.querySelector('#heroDriveTestBtn')?.addEventListener('click', () => {
    if (!isSoundEnabled) {
      setSoundState(true);
    }
    triggerTurboBoost();
    const designSection = document.getElementById('design');
    if (designSection) {
      designSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => executeDriveBy(designSection, true), 400);
    }
  });


  /* ------------------------------------------------------------------------
   * 4. THREE.JS 3D SCENE — AUTHENTIC LAMBORGHINI AVENTADOR SVJ (IMAGE 2)
   * ------------------------------------------------------------------------ */
  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas || typeof THREE === 'undefined') {
    console.warn('Three.js not loaded or canvas missing');
    return;
  }

  const scene = new THREE.Scene();
  // Daytime Desert Atmosphere — Horizon haze matching user reference image
  scene.background = new THREE.Color(0xd4e9fb);
  scene.fog = new THREE.Fog(0xd4e9fb, 45, 230);

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 350);
  camera.position.set(3.6, 1.6, 5.2);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Brilliant Natural Desert Sunlight & Sky Atmosphere
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  // Hemisphere Light: Radiant sky blue from above + Warm golden desert bounce from below
  const hemiLight = new THREE.HemisphereLight(0x56a4ff, 0xdeb470, 1.25);
  scene.add(hemiLight);

  // Main Sun Light: High-angle bright sunlight illuminating the road and golden hills
  const sunLight = new THREE.DirectionalLight(0xfff6e4, 2.75);
  sunLight.position.set(24, 45, -16);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 120;
  sunLight.shadow.camera.left = -25;
  sunLight.shadow.camera.right = 25;
  sunLight.shadow.camera.top = 25;
  sunLight.shadow.camera.bottom = -25;
  sunLight.shadow.bias = -0.0003;
  scene.add(sunLight);

  // Warm Desert Fill Light
  const desertFillLight = new THREE.DirectionalLight(0xffe2b8, 0.75);
  desertFillLight.position.set(-20, 25, 25);
  scene.add(desertFillLight);

  // Rim Light accentuating the Aventador SVJ's angular carbon edges
  const sunRimLight = new THREE.DirectionalLight(0xffeaad, 1.1);
  sunRimLight.position.set(-15, 8, -25);
  scene.add(sunRimLight);

  // Car Root & Suspension Container
  const carRoot = new THREE.Group();
  scene.add(carRoot);

  const bodyGroup = new THREE.Group();
  carRoot.add(bodyGroup);

  // Exact Arancio Atlas / Argos Metallic Orange Paint (matching user Image 2)
  let carPaintMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xff5500), // Fiery metallic orange
    metalness: 0.76,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.95
  });

  const carbonFiberMaterial = new THREE.MeshStandardMaterial({
    color: 0x141517,
    roughness: 0.38,
    metalness: 0.45
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0c1218,
    metalness: 0.95,
    roughness: 0.08,
    transmission: 0.45,
    opacity: 0.82,
    transparent: true
  });

  let animatedWheels = [];
  let frontSteerWheels = [];

  // Projector Headlights
  const headSpotL = new THREE.SpotLight(0xffffff, 4.2, 30, Math.PI / 6, 0.45);
  headSpotL.position.set(0.68, 0.52, 1.95);
  headSpotL.target.position.set(0.8, 0, 16);
  scene.add(headSpotL.target);
  scene.add(headSpotL);

  const headSpotR = headSpotL.clone();
  headSpotR.position.x = -0.68;
  headSpotR.target.position.set(-0.8, 0, 16);
  scene.add(headSpotR.target);
  scene.add(headSpotR);

  // Dual Central Exhaust Flame Cones
  const flameMaterial = new THREE.MeshBasicMaterial({
    color: 0x4fa8ff,
    transparent: true,
    opacity: 0.85
  });
  const exhaustFlameL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.42, 8), flameMaterial);
  exhaustFlameL.rotation.x = -Math.PI / 2;
  exhaustFlameL.position.set(0.12, 0.44, -2.48);

  const exhaustFlameR = exhaustFlameL.clone();
  exhaustFlameR.position.x = -0.12;
  bodyGroup.add(exhaustFlameL, exhaustFlameR);

  // Ground Contact Shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 128;
  shadowCanvas.height = 256;
  const sCtx = shadowCanvas.getContext('2d');
  const sGrad = sCtx.createRadialGradient(64, 128, 10, 64, 128, 64);
  sGrad.addColorStop(0, 'rgba(0,0,0,0.88)');
  sGrad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
  sGrad.addColorStop(1, 'rgba(0,0,0,0)');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 128, 256);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(2.6, 5.3),
    new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    })
  );
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = 0.015;
  scene.add(contactShadow);

  /* --- SVJ SPECIFIC AERO ENHANCEMENTS (ALA 2.0 REAR WING & BONNET NOSTRILS) --- */
  // As clearly shown in user Image 2: High Swan-Neck SVJ Carbon Wing + Central Fin
  const svjWingPylonC = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.35), carbonFiberMaterial);
  svjWingPylonC.position.set(0, 0.95, -2.18);
  bodyGroup.add(svjWingPylonC);

  const svjWingPylonL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.35, 0.28), carbonFiberMaterial);
  svjWingPylonL.position.set(0.62, 0.92, -2.18);
  const svjWingPylonR = svjWingPylonL.clone();
  svjWingPylonR.position.x = -0.62;
  bodyGroup.add(svjWingPylonL, svjWingPylonR);

  // Elevated Carbon Wing Blade
  const svjWingBlade = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.04, 0.36), carbonFiberMaterial);
  svjWingBlade.position.set(0, 1.12, -2.25);
  svjWingBlade.rotation.x = 0.08;
  bodyGroup.add(svjWingBlade);

  // Wing Endplates
  const svjEndplateL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.42), carbonFiberMaterial);
  svjEndplateL.position.set(1.08, 1.12, -2.25);
  const svjEndplateR = svjEndplateL.clone();
  svjEndplateR.position.x = -1.08;
  bodyGroup.add(svjEndplateL, svjEndplateR);

  // Dual SVJ Bonnet Nostril Extractors (Black ALA 2.0 Air Vents on Hood - exactly like Image 2)
  const nostrilL = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.03, 0.45), carbonFiberMaterial);
  nostrilL.position.set(0.24, 0.58, 1.35);
  nostrilL.rotation.x = -0.12;
  nostrilL.rotation.y = -0.06;
  const nostrilR = nostrilL.clone();
  nostrilR.position.x = -0.24;
  nostrilR.rotation.y = 0.06;
  bodyGroup.add(nostrilL, nostrilR);

  /* --- FAST IN-MEMORY DECODING (Immune to file:/// CORS & Zero Network Latency) --- */
  function base64ToArrayBuffer(base64) {
    const commaIdx = base64.indexOf(',');
    const rawBase64 = commaIdx >= 0 ? base64.substring(commaIdx + 1) : base64;
    const binaryString = window.atob(rawBase64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function setupGlbModel(gltf) {
    const model = gltf.scene;

    // Scale from centimeters to meters (exact 1:1 Aventador SVJ proportions)
    model.scale.set(0.01, 0.01, 0.01);
    model.position.set(0, 0, 0);

    const wheelMeshes = [];

    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name;

        // Apply vibrant metallic orange SVJ body paint
        if (name.includes('Body') || name.includes('base_phong')) {
          if (child.material) {
            carPaintMaterial.map = child.material.map || null;
            child.material = carPaintMaterial;
          }
        }
        // Cockpit canopy glass
        else if (name.includes('Glass')) {
          child.material = glassMaterial;
        }

        // Collect wheel meshes to set up clean pivots without modifying tree during traversal
        if (name.startsWith('Wheel_')) {
          wheelMeshes.push(child);
        }
      }
    });

    // Rig wheels cleanly with dedicated steering pivots for front wheels (prevents rotation axis wobble)
    wheelMeshes.forEach(child => {
      const name = child.name;
      if (child.geometry) {
        child.geometry.computeBoundingBox();
        const center = new THREE.Vector3();
        child.geometry.boundingBox.getCenter(center);
        child.geometry.center();

        if (name.includes('_F')) {
          // Front Steerable Wheels:
          // Create an independent steering pivot group at the wheel axle center
          const parent = child.parent || model;
          const steerPivot = new THREE.Group();
          steerPivot.name = name + '_SteerPivot';
          steerPivot.position.copy(center);
          parent.add(steerPivot);

          // Place the wheel mesh at local (0, 0, 0) inside the steering pivot
          child.position.set(0, 0, 0);
          steerPivot.add(child);

          // Animated wheels roll exclusively on local horizontal X-axis
          animatedWheels.push(child);
          // Steer pivot steers exclusively on vertical Y-axis
          frontSteerWheels.push(steerPivot);
        } else {
          // Rear Wheels (fixed axle, roll exclusively on X-axis)
          child.position.copy(center);
          animatedWheels.push(child);
        }
      }
    });

    bodyGroup.add(model);
    console.log('Lamborghini Aventador SVJ 3D Model Loaded Successfully!');
  }

  // Load the 3D model: prioritize in-memory Base64 (works on file:/// with zero CORS issues)
  if (typeof THREE.GLTFLoader !== 'undefined') {
    const loader = new THREE.GLTFLoader();

    if (typeof window.LAMBORGHINI_GLB_DATA !== 'undefined' && window.LAMBORGHINI_GLB_DATA) {
      try {
        const buffer = base64ToArrayBuffer(window.LAMBORGHINI_GLB_DATA);
        loader.parse(buffer, '', setupGlbModel, (err) => {
          console.warn('Error parsing embedded GLB, trying file fetch:', err);
          loader.load('models/lamborghini.glb', setupGlbModel);
        });
      } catch (e) {
        console.warn('Base64 decode failed, trying file fetch:', e);
        loader.load('models/lamborghini.glb', setupGlbModel);
      }
    } else {
      loader.load('models/lamborghini.glb', setupGlbModel);
    }
  }

  /* --- 5. AERODYNAMIC WIND TUNNEL & SPEED STREAMLINES ("LƯỚT GIÓ") --- */
  const windGroup = new THREE.Group();
  scene.add(windGroup);

  // 8 Exact Aerodynamic Splines hugging the Aventador SVJ contours
  const streamlineCurves = [
    // 1. Centerline: Splitter -> Nose badge -> Bonnet ALA vents -> Windscreen -> Roof -> SVJ Wing -> Wake
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.16, 2.45),
      new THREE.Vector3(0, 0.38, 2.05),
      new THREE.Vector3(0, 0.56, 1.35),
      new THREE.Vector3(0, 0.72, 0.75),
      new THREE.Vector3(0, 1.08, -0.05),
      new THREE.Vector3(0, 1.16, -0.45),
      new THREE.Vector3(0, 0.95, -1.25),
      new THREE.Vector3(0, 0.82, -1.85),
      new THREE.Vector3(0, 1.15, -2.25),
      new THREE.Vector3(0, 1.12, -4.6)
    ]),
    // 2. Left Front Fender & Shoulder Line
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.85, 0.18, 2.3),
      new THREE.Vector3(0.82, 0.48, 1.7),
      new THREE.Vector3(0.92, 0.68, 1.25),
      new THREE.Vector3(0.78, 0.85, 0.45),
      new THREE.Vector3(0.68, 1.12, -0.4),
      new THREE.Vector3(0.98, 0.78, -1.45),
      new THREE.Vector3(1.08, 1.15, -2.25),
      new THREE.Vector3(1.15, 1.1, -4.8)
    ]),
    // 3. Right Front Fender & Shoulder Line
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.85, 0.18, 2.3),
      new THREE.Vector3(-0.82, 0.48, 1.7),
      new THREE.Vector3(-0.92, 0.68, 1.25),
      new THREE.Vector3(-0.78, 0.85, 0.45),
      new THREE.Vector3(-0.68, 1.12, -0.4),
      new THREE.Vector3(-0.98, 0.78, -1.45),
      new THREE.Vector3(-1.08, 1.15, -2.25),
      new THREE.Vector3(-1.15, 1.1, -4.8)
    ]),
    // 4. Left Massive Side Intake Scoop Stream
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.05, 0.28, 1.4),
      new THREE.Vector3(1.08, 0.46, -0.4),
      new THREE.Vector3(0.85, 0.38, -1.8),
      new THREE.Vector3(0.75, 0.22, -3.8)
    ]),
    // 5. Right Massive Side Intake Scoop Stream
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.05, 0.28, 1.4),
      new THREE.Vector3(-1.08, 0.46, -0.4),
      new THREE.Vector3(-0.85, 0.38, -1.8),
      new THREE.Vector3(-0.75, 0.22, -3.8)
    ]),
    // 6. Left Mirror Vortex
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.02, 0.76, 0.45),
      new THREE.Vector3(1.18, 0.82, -0.4),
      new THREE.Vector3(1.22, 0.88, -2.5)
    ]),
    // 7. Right Mirror Vortex
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.02, 0.76, 0.45),
      new THREE.Vector3(-1.18, 0.82, -0.4),
      new THREE.Vector3(-1.22, 0.88, -2.5)
    ]),
    // 8. Underbody Ground Effect Stream
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.08, 2.35),
      new THREE.Vector3(0, 0.07, 0.0),
      new THREE.Vector3(0, 0.25, -2.35),
      new THREE.Vector3(0, 0.45, -4.2)
    ])
  ];

  const streamlineParticles = [];

  streamlineCurves.forEach((curve, index) => {
    const points = curve.getPoints(60);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: index % 2 === 0 ? 0xff7700 : 0xffffff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, mat);
    windGroup.add(line);

    for (let p = 0; p < 4; p++) {
      const bead = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.95,
          blending: THREE.AdditiveBlending
        })
      );
      windGroup.add(bead);
      streamlineParticles.push({
        mesh: bead,
        curve: curve,
        progress: (p / 4 + index * 0.12) % 1,
        speed: 0.46 + (index % 3) * 0.08
      });
    }
  });

  // Ambient Speed Streaks (420 Speed Lines)
  const streakCount = 420;
  const streakGeometry = new THREE.BufferGeometry();
  const streakPositions = new Float32Array(streakCount * 6);
  const streakVelocities = new Float32Array(streakCount);

  for (let i = 0; i < streakCount; i++) {
    const x = (Math.random() - 0.5) * 16;
    const y = 0.15 + Math.random() * 4.8;
    const z = -35 + Math.random() * 65;
    const len = 1.2 + Math.random() * 3.5;

    streakPositions[i * 6] = x;
    streakPositions[i * 6 + 1] = y;
    streakPositions[i * 6 + 2] = z;

    streakPositions[i * 6 + 3] = x;
    streakPositions[i * 6 + 4] = y;
    streakPositions[i * 6 + 5] = z + len;

    streakVelocities[i] = 34 + Math.random() * 26;
  }

  streakGeometry.setAttribute('position', new THREE.BufferAttribute(streakPositions, 3));
  const streakMaterial = new THREE.LineBasicMaterial({
    color: 0xff8822,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });
  const streakField = new THREE.LineSegments(streakGeometry, streakMaterial);
  windGroup.add(streakField);

  /* ==========================================================================
   * 5. PHOTOREALISTIC DESERT HIGHWAY, ROLLING GOLDEN HILLS & CLOUDS ENVIRONMENT
   * (Meticulously crafted to match user reference image: authentic Australian/desert
   *  road, wire-rope green barrier, golden rolling hills, 3D wild grass tufts,
   *  eucalyptus trees, and realistic sky with billowing 3D cumulus clouds)
   * ========================================================================== */
  const environmentGroup = new THREE.Group();
  scene.add(environmentGroup);

  // 1. High-Resolution Atmospheric Sky Dome with Rayleigh Scattering & Sun Corona
  function createSkyTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Natural multi-stop sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1024);
    grad.addColorStop(0.00, '#1248a3'); // Deep royal blue zenith
    grad.addColorStop(0.20, '#1f65d6'); // Rich cerulean blue
    grad.addColorStop(0.45, '#4288ea'); // Daylight azure
    grad.addColorStop(0.70, '#7bb3f4'); // Soft atmospheric blue
    grad.addColorStop(0.88, '#b6d7fa'); // Pale sky blue near horizon
    grad.addColorStop(0.96, '#dceaf9'); // Subtle horizon haze
    grad.addColorStop(1.00, '#e8f2fc'); // Warm horizon ground merge
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Brilliant Sun Disk & Solar Corona
    const sunX = 720;
    const sunY = 260;
    const coronaGrad = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 260);
    coronaGrad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
    coronaGrad.addColorStop(0.06, 'rgba(255, 250, 230, 0.95)');
    coronaGrad.addColorStop(0.22, 'rgba(255, 235, 180, 0.55)');
    coronaGrad.addColorStop(0.55, 'rgba(255, 215, 140, 0.18)');
    coronaGrad.addColorStop(1.00, 'rgba(255, 200, 100, 0.0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 260, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  const skyGeo = new THREE.SphereGeometry(230, 32, 24);
  const skyMat = new THREE.MeshBasicMaterial({
    map: createSkyTexture(),
    side: THREE.BackSide,
    depthWrite: false
  });
  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  environmentGroup.add(skyDome);

  // 2. Realistic Multi-Tier 3D Cumulus Clouds (Billowing white tops & soft shaded bellies)
  const cloudsGroup = new THREE.Group();
  environmentGroup.add(cloudsGroup);
  const cloudClusters = [];

  function createCumulusCluster(scale = 1.0) {
    const cluster = new THREE.Group();
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.96,
      roughness: 0.94
    });

    const puffCount = 10 + Math.floor(Math.random() * 6);
    for (let p = 0; p < puffCount; p++) {
      const pr = (2.4 + Math.random() * 2.8) * scale;
      const puffGeo = new THREE.DodecahedronGeometry(pr, 1);
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set(
        (Math.random() - 0.5) * 9.5 * scale,
        (Math.random() * 0.8 - 0.2) * 2.8 * scale,
        (Math.random() - 0.5) * 7.0 * scale
      );
      puff.scale.set(1.4, 0.72 + Math.random() * 0.25, 1.25);
      cluster.add(puff);
    }
    return cluster;
  }

  function createHorizonCloudBank(widthScale = 2.5) {
    const cluster = new THREE.Group();
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xfcfdff,
      transparent: true,
      opacity: 0.88,
      roughness: 0.96
    });

    const puffCount = 6 + Math.floor(Math.random() * 4);
    for (let p = 0; p < puffCount; p++) {
      const pr = 3.5 + Math.random() * 3.0;
      const puffGeo = new THREE.DodecahedronGeometry(pr, 1);
      const puff = new THREE.Mesh(puffGeo, cloudMat);
      puff.position.set(
        (p - puffCount / 2) * 6.5 * widthScale,
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 4.0
      );
      puff.scale.set(widthScale, 0.45, 1.3);
      cluster.add(puff);
    }
    return cluster;
  }

  // Generate Overhead & Midground Billowing Cumulus
  for (let c = 0; c < 18; c++) {
    const scale = 0.95 + Math.random() * 1.5;
    const cloudMesh = createCumulusCluster(scale);
    const cx = (Math.random() - 0.5) * 260;
    const cy = 32 + Math.random() * 38;
    const cz = -150 + Math.random() * 200;
    cloudMesh.position.set(cx, cy, cz);
    cloudsGroup.add(cloudMesh);
    cloudClusters.push({
      group: cloudMesh,
      speed: 0.42 + Math.random() * 0.4
    });
  }

  // Generate Distant Horizon Stratocumulus Banks (matching photo)
  for (let h = 0; h < 8; h++) {
    const cloudMesh = createHorizonCloudBank(2.2 + Math.random() * 1.5);
    const cx = -120 + h * 34 + (Math.random() - 0.5) * 15;
    const cy = 20 + Math.random() * 12;
    const cz = -130 - Math.random() * 45;
    cloudMesh.position.set(cx, cy, cz);
    cloudsGroup.add(cloudMesh);
    cloudClusters.push({
      group: cloudMesh,
      speed: 0.22 + Math.random() * 0.2
    });
  }

  // 3. Desert Road Curve Function (Sweeps smoothly to the right into the distance)
  function getRoadCenter(z) {
    if (z >= 0) {
      return -Math.sin(z * 0.04) * 2.5;
    }
    const t = -z;
    return Math.sin(t * 0.024) * 16.5 + (t * 0.052);
  }

  // 4. High-Definition Asphalt Road Texture & Bump Map (1024 x 2048)
  function createRoadMaps() {
    // Diffuse Map
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');

    // Asphalt base dark charcoal
    ctx.fillStyle = '#222327';
    ctx.fillRect(0, 0, 1024, 2048);

    // Multi-layer pebble aggregate noise
    const imgData = ctx.getImageData(0, 0, 1024, 2048);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 24;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Dark polished tire tracks in both lanes
    ctx.fillStyle = 'rgba(16, 17, 20, 0.48)';
    ctx.fillRect(230, 0, 90, 2048);
    ctx.fillRect(390, 0, 90, 2048);
    ctx.fillRect(555, 0, 90, 2048);
    ctx.fillRect(715, 0, 90, 2048);

    // Outer gravel & sand road shoulders (Left: 0..120, Right: 904..1024)
    const gradL = ctx.createLinearGradient(0, 0, 120, 0);
    gradL.addColorStop(0.0, '#a1865e');
    gradL.addColorStop(0.7, '#8f764f');
    gradL.addColorStop(1.0, 'rgba(143, 118, 79, 0)');
    ctx.fillStyle = gradL;
    ctx.fillRect(0, 0, 120, 2048);

    const gradR = ctx.createLinearGradient(1024, 0, 904, 0);
    gradR.addColorStop(0.0, '#a1865e');
    gradR.addColorStop(0.7, '#8f764f');
    gradR.addColorStop(1.0, 'rgba(143, 118, 79, 0)');
    ctx.fillStyle = gradR;
    ctx.fillRect(904, 0, 120, 2048);

    // Left continuous solid white line
    ctx.fillStyle = '#f5f7fa';
    ctx.fillRect(128, 0, 14, 2048);

    // Right edge dashed white line
    const dashH = 104;
    const gapH = 72;
    for (let y = 0; y < 2048; y += dashH + gapH) {
      ctx.fillRect(882, y, 14, dashH);
    }

    // Double continuous white center divider lines
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(498, 0, 10, 2048);
    ctx.fillRect(516, 0, 10, 2048);

    // Raised reflective cat's eyes on center line
    ctx.fillStyle = '#fff4cc';
    for (let y = 28; y < 2048; y += 180) {
      ctx.fillRect(507, y, 10, 20);
    }

    const diffuseTex = new THREE.CanvasTexture(canvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;
    diffuseTex.repeat.set(1, 4);

    // Bump Map for real asphalt relief
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 512;
    bCanvas.height = 1024;
    const bCtx = bCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 512, 1024);
    const bImg = bCtx.getImageData(0, 0, 512, 1024);
    const bData = bImg.data;
    for (let i = 0; i < bData.length; i += 4) {
      const n = (Math.random() - 0.5) * 55;
      bData[i] = Math.max(0, Math.min(255, 128 + n));
      bData[i + 1] = bData[i];
      bData[i + 2] = bData[i];
    }
    bCtx.putImageData(bImg, 0, 0);

    const bumpTex = new THREE.CanvasTexture(bCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(1, 4);

    return { diffuse: diffuseTex, bump: bumpTex };
  }

  const roadMaps = createRoadMaps();
  const roadTexture = roadMaps.diffuse;
  const roadMat = new THREE.MeshStandardMaterial({
    map: roadMaps.diffuse,
    bumpMap: roadMaps.bump,
    bumpScale: 0.025,
    roughness: 0.42,
    metalness: 0.22
  });

  // Curved Asphalt Road Ribbon Mesh
  function createCurvedRoadMesh() {
    const segments = 180;
    const zStart = 32;
    const zEnd = -145;
    const roadWidth = 10.8;
    const halfW = roadWidth / 2;

    const positions = [];
    const uvs = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const z = zStart + (zEnd - zStart) * t;
      const zNext = z - 0.5;
      const cx = getRoadCenter(z);
      const cxNext = getRoadCenter(zNext);

      const dz = zNext - z;
      const dx = cxNext - cx;
      const len = Math.sqrt(dx * dx + dz * dz) || 1;
      const nx = -dz / len;
      const nz = dx / len;

      positions.push(cx + nx * halfW, 0.02, z + nz * halfW);
      uvs.push(0, t * 14);

      positions.push(cx - nx * halfW, 0.02, z - nz * halfW);
      uvs.push(1, t * 14);

      if (i < segments) {
        const v0 = i * 2;
        const v1 = i * 2 + 1;
        const v2 = (i + 1) * 2;
        const v3 = (i + 1) * 2 + 1;
        indices.push(v0, v2, v1);
        indices.push(v1, v2, v3);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    const mesh = new THREE.Mesh(geometry, roadMat);
    mesh.receiveShadow = true;
    return mesh;
  }

  const roadMesh = createCurvedRoadMesh();
  environmentGroup.add(roadMesh);

  // 5. Terrain Elevation Calculator (Organic rolling golden hills & smooth road verge)
  function getTerrainElevation(x, z) {
    const rc = getRoadCenter(z);
    const dist = Math.abs(x - rc);
    const roadWidth = 6.6;
    const vergeWidth = 4.2;
    const slopeWidth = 10.0;

    // Road flat bed
    if (dist <= roadWidth) return 0;

    // Road verge & transition to hills
    let blend = 0;
    if (dist > roadWidth) {
      const u = Math.min(1.0, (dist - roadWidth) / (vergeWidth + slopeWidth));
      blend = u * u * (3 - 2 * u); // Smoothstep
    }

    // 1. Prominent golden rolling hill on the left (matching photo)
    let leftHill = 0;
    if (x < rc) {
      const hx = (x - (rc - 40)) / 30;
      const hz = (z + 24) / 45;
      leftHill = Math.exp(-hx * hx - hz * hz) * 21.0;

      // Secondary ridge on the left
      const hx2 = (x - (rc - 65)) / 28;
      const hz2 = (z - 10) / 40;
      leftHill += Math.exp(-hx2 * hx2 - hz2 * hz2) * 14.0;
    }

    // 2. Rolling dunes on the right (matching photo)
    let rightDunes = 0;
    if (x > rc) {
      const rx = (x - (rc + 38)) / 28;
      const rz = (z + 45) / 50;
      rightDunes = Math.exp(-rx * rx - rz * rz) * 11.0;
    }

    // 3. Natural undulating savanna waves across the whole landscape
    const rollingWaves = (
      Math.sin(x * 0.038 + z * 0.018) * 5.8 +
      Math.cos(z * 0.032 - x * 0.022) * 5.0 +
      Math.sin(x * 0.075 + z * 0.06) * 2.6 +
      Math.cos(x * 0.11 - z * 0.08) * 1.3
    );

    // 4. Distant horizon mountain ridges (z < -45)
    let distantRidge = 0;
    if (z < -45) {
      const depth = Math.min(1.0, (-z - 45) / 45.0);
      distantRidge = (Math.sin(x * 0.032) * 9.5 + Math.cos(x * 0.055) * 5.5 + 4.5) * depth;
    }

    return Math.max(0, (rollingWaves + leftHill + rightDunes + distantRidge + 3.2) * blend);
  }

  // 6. High-Definition Golden-Straw Grass & Sand Texture with Relief Bump Map
  function createTerrainMaps() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base warm golden-straw / yellow-ochre tone
    ctx.fillStyle = '#cca462';
    ctx.fillRect(0, 0, 1024, 1024);

    // Layered organic sand & dry grass mottling
    const colors = ['#dfba76', '#b68f4b', '#e8ce92', '#a07d3c', '#d3ac69', '#cca35e'];
    for (let i = 0; i < 7000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = 3 + Math.random() * 9;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fine straw fibers and dry grass blades
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 5000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const len = 4 + Math.random() * 8;
      const ang = (Math.random() - 0.5) * 1.6;
      ctx.strokeStyle = Math.random() > 0.4 ? '#ebd49d' : '#997637';
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.sin(ang) * len, y + Math.cos(ang) * len);
      ctx.stroke();
    }

    const diffuseTex = new THREE.CanvasTexture(canvas);
    diffuseTex.wrapS = THREE.RepeatWrapping;
    diffuseTex.wrapT = THREE.RepeatWrapping;
    diffuseTex.repeat.set(24, 24);

    // Bump Map for straw relief
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 512;
    bCanvas.height = 512;
    const bCtx = bCanvas.getContext('2d');
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 512, 512);
    const bImg = bCtx.getImageData(0, 0, 512, 512);
    const bData = bImg.data;
    for (let i = 0; i < bData.length; i += 4) {
      const n = (Math.random() - 0.5) * 75;
      bData[i] = Math.max(0, Math.min(255, 128 + n));
      bData[i + 1] = bData[i];
      bData[i + 2] = bData[i];
    }
    bCtx.putImageData(bImg, 0, 0);

    const bumpTex = new THREE.CanvasTexture(bCanvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(24, 24);

    return { diffuse: diffuseTex, bump: bumpTex };
  }

  const terrainMaps = createTerrainMaps();
  const terrainMat = new THREE.MeshStandardMaterial({
    map: terrainMaps.diffuse,
    bumpMap: terrainMaps.bump,
    bumpScale: 0.07,
    roughness: 0.90,
    metalness: 0.04
  });

  // Rolling Desert Hills Terrain Mesh (25,600 smooth vertices)
  function createDesertTerrainMesh() {
    const geo = new THREE.PlaneGeometry(280, 280, 160, 160);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vz = pos.getZ(i);
      pos.setY(i, getTerrainElevation(vx, vz));
    }
    geo.computeVertexNormals();

    const mesh = new THREE.Mesh(geo, terrainMat);
    mesh.receiveShadow = true;
    return mesh;
  }

  const terrainMesh = createDesertTerrainMesh();
  environmentGroup.add(terrainMesh);

  // 7. 3D Wild Straw Grass Tufts along Roadside Verge (Breaks silhouette edge for photorealism)
  function createGrassTuftTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 128, 128);

    const colors = ['#e5c88c', '#caa25a', '#dfb872', '#b58f4a', '#8a6b32'];
    for (let b = 0; b < 28; b++) {
      const startX = 64 + (Math.random() - 0.5) * 24;
      const endX = startX + (Math.random() - 0.5) * 48;
      const endY = 12 + Math.random() * 26;
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = 1.8 + Math.random() * 1.2;
      ctx.beginPath();
      ctx.moveTo(startX, 128);
      ctx.quadraticCurveTo(startX + (endX - startX) * 0.4, 70, endX, endY);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  const grassTuftMat = new THREE.MeshLambertMaterial({
    map: createGrassTuftTexture(),
    transparent: true,
    alphaTest: 0.35,
    side: THREE.DoubleSide
  });

  const grassTuftGeo1 = new THREE.PlaneGeometry(1.6, 1.4);
  grassTuftGeo1.translate(0, 0.7, 0);
  const grassTuftGeo2 = grassTuftGeo1.clone();
  grassTuftGeo2.rotateY(Math.PI / 2);

  const grassTuftCombinedGeo = new THREE.BufferGeometry();
  // Simple crossed plane tuft group
  for (let g = 0; g < 95; g++) {
    const gz = -120 + g * 1.5;
    const side = (g % 3 === 0) ? 1 : -1;
    const offset = side * (5.8 + Math.random() * 3.8);
    const gx = getRoadCenter(gz) + offset;
    const gy = getTerrainElevation(gx, gz);

    const tuftGroup = new THREE.Group();
    const p1 = new THREE.Mesh(grassTuftGeo1, grassTuftMat);
    const p2 = new THREE.Mesh(grassTuftGeo2, grassTuftMat);
    p1.castShadow = true;
    tuftGroup.add(p1, p2);

    const sc = 0.8 + Math.random() * 0.6;
    tuftGroup.scale.set(sc, sc, sc);
    tuftGroup.position.set(gx, gy, gz);
    tuftGroup.rotation.y = Math.random() * Math.PI;
    environmentGroup.add(tuftGroup);
  }

  // 8. Roadside Australian Wire-Rope Safety Barrier (Green steel posts with white collar & cables)
  const safetyPosts = [];
  const postCount = 32;
  const postSpacing = 3.8;
  const postGreenMat = new THREE.MeshStandardMaterial({ color: 0x1f472f, roughness: 0.52 });
  const postWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf5f6f8, roughness: 0.35 });
  const cableMat = new THREE.MeshStandardMaterial({ color: 0xc5cbd1, metalness: 0.85, roughness: 0.25 });

  const postGeo = new THREE.CylinderGeometry(0.082, 0.082, 0.95, 12);
  const capGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.14, 12);
  const wireGeo = new THREE.BoxGeometry(0.015, 0.015, postSpacing);

  const postsGroup = new THREE.Group();
  environmentGroup.add(postsGroup);

  for (let i = 0; i < postCount; i++) {
    const pGroup = new THREE.Group();
    // Green post body
    const body = new THREE.Mesh(postGeo, postGreenMat);
    body.position.y = 0.475;
    body.castShadow = true;
    // White reflector sleeve/collar
    const cap = new THREE.Mesh(capGeo, postWhiteMat);
    cap.position.y = 0.95 - 0.08;
    pGroup.add(body, cap);

    // 3 Horizontal galvanized wire rope cables extending to next post
    [0.42, 0.60, 0.78].forEach(wireY => {
      const wire = new THREE.Mesh(wireGeo, cableMat);
      wire.position.set(0, wireY, -postSpacing / 2);
      pGroup.add(wire);
    });

    const initialZ = 22 - i * postSpacing;
    pGroup.position.set(getRoadCenter(initialZ) - 5.2, 0, initialZ);
    postsGroup.add(pGroup);
    safetyPosts.push({ group: pGroup, z: initialZ });
  }

  // 9. Australian Eucalyptus & Acacia Trees (Authentic twisted bark & layered olive foliage)
  const vegetationGroup = new THREE.Group();
  environmentGroup.add(vegetationGroup);

  function createEucalyptusTree(scale = 1.0, isHeroGnarled = false) {
    const treeGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x382d21, roughness: 0.94 });
    const leafColors = [0x425431, 0x52653a, 0x657944, 0x76874e];

    // Main gnarled trunk
    const trunkHeight = (2.6 + Math.random() * 0.9) * scale;
    const trunkGeo = new THREE.CylinderGeometry(0.18 * scale, 0.34 * scale, trunkHeight, 8);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkHeight / 2;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    // 2-4 Spreading Gnarled Branches
    const branchCount = isHeroGnarled ? 4 : (2 + Math.floor(Math.random() * 2));
    for (let b = 0; b < branchCount; b++) {
      const angle = (b / branchCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const bLen = (1.6 + Math.random() * 0.9) * scale;
      const branchGeo = new THREE.CylinderGeometry(0.09 * scale, 0.16 * scale, bLen, 6);
      const branch = new THREE.Mesh(branchGeo, trunkMat);
      branch.position.set(
        Math.cos(angle) * 0.48 * scale,
        trunkHeight * 0.78,
        Math.sin(angle) * 0.48 * scale
      );
      branch.rotation.z = Math.cos(angle) * 0.58;
      branch.rotation.x = Math.sin(angle) * 0.58;
      treeGroup.add(branch);

      // Dead dry branch twig (classic Australian eucalyptus feature)
      if (b === 0 && isHeroGnarled) {
        const dryTwig = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04 * scale, 0.08 * scale, 1.4 * scale, 5),
          trunkMat
        );
        dryTwig.position.set(Math.cos(angle) * 1.4 * scale, trunkHeight * 1.1, Math.sin(angle) * 1.4 * scale);
        dryTwig.rotation.z = 0.8;
        dryTwig.castShadow = true;
        treeGroup.add(dryTwig);
      }

      // Clustered Organic Foliage Canopies
      const leafColor = leafColors[Math.floor(Math.random() * leafColors.length)];
      const leafMat = new THREE.MeshLambertMaterial({ color: leafColor });
      const foliageCount = isHeroGnarled ? 3 : (2 + Math.floor(Math.random() * 2));
      for (let f = 0; f < foliageCount; f++) {
        const fr = (1.3 + Math.random() * 0.6) * scale;
        const foliageGeo = new THREE.DodecahedronGeometry(fr, 1);
        const foliage = new THREE.Mesh(foliageGeo, leafMat);
        foliage.scale.set(1.35, 0.72 + Math.random() * 0.28, 1.2);
        foliage.position.set(
          Math.cos(angle) * (1.0 + f * 0.75) * scale + (Math.random() - 0.5) * 0.35,
          trunkHeight + (0.55 + f * 0.55) * scale,
          Math.sin(angle) * (1.0 + f * 0.75) * scale + (Math.random() - 0.5) * 0.35
        );
        foliage.castShadow = true;
        treeGroup.add(foliage);
      }
    }
    return treeGroup;
  }

  // Hero Trees on the Left Grassy Bank (matching the exact prominent trees in user's photo)
  const heroTreeCoords = [
    { z: -18, xOffset: -9.8, scale: 1.35, isHero: true },
    { z: -34, xOffset: -11.5, scale: 1.25, isHero: true },
    { z: -52, xOffset: -13.2, scale: 1.40, isHero: false },
    { z: -72, xOffset: -12.5, scale: 1.15, isHero: false }
  ];

  heroTreeCoords.forEach(item => {
    const tx = getRoadCenter(item.z) + item.xOffset;
    const ty = getTerrainElevation(tx, item.z);
    const tree = createEucalyptusTree(item.scale, item.isHero);
    tree.position.set(tx, ty, item.z);
    vegetationGroup.add(tree);
  });

  // Additional trees scattered across the rolling hills and ridge lines
  const hillTreeCoords = [
    { x: -38, z: -25, scale: 1.2 },
    { x: -54, z: -48, scale: 1.15 },
    { x: -64, z: -16, scale: 1.35 },
    { x: 32, z: -38, scale: 1.1 },
    { x: 50, z: -64, scale: 1.2 },
    { x: 26, z: -84, scale: 1.25 },
    { x: -28, z: -104, scale: 1.2 },
    { x: 14, z: -116, scale: 1.15 },
    { x: -46, z: -80, scale: 1.2 },
    { x: 58, z: -96, scale: 1.3 }
  ];

  hillTreeCoords.forEach(item => {
    const ty = getTerrainElevation(item.x, item.z);
    const tree = createEucalyptusTree(item.scale, false);
    tree.position.set(item.x, ty, item.z);
    vegetationGroup.add(tree);
  });

  // Low desert shrubs & scrub tufts dotted along the road embankment
  const shrubMat = new THREE.MeshLambertMaterial({ color: 0x54663a });
  for (let s = 0; s < 36; s++) {
    const sz = -125 + s * 4.2;
    const side = (s % 2 === 0) ? -1 : 1;
    const sx = getRoadCenter(sz) + (side * (6.6 + Math.random() * 4.2));
    const sy = getTerrainElevation(sx, sz);
    const shrub = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.55 + Math.random() * 0.45, 1),
      shrubMat
    );
    shrub.scale.set(1.4, 0.65, 1.2);
    shrub.position.set(sx, sy, sz);
    shrub.castShadow = true;
    vegetationGroup.add(shrub);
  }

  /* --- 6. CAMERA POSES & USER INTERACTION --- */
  const cameraPoses = {
    hero: { pos: new THREE.Vector3(3.6, 1.6, 5.2), target: new THREE.Vector3(0, 0.55, 0.2), label: 'AVENTADOR SVJ ORANGE' },
    design: { pos: new THREE.Vector3(6.4, 1.25, 0.2), target: new THREE.Vector3(0, 0.55, 0), label: 'AERO PROFILE' },
    performance: { pos: new THREE.Vector3(-3.5, 1.1, -4.8), target: new THREE.Vector3(0, 0.6, -0.6), label: 'REAR ATTACK' },
    models: { pos: new THREE.Vector3(4.6, 2.8, 4.0), target: new THREE.Vector3(0, 0.5, 0), label: 'SHOWROOM ORBIT' },
    experience: { pos: new THREE.Vector3(0.0, 1.15, -5.6), target: new THREE.Vector3(0, 0.8, 4.0), label: 'HYPERDRIVE CHASE' }
  };

  let currentCameraPose = {
    pos: cameraPoses.hero.pos.clone(),
    target: cameraPoses.hero.target.clone()
  };
  let currentTargetPose = cameraPoses.hero;

  let isOrbitActive = false;
  let orbitSpherical = { radius: 6.4, phi: Math.PI / 3, theta: 0.6 };
  let isPointerDown = false;
  let lastPointerPos = { x: 0, y: 0 };

  const orbitToggleBtn = document.querySelector('#orbitToggle');
  orbitToggleBtn?.addEventListener('click', () => {
    isOrbitActive = !isOrbitActive;
    document.body.classList.toggle('orbit-active', isOrbitActive);
    orbitToggleBtn.classList.toggle('active', isOrbitActive);
    orbitToggleBtn.querySelector('.btn-text').textContent = isOrbitActive ? 'ĐANG XOAY 3D' : 'XOAY 3D';
    updateHudCameraMode(isOrbitActive ? '360° FREE INSPECT' : currentTargetPose.label);
  });

  let isWindTunnelMax = true;
  const windToggleBtn = document.querySelector('#windToggle');
  windToggleBtn?.addEventListener('click', () => {
    isWindTunnelMax = !isWindTunnelMax;
    windToggleBtn.classList.toggle('active', isWindTunnelMax);
    windToggleBtn.querySelector('.btn-text').textContent = isWindTunnelMax ? 'LƯỚT GIÓ: ON' : 'LƯỚT GIÓ: OFF';
    windGroup.visible = isWindTunnelMax;
  });

  let turboBoostTimer = 0;
  function triggerTurboBoost() {
    turboBoostTimer = 180;
    if (isSoundEnabled && audioCtx) {
      playDriveBySound();
    }
  }

  // Paint Color Customizer
  document.querySelectorAll('.swatch').forEach(swatch => {
    swatch.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const hex = swatch.dataset.color;
      const name = swatch.dataset.name;
      const colorTitle = document.querySelector('#colorCurrentName');
      if (colorTitle) colorTitle.textContent = `${name}`;

      carPaintMaterial.color.set(hex);
      if (name.includes('Nero')) {
        carPaintMaterial.roughness = 0.42;
        carPaintMaterial.clearcoat = 0.3;
      } else {
        carPaintMaterial.roughness = 0.16;
        carPaintMaterial.clearcoat = 1.0;
      }
    });
  });

  window.addEventListener('pointerdown', e => {
    if (isOrbitActive) {
      isPointerDown = true;
      lastPointerPos = { x: e.clientX, y: e.clientY };
    }
  });

  window.addEventListener('pointerup', () => {
    isPointerDown = false;
  });

  let targetSteerAngle = 0;
  let currentSteerAngle = 0;

  window.addEventListener('pointermove', e => {
    if (isOrbitActive) {
      if (isPointerDown) {
        const dx = e.clientX - lastPointerPos.x;
        const dy = e.clientY - lastPointerPos.y;
        lastPointerPos = { x: e.clientX, y: e.clientY };

        orbitSpherical.theta -= dx * 0.007;
        orbitSpherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, orbitSpherical.phi - dy * 0.007));
      }
      targetSteerAngle = 0; // Keep wheels aligned straight when rotating around in 360 inspect mode
    } else {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetSteerAngle = normX * 0.28; // Natural supercar steering lock
    }
  });

  window.addEventListener('pointerleave', () => {
    targetSteerAngle = 0; // Smoothly return steering to straight center when pointer leaves
  });

  window.addEventListener('wheel', e => {
    if (isOrbitActive) {
      orbitSpherical.radius = Math.max(3.2, Math.min(14.0, orbitSpherical.radius + e.deltaY * 0.005));
    }
  }, { passive: true });

  const hudSpeed = document.querySelector('#hudSpeed');
  const hudDownforce = document.querySelector('#hudDownforce');
  const hudCameraMode = document.querySelector('#hudCameraMode');

  function updateHudCameraMode(text) {
    if (hudCameraMode) hudCameraMode.textContent = text;
  }

  function updateScrollCameraPose() {
    if (isOrbitActive) return;

    const scrollY = window.scrollY;
    let targetPose = cameraPoses.hero;
    const sections = [
      { id: 'experience', pose: cameraPoses.experience },
      { id: 'models', pose: cameraPoses.models },
      { id: 'performance', pose: cameraPoses.performance },
      { id: 'design', pose: cameraPoses.design },
      { id: 'home', pose: cameraPoses.hero }
    ];

    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          targetPose = sec.pose;
          break;
        }
      }
    }

    currentTargetPose = targetPose;
    updateHudCameraMode(targetPose.label);
  }

  window.addEventListener('scroll', updateScrollCameraPose, { passive: true });
  updateScrollCameraPose();

  /* --- 7. MAIN ANIMATION LOOP --- */
  const clock = new THREE.Clock();

  function animateScene() {
    requestAnimationFrame(animateScene);

    const delta = clock.getDelta();
    const time = clock.getElapsedTime();

    let speedFactor = 1.0;
    if (turboBoostTimer > 0) {
      turboBoostTimer--;
      speedFactor = 1.85;
    }

    if (hudSpeed && Math.random() < 0.12) {
      const baseSpd = turboBoostTimer > 0 ? 388 : 355;
      hudSpeed.textContent = (baseSpd + Math.floor(Math.sin(time * 8) * 3));
    }
    if (hudDownforce && Math.random() < 0.12) {
      const baseDf = turboBoostTimer > 0 ? 740 : 610;
      hudDownforce.textContent = (baseDf + Math.floor(Math.cos(time * 6) * 8));
    }

    // Smooth front wheel steering angle interpolation (buttery smooth response)
    currentSteerAngle = THREE.MathUtils.lerp(currentSteerAngle, targetSteerAngle, 0.08);
    frontSteerWheels.forEach(pivot => {
      pivot.rotation.y = currentSteerAngle;
    });

    // Spin Aventador SVJ wheels cleanly around axle (independent of steering yaw)
    const wheelRotSpeed = 24.0 * speedFactor * delta;
    animatedWheels.forEach(w => {
      w.rotation.x += wheelRotSpeed;
    });

    // Body road vibration
    const roadVibration = Math.sin(time * 38) * 0.0035 + Math.cos(time * 19) * 0.002;
    bodyGroup.position.y = roadVibration;

    // Dual Exhaust Flame Pulse
    const flameScale = (0.75 + Math.random() * 0.55) * (turboBoostTimer > 0 ? 1.8 : 1.0);
    exhaustFlameL.scale.set(flameScale, flameScale * 1.25, flameScale);
    exhaustFlameR.scale.set(flameScale, flameScale * 1.25, flameScale);
    flameMaterial.color.setHex(turboBoostTimer > 0 ? 0xffaa22 : 0x4fa8ff);

    // Dynamic Desert Highway Motion (355 km/h)
    const roadSpeed = 38.0 * speedFactor * delta;

    // 1. Fluid infinite road surface texture scrolling (synchronized with wheel speed)
    if (roadTexture) {
      const scrollOffset = roadSpeed * 0.0814;
      roadTexture.offset.y -= scrollOffset;
      if (typeof roadMaps !== 'undefined' && roadMaps.bump) {
        roadMaps.bump.offset.y -= scrollOffset;
      }
    }

    // 2. Roadside Green Safety Barrier Posts & Cables rush past along the curve
    safetyPosts.forEach(post => {
      post.z -= roadSpeed;
      if (post.z < -95) {
        post.z += postCount * postSpacing;
      }
      post.group.position.z = post.z;
      post.group.position.x = getRoadCenter(post.z) - 5.2;
    });

    // 3. Gentle Fluffy Cloud Drift across the Horizon Sky
    cloudClusters.forEach(c => {
      c.group.position.x += c.speed * delta;
      if (c.group.position.x > 140) {
        c.group.position.x = -140;
      }
    });

    // Streamline particles hugging the Aventador SVJ
    if (isWindTunnelMax) {
      streamlineParticles.forEach(p => {
        p.progress += p.speed * speedFactor * delta;
        if (p.progress > 1) p.progress -= 1;
        const pos = p.curve.getPointAt(p.progress);
        p.mesh.position.copy(pos);
      });

      // Ambient Speed Streaks
      const posAttr = streakGeometry.attributes.position;
      const positions = posAttr.array;
      for (let i = 0; i < streakCount; i++) {
        const vel = streakVelocities[i] * speedFactor * delta;
        positions[i * 6 + 2] -= vel;
        positions[i * 6 + 5] -= vel;

        if (positions[i * 6 + 5] < -35) {
          const newZ = 28 + Math.random() * 15;
          const len = 1.2 + Math.random() * 3.5;
          positions[i * 6 + 2] = newZ;
          positions[i * 6 + 5] = newZ + len;
          positions[i * 6] = (Math.random() - 0.5) * 16;
          positions[i * 6 + 3] = positions[i * 6];
          positions[i * 6 + 1] = 0.15 + Math.random() * 4.8;
          positions[i * 6 + 4] = positions[i * 6 + 1];
        }
      }
      posAttr.needsUpdate = true;
    }

    // Camera Orbit or Scroll Interpolation
    if (isOrbitActive) {
      const cx = orbitSpherical.radius * Math.sin(orbitSpherical.phi) * Math.sin(orbitSpherical.theta);
      const cy = orbitSpherical.radius * Math.cos(orbitSpherical.phi);
      const cz = orbitSpherical.radius * Math.sin(orbitSpherical.phi) * Math.cos(orbitSpherical.theta);

      camera.position.set(cx, cy, cz);
      camera.lookAt(0, 0.55, 0);
    } else {
      currentCameraPose.pos.lerp(currentTargetPose.pos, 0.045);
      currentCameraPose.target.lerp(currentTargetPose.target, 0.045);

      camera.position.copy(currentCameraPose.pos);
      camera.lookAt(currentCameraPose.target);
    }

    renderer.render(scene, camera);
  }

  animateScene();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

})();
