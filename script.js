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
  scene.fog = new THREE.FogExp2(0x090a08, 0.022);

  const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 150);
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
  renderer.toneMappingExposure = 1.35;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Showroom Lighting (Accentuating the SVJ's angular lines and metallic pearlescent orange)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xfff7e8, 2.8);
  sunLight.position.set(7, 13, 6);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  scene.add(sunLight);

  const orangeRimLight = new THREE.DirectionalLight(0xff6600, 3.4);
  orangeRimLight.position.set(-8, 5, -6);
  scene.add(orangeRimLight);

  const coolFillLight = new THREE.DirectionalLight(0x90c4ff, 1.2);
  coolFillLight.position.set(-6, 4, 8);
  scene.add(coolFillLight);

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

        // Center wheel geometries around axle hubs so they spin smoothly
        if (name.startsWith('Wheel_')) {
          if (child.geometry) {
            child.geometry.computeBoundingBox();
            const center = new THREE.Vector3();
            child.geometry.boundingBox.getCenter(center);
            child.geometry.center();
            child.position.copy(center);

            animatedWheels.push(child);
            if (name.includes('_F')) {
              frontSteerWheels.push(child);
            }
          }
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

  // Moving Asphalt Road Surface
  const roadGroup = new THREE.Group();
  scene.add(roadGroup);

  const roadPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(36, 120),
    new THREE.MeshStandardMaterial({
      color: 0x08090a,
      roughness: 0.35,
      metalness: 0.75
    })
  );
  roadPlane.rotation.x = -Math.PI / 2;
  roadPlane.position.y = 0;
  roadGroup.add(roadPlane);

  const roadDashes = [];
  for (let d = -25; d <= 25; d += 4) {
    const dash = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 2.2),
      new THREE.MeshBasicMaterial({
        color: 0xff6600,
        transparent: true,
        opacity: 0.4
      })
    );
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.01, d);
    roadGroup.add(dash);
    roadDashes.push(dash);
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

  window.addEventListener('pointermove', e => {
    if (isOrbitActive && isPointerDown) {
      const dx = e.clientX - lastPointerPos.x;
      const dy = e.clientY - lastPointerPos.y;
      lastPointerPos = { x: e.clientX, y: e.clientY };

      orbitSpherical.theta -= dx * 0.007;
      orbitSpherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, orbitSpherical.phi - dy * 0.007));
    }

    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const steerAngle = normX * 0.32;
    frontSteerWheels.forEach(w => {
      w.rotation.y = THREE.MathUtils.lerp(w.rotation.y, steerAngle, 0.12);
    });
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

    // Spin Aventador SVJ wheels around axle
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

    // Moving Road Dashes
    const roadSpeed = 38.0 * speedFactor * delta;
    roadDashes.forEach(dash => {
      dash.position.z -= roadSpeed;
      if (dash.position.z < -25) {
        dash.position.z += 50;
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
