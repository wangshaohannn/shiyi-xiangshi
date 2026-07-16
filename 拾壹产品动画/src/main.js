import './styles.css';
import * as THREE from 'three';

const products = [
  {
    name: '伽罗大观',
    spec: '21cm · 10g',
    price: '¥3800',
    tone: '兰花香 / 棋楠韵',
    image: '/assets/docx-product/image1.jpeg',
    accent: '#7d2018',
    summary: '柬埔寨小棋楠沉香加入越南芽庄白棋楠，醇化约十五年，香气爆发力强。',
  },
  {
    name: '海南沉香',
    spec: '21cm · 10g',
    price: '¥2800',
    tone: '厚重木香 / 山川气',
    image: '/assets/docx-product/image2.jpeg',
    accent: '#223d32',
    summary: '黎母山野生铁头与老顶双料，木韵刚劲，尾韵深邃持久。',
  },
  {
    name: '富森红土',
    spec: '21cm · 10g',
    price: '¥1680',
    tone: '清凉 / 醇厚木韵',
    image: '/assets/docx-product/image3.jpeg',
    accent: '#683026',
    summary: '富森红土与富森壳子双料，呈现沉香深邃而清雅的层次。',
  },
  {
    name: '琼崖',
    spec: '21cm · 10g',
    price: '¥1280',
    tone: '龙涎鲜甜 / 棋楠钻凉',
    image: '/assets/docx-product/image4.jpeg',
    accent: '#8b311e',
    summary: '红土为骨，龙涎为引，棋楠为魂，沉稳蜜甜中透出鲜香。',
  },
  {
    name: '龙涎香',
    spec: '10cm · 10g',
    price: '¥1200',
    tone: '苍古 / 深邃甜韵',
    image: '/assets/docx-product/image5.jpeg',
    accent: '#36516a',
    summary: '龙涎香、芽庄沉香与越南土沉香入方，香韵浓烈而深邃。',
  },
  {
    name: '离尘',
    spec: '10cm · 10g',
    price: '¥880',
    tone: '富森红土 / 婉转清甜',
    image: '/assets/docx-product/image6.jpeg',
    accent: '#7a3b2f',
    summary: '富森山脉红土沉香，清甜不杂，中段以温润甜韵展开。',
  },
  {
    name: '菩萨棋南',
    spec: '21cm · 10g',
    price: '¥480',
    tone: '清雅 / 凉甜通透',
    image: '/assets/docx-product/image7.jpeg',
    accent: '#545e3a',
    summary: '以海南虫漏沉香为原料，醇化约十年，凉味与甜味清晰明朗。',
  },
  {
    name: '芽庄沉香',
    spec: '21cm · 10g',
    price: '¥118',
    tone: '甜凉 / 花果蜜韵',
    image: '/assets/docx-product/image8.jpeg',
    accent: '#8a5a2d',
    summary: '惠安系一线产区，越南芽庄壳子为原料，柔和甜美且留香持久。',
  },
];

let activeIndex = 0;
let autoSpin = true;

const activeName = document.querySelector('#activeName');
const activeSpec = document.querySelector('#activeSpec');
const activeTone = document.querySelector('#activeTone');
const activePrice = document.querySelector('#activePrice');
const activeNote = document.querySelector('#activeNote');
const selector = document.querySelector('#productSelector');
const productGrid = document.querySelector('#productGrid');
const spinToggle = document.querySelector('#spinToggle');

const canvas = document.querySelector('#productScene');
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0.2, 0.32, 7);

const ambientLight = new THREE.HemisphereLight('#fffaf0', '#17130f', 2.6);
scene.add(ambientLight);

const keyLight = new THREE.DirectionalLight('#fff3d7', 4.2);
keyLight.position.set(4, 5, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight('#d9e7da', 1.35);
rimLight.position.set(-3, 3, -2);
scene.add(rimLight);

const stage = new THREE.Group();
scene.add(stage);

const floorMaterial = new THREE.ShadowMaterial({ color: '#211815', opacity: 0.13 });
const floor = new THREE.Mesh(new THREE.CircleGeometry(2.55, 96), floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.72;
floor.receiveShadow = true;
stage.add(floor);

const productGroup = new THREE.Group();
stage.add(productGroup);

const textureLoader = new THREE.TextureLoader();
const labelCanvas = document.createElement('canvas');
labelCanvas.width = 1024;
labelCanvas.height = 1600;
const labelTexture = new THREE.CanvasTexture(labelCanvas);
labelTexture.colorSpace = THREE.SRGBColorSpace;

const paperMaterial = new THREE.MeshPhysicalMaterial({
  color: '#f7f4ea',
  roughness: 0.72,
  metalness: 0.02,
  clearcoat: 0.12,
  clearcoatRoughness: 0.58,
});
const edgeMaterial = new THREE.MeshStandardMaterial({
  color: '#17130f',
  roughness: 0.62,
  metalness: 0.08,
});
const labelMaterial = new THREE.MeshStandardMaterial({
  map: labelTexture,
  roughness: 0.62,
  metalness: 0.02,
});

const box = new THREE.Mesh(
  new THREE.BoxGeometry(1.28, 3.05, 0.42, 2, 2, 2),
  [edgeMaterial, edgeMaterial, edgeMaterial, edgeMaterial, labelMaterial, paperMaterial],
);
box.position.set(-0.62, 0.02, 0);
box.rotation.set(0.02, -0.32, -0.025);
box.castShadow = true;
box.receiveShadow = true;
productGroup.add(box);

const sideBand = new THREE.Mesh(
  new THREE.BoxGeometry(0.04, 2.78, 0.45),
  new THREE.MeshStandardMaterial({ color: '#11100d', roughness: 0.45 }),
);
sideBand.position.set(-1.23, 0.04, -0.02);
sideBand.rotation.copy(box.rotation);
productGroup.add(sideBand);

const seal = new THREE.Mesh(
  new THREE.CylinderGeometry(0.22, 0.22, 0.022, 72),
  new THREE.MeshStandardMaterial({ color: products[0].accent, roughness: 0.5, metalness: 0.12 }),
);
seal.rotation.set(Math.PI / 2, 0, -0.32);
seal.position.set(-0.3, 0.92, 0.26);
seal.castShadow = true;
productGroup.add(seal);

const incenseMaterial = new THREE.MeshStandardMaterial({
  color: '#31231d',
  roughness: 0.76,
  metalness: 0.02,
});
const emberMaterial = new THREE.MeshStandardMaterial({
  color: '#b63424',
  emissive: '#7c160f',
  emissiveIntensity: 1.1,
  roughness: 0.35,
});
const stickGroup = new THREE.Group();
stickGroup.position.set(0.72, -0.7, 0.25);
stickGroup.rotation.set(-0.05, 0.08, -0.62);
productGroup.add(stickGroup);

for (let i = 0; i < 19; i += 1) {
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 2.72, 18), incenseMaterial);
  stick.position.set((i - 9) * 0.038, Math.sin(i * 0.8) * 0.018, i * 0.003);
  stick.rotation.z = (i - 9) * 0.006;
  stick.castShadow = true;
  stickGroup.add(stick);

  if (i % 4 === 0) {
    const ember = new THREE.Mesh(new THREE.SphereGeometry(0.028, 18, 18), emberMaterial);
    ember.position.set(stick.position.x, 1.37, stick.position.z);
    stickGroup.add(ember);
  }
}

const trayMaterial = new THREE.MeshPhysicalMaterial({
  color: '#1f1b16',
  roughness: 0.42,
  metalness: 0.62,
  clearcoat: 0.32,
});
const tray = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.24, 0.14, 96), trayMaterial);
tray.position.set(0.66, -1.36, 0.05);
tray.castShadow = true;
tray.receiveShadow = true;
productGroup.add(tray);

const trayRim = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.035, 14, 96), trayMaterial);
trayRim.position.set(0.66, -1.27, 0.05);
trayRim.rotation.x = Math.PI / 2;
trayRim.castShadow = true;
productGroup.add(trayRim);

const smokeGroup = new THREE.Group();
productGroup.add(smokeGroup);
const smokeMaterial = new THREE.LineBasicMaterial({
  color: '#c8c3b5',
  transparent: true,
  opacity: 0.42,
});
const smokeLines = [];
for (let i = 0; i < 7; i += 1) {
  const geometry = new THREE.BufferGeometry();
  const points = new Array(26).fill(0).map((_, pointIndex) => {
    const t = pointIndex / 25;
    return new THREE.Vector3(
      0.54 + i * 0.035 + Math.sin(t * 6 + i) * 0.05,
      -0.2 + t * 1.82,
      0.28 + Math.cos(t * 5 + i) * 0.055,
    );
  });
  geometry.setFromPoints(points);
  const line = new THREE.Line(geometry, smokeMaterial.clone());
  line.material.opacity = 0.16 + i * 0.035;
  line.userData.seed = i * 1.7;
  smokeGroup.add(line);
  smokeLines.push(line);
}

let photoPlane = null;
function createPhotoPlane(product) {
  if (photoPlane) {
    productGroup.remove(photoPlane);
    photoPlane.material.map?.dispose();
    photoPlane.material.dispose();
    photoPlane.geometry.dispose();
  }

  const texture = textureLoader.load(product.image);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.68,
    metalness: 0.02,
  });
  photoPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.78), material);
  photoPlane.position.set(0.72, 0.78, -0.12);
  photoPlane.rotation.set(0.02, 0.34, 0.025);
  photoPlane.castShadow = true;
  productGroup.add(photoPlane);
}

function drawLabel(product) {
  const ctx = labelCanvas.getContext('2d');
  ctx.clearRect(0, 0, labelCanvas.width, labelCanvas.height);

  const grd = ctx.createLinearGradient(0, 0, 0, labelCanvas.height);
  grd.addColorStop(0, '#fbf8ef');
  grd.addColorStop(1, '#ede7d9');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

  ctx.fillStyle = '#13120f';
  ctx.globalAlpha = 0.09;
  for (let y = 90; y < labelCanvas.height; y += 100) {
    ctx.fillRect(120, y, 780, 2);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = product.accent;
  ctx.fillRect(0, 0, 54, labelCanvas.height);
  ctx.fillRect(970, 0, 54, labelCanvas.height);

  ctx.save();
  ctx.translate(512, 210);
  ctx.fillStyle = '#14120f';
  ctx.font = '700 126px "Songti SC", "Noto Serif CJK SC", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('拾壹香室', 0, 0);
  ctx.restore();

  ctx.save();
  ctx.translate(512, 690);
  ctx.fillStyle = '#14120f';
  ctx.font = '700 188px "Songti SC", "Noto Serif CJK SC", serif';
  ctx.textAlign = 'center';
  [...product.name].forEach((char, index) => {
    ctx.fillText(char, 0, index * 202);
  });
  ctx.restore();

  ctx.fillStyle = product.accent;
  ctx.beginPath();
  ctx.arc(512, 1260, 88, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fffaf0';
  ctx.font = '700 42px "Songti SC", serif';
  ctx.textAlign = 'center';
  ctx.fillText('香', 512, 1276);

  ctx.fillStyle = '#14120f';
  ctx.font = '500 42px "PingFang SC", sans-serif';
  ctx.fillText(product.spec, 512, 1435);
  ctx.font = '400 30px "PingFang SC", sans-serif';
  ctx.fillText(product.tone, 512, 1495);

  labelTexture.needsUpdate = true;
}

function updateProduct(index) {
  activeIndex = index;
  const product = products[index];

  activeName.textContent = product.name;
  activeSpec.textContent = product.spec;
  activeTone.textContent = product.tone;
  activePrice.textContent = product.price;
  activeNote.textContent = product.summary;

  document.documentElement.style.setProperty('--accent', product.accent);
  drawLabel(product);
  createPhotoPlane(product);
  seal.material.color.set(product.accent);
  seal.material.emissive = new THREE.Color(product.accent);
  seal.material.emissiveIntensity = 0.12;

  [...selector.children].forEach((button, buttonIndex) => {
    button.classList.toggle('is-active', buttonIndex === index);
    button.setAttribute('aria-pressed', String(buttonIndex === index));
  });

  [...productGrid.children].forEach((card, cardIndex) => {
    card.classList.toggle('is-selected', cardIndex === index);
  });
}

function buildUi() {
  products.forEach((product, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = product.name;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => updateProduct(index));
    selector.append(button);

    const card = document.createElement('article');
    card.className = 'product-card reveal';
    card.innerHTML = `
      <button type="button" aria-label="在 3D 场景中查看${product.name}">
        <img src="${product.image}" alt="${product.name}产品图" loading="lazy" />
        <span class="card-kicker">${product.spec}</span>
        <strong>${product.name}</strong>
        <span>${product.tone}</span>
        <em>${product.price}</em>
      </button>
    `;
    card.querySelector('button').addEventListener('click', () => {
      updateProduct(index);
      document.querySelector('.hero').scrollIntoView({ behavior: 'smooth' });
    });
    productGrid.append(card);
  });
}

spinToggle.addEventListener('click', () => {
  autoSpin = !autoSpin;
  spinToggle.setAttribute('aria-pressed', String(autoSpin));
  spinToggle.textContent = autoSpin ? '自动旋转' : '手动观赏';
});

let pointerX = 0;
let pointerY = 0;
window.addEventListener('pointermove', (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  },
  { threshold: 0.18 },
);

function observeReveals() {
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

function animate(time) {
  const seconds = time * 0.001;
  const scrollProgress = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);

  if (autoSpin) {
    productGroup.rotation.y = Math.sin(seconds * 0.38) * 0.16 + pointerX * 0.045;
  } else {
    productGroup.rotation.y += (pointerX * 0.42 - productGroup.rotation.y) * 0.055;
  }
  productGroup.rotation.x = -0.03 + pointerY * -0.035;
  const isMobile = window.innerWidth < 820;
  productGroup.position.y = Math.sin(seconds * 0.78) * 0.035 - scrollProgress * 0.08 + (isMobile ? -0.34 : 0);
  productGroup.position.x = isMobile ? 1.06 : 1.05;
  productGroup.scale.setScalar(isMobile ? 0.54 : 0.86);

  box.rotation.y = -0.32 + Math.sin(seconds * 0.46) * 0.035;
  sideBand.rotation.copy(box.rotation);
  if (photoPlane) photoPlane.rotation.y = 0.34 + Math.sin(seconds * 0.52) * 0.035;

  smokeLines.forEach((line) => {
    const position = line.geometry.attributes.position;
    for (let i = 0; i < position.count; i += 1) {
      const t = i / (position.count - 1);
      position.setX(i, 0.54 + line.userData.seed * 0.02 + Math.sin(seconds * 0.9 + t * 7 + line.userData.seed) * 0.055);
      position.setZ(i, 0.28 + Math.cos(seconds * 0.72 + t * 6 + line.userData.seed) * 0.055);
    }
    position.needsUpdate = true;
  });

  stage.rotation.z = Math.sin(seconds * 0.22) * 0.012;
  camera.position.z = isMobile ? 8.65 : 7;
  camera.lookAt(isMobile ? 0.18 : 0.36, 0, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

buildUi();
updateProduct(0);
observeReveals();
requestAnimationFrame(animate);
