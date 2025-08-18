import * as THREE from 'three';

export const createRing = (scene) => {
  // Ring dimensions
  const ringSize = 10;
  const postHeight = 4;
  const postRadius = 0.15;
  
  // Ring platform (base)
  const platformGeometry = new THREE.BoxGeometry(ringSize + 2, 1, ringSize + 2);
  const platformMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = -0.5;
  platform.receiveShadow = true;
  scene.add(platform);
  
  // Ring canvas (mat)
  const canvasGeometry = new THREE.BoxGeometry(ringSize, 0.3, ringSize);
  const canvasMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
  canvas.position.y = 0.15;
  canvas.receiveShadow = true;
  canvas.castShadow = true;
  scene.add(canvas);
  
  // Ring apron sides
  const apronHeight = 1;
  const apronMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
  
  // Front apron
  const frontApronGeometry = new THREE.BoxGeometry(ringSize + 0.2, apronHeight, 0.1);
  const frontApron = new THREE.Mesh(frontApronGeometry, apronMaterial);
  frontApron.position.set(0, -0.5, ringSize/2 + 0.1);
  scene.add(frontApron);
  
  // Back apron
  const backApron = new THREE.Mesh(frontApronGeometry, apronMaterial);
  backApron.position.set(0, -0.5, -ringSize/2 - 0.1);
  scene.add(backApron);
  
  // Side aprons
  const sideApronGeometry = new THREE.BoxGeometry(0.1, apronHeight, ringSize + 0.2);
  const leftApron = new THREE.Mesh(sideApronGeometry, apronMaterial);
  leftApron.position.set(-ringSize/2 - 0.1, -0.5, 0);
  scene.add(leftApron);
  
  const rightApron = new THREE.Mesh(sideApronGeometry, apronMaterial);
  rightApron.position.set(ringSize/2 + 0.1, -0.5, 0);
  scene.add(rightApron);
  
  // WWE.COM text texture
  const createTextTexture = (text) => {
    const canvasText = document.createElement('canvas');
    canvasText.width = 512;
    canvasText.height = 128;
    const context = canvasText.getContext('2d');
    
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvasText.width, canvasText.height);
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 40, canvasText.width, 48);
    
    context.fillStyle = '#ff0000';
    context.font = 'bold 60px Arial';
    context.textAlign = 'center';
    context.fillText(text, canvasText.width/2, 80);
    
    return new THREE.CanvasTexture(canvasText);
  };
  
  const wweTexture = createTextTexture('WWE.COM');
  const texturedMaterial = new THREE.MeshPhongMaterial({ map: wweTexture });
  
  // Text on front apron
  const textPlaneGeometry = new THREE.PlaneGeometry(ringSize, apronHeight);
  const textPlane = new THREE.Mesh(textPlaneGeometry, texturedMaterial);
  textPlane.position.set(0, -0.5, ringSize/2 + 0.11);
  scene.add(textPlane);
  
  // Text on back apron
  const textPlaneBack = new THREE.Mesh(textPlaneGeometry, texturedMaterial);
  textPlaneBack.position.set(0, -0.5, -ringSize/2 - 0.11);
  textPlaneBack.rotation.y = Math.PI;
  scene.add(textPlaneBack);
  
  // Corner posts
  const postMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
  const postGeometry = new THREE.CylinderGeometry(postRadius, postRadius, postHeight);
  
  const posts = [];
  const postPositions = [
    [-ringSize/2, postHeight/2, -ringSize/2],
    [ringSize/2, postHeight/2, -ringSize/2],
    [ringSize/2, postHeight/2, ringSize/2],
    [-ringSize/2, postHeight/2, ringSize/2]
  ];
  
  postPositions.forEach(pos => {
    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.set(...pos);
    post.castShadow = true;
    scene.add(post);
    posts.push(post);
  });
  
  // Turnbuckles
  const turnbuckleMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a });
  const turnbuckleGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  
  const ropeHeights = [1.5, 2.2, 2.9];
  posts.forEach(post => {
    ropeHeights.forEach(height => {
      const turnbuckle = new THREE.Mesh(turnbuckleGeometry, turnbuckleMaterial);
      turnbuckle.position.set(post.position.x, height, post.position.z);
      scene.add(turnbuckle);
    });
  });
  
  // White ropes
  const ropeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
  const ropeRadius = 0.05;
  
  ropeHeights.forEach(height => {
    // Front rope
    const frontRopeGeometry = new THREE.CylinderGeometry(ropeRadius, ropeRadius, ringSize);
    const frontRope = new THREE.Mesh(frontRopeGeometry, ropeMaterial);
    frontRope.position.set(0, height, ringSize/2);
    frontRope.rotation.z = Math.PI / 2;
    frontRope.castShadow = true;
    scene.add(frontRope);
    
    // Back rope
    const backRope = new THREE.Mesh(frontRopeGeometry, ropeMaterial);
    backRope.position.set(0, height, -ringSize/2);
    backRope.rotation.z = Math.PI / 2;
    backRope.castShadow = true;
    scene.add(backRope);
    
    // Left rope
    const sideRopeGeometry = new THREE.CylinderGeometry(ropeRadius, ropeRadius, ringSize);
    const leftRope = new THREE.Mesh(sideRopeGeometry, ropeMaterial);
    leftRope.position.set(-ringSize/2, height, 0);
    leftRope.rotation.x = Math.PI / 2;
    leftRope.castShadow = true;
    scene.add(leftRope);
    
    // Right rope
    const rightRope = new THREE.Mesh(sideRopeGeometry, ropeMaterial);
    rightRope.position.set(ringSize/2, height, 0);
    rightRope.rotation.x = Math.PI / 2;
    rightRope.castShadow = true;
    scene.add(rightRope);
  });
  
  // Stairs
  const stairMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
  const stairWidth = 2;
  const stairDepth = 0.8;
  const stairHeight = 0.25;
  const numStairs = 4;
  
  for (let i = 0; i < numStairs; i++) {
    const stairGeometry = new THREE.BoxGeometry(stairWidth, stairHeight, stairDepth);
    const stair = new THREE.Mesh(stairGeometry, stairMaterial);
    stair.position.set(0, -0.875 + (i * stairHeight), ringSize/2 + 1 + (i * stairDepth));
    stair.receiveShadow = true;
    stair.castShadow = true;
    scene.add(stair);
  }
  
  // Floor around ring
  const floorGeometry = new THREE.BoxGeometry(50, 0.1, 50);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xdddddd });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.y = -1.05;
  floor.receiveShadow = true;
  scene.add(floor);
};

export default createRing;