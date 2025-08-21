'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { wrestlingMoves } from './WrestlingMoves';

class Wrestler {
  constructor(scene, color = 0xff0000, name = "Player") {
    this.scene = scene;
    this.name = name;
    this.position = new THREE.Vector3(0, 0, 0);
    this.rotation = 0;
    this.targetRotation = 0; // Cílová rotace pro plynulé otáčení
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.isJumping = false;
    this.health = 100;
    this.stamina = 100;
    this.speed = 0.0375;  // Zpomaleno 4x (původně 0.15)
    this.jumpPower = 0.075;  // Zpomaleno 4x (původně 0.3)
    
    // Kolize
    this.radius = 0.8; // Kolizní radius wrestlera
    this.mass = 1; // Hmotnost pro fyziku kolizí
    
    // Akce
    this.isPunching = false;
    this.isBlocking = false;
    this.punchCooldown = 0;
    
    // Wrestling chvaty
    this.isPerformingMove = false;
    this.isBeingGrabbed = false;
    this.isStunned = false;
    this.stunnedTimer = 0;
    this.isApproachingForMove = false;
    this.isLyingDown = false;
    this.lyingTimer = 0;
    
    // Vytvoření wrestlera
    this.createWrestler(color);
    
    // Animační parametry
    this.walkCycle = 0;
    this.punchAnimation = 0;
  }
  
  createWrestler(color) {
    // Skupina pro celého wrestlera
    this.group = new THREE.Group();
    
    // Materiály
    const skinMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: color });
    const shortsMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    const bootsMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    // HLAVA
    const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    this.head = new THREE.Mesh(headGeometry, skinMaterial);
    this.head.position.y = 2.2;
    this.head.castShadow = true;
    
    // Oči
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.08, 2.2, 0.2);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.08, 2.2, 0.2);
    
    // TĚLO (trup)
    const torsoGeometry = new THREE.BoxGeometry(0.7, 0.9, 0.4);
    this.torso = new THREE.Mesh(torsoGeometry, bodyMaterial);
    this.torso.position.y = 1.5;
    this.torso.castShadow = true;
    
    // Prsa (pro větší svalnatost)
    const chestGeometry = new THREE.BoxGeometry(0.75, 0.4, 0.45);
    const chest = new THREE.Mesh(chestGeometry, bodyMaterial);
    chest.position.y = 1.7;
    
    // PAŽE
    const armGeometry = new THREE.CapsuleGeometry(0.12, 0.5, 4, 8);
    
    // Levá paže
    this.leftArm = new THREE.Group();
    const leftUpperArm = new THREE.Mesh(armGeometry, skinMaterial);
    leftUpperArm.position.y = -0.25;
    this.leftArm.add(leftUpperArm);
    this.leftArm.position.set(-0.45, 1.8, 0);
    this.leftArm.castShadow = true;
    
    // Pravá paže
    this.rightArm = new THREE.Group();
    const rightUpperArm = new THREE.Mesh(armGeometry, skinMaterial);
    rightUpperArm.position.y = -0.25;
    this.rightArm.add(rightUpperArm);
    this.rightArm.position.set(0.45, 1.8, 0);
    this.rightArm.castShadow = true;
    
    // RUCE (pěsti)
    const fistGeometry = new THREE.SphereGeometry(0.15, 8, 8);
    const fistMaterial = new THREE.MeshPhongMaterial({ color: 0xfdbcb4 });
    
    this.leftFist = new THREE.Mesh(fistGeometry, fistMaterial);
    this.leftFist.position.set(-0.45, 1.2, 0);
    
    this.rightFist = new THREE.Mesh(fistGeometry, fistMaterial);
    this.rightFist.position.set(0.45, 1.2, 0);
    
    // BŘICHO
    const bellyGeometry = new THREE.BoxGeometry(0.65, 0.3, 0.35);
    const belly = new THREE.Mesh(bellyGeometry, skinMaterial);
    belly.position.y = 1.05;
    
    // TRENKY
    const shortsGeometry = new THREE.BoxGeometry(0.65, 0.4, 0.35);
    const shorts = new THREE.Mesh(shortsGeometry, shortsMaterial);
    shorts.position.y = 0.8;
    shorts.castShadow = true;
    
    // NOHY
    const legGeometry = new THREE.CapsuleGeometry(0.15, 0.6, 4, 8);
    
    // Levá noha
    this.leftLeg = new THREE.Group();
    const leftThigh = new THREE.Mesh(legGeometry, skinMaterial);
    leftThigh.position.y = -0.3;
    this.leftLeg.add(leftThigh);
    this.leftLeg.position.set(-0.2, 0.6, 0);
    this.leftLeg.castShadow = true;
    
    // Pravá noha
    this.rightLeg = new THREE.Group();
    const rightThigh = new THREE.Mesh(legGeometry, skinMaterial);
    rightThigh.position.y = -0.3;
    this.rightLeg.add(rightThigh);
    this.rightLeg.position.set(0.2, 0.6, 0);
    this.rightLeg.castShadow = true;
    
    // BOTY
    const bootGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.35);
    
    const leftBoot = new THREE.Mesh(bootGeometry, bootsMaterial);
    leftBoot.position.set(-0.2, 0.075, 0.05);
    
    const rightBoot = new THREE.Mesh(bootGeometry, bootsMaterial);
    rightBoot.position.set(0.2, 0.075, 0.05);
    
    // Přidání všech částí do skupiny
    this.group.add(this.head);
    this.group.add(leftEye);
    this.group.add(rightEye);
    this.group.add(this.torso);
    this.group.add(chest);
    this.group.add(belly);
    this.group.add(shorts);
    this.group.add(this.leftArm);
    this.group.add(this.rightArm);
    this.group.add(this.leftFist);
    this.group.add(this.rightFist);
    this.group.add(this.leftLeg);
    this.group.add(this.rightLeg);
    this.group.add(leftBoot);
    this.group.add(rightBoot);
    
    // Nastavení pozice skupiny
    this.group.position.y = 0.3;
    this.group.castShadow = true;
    this.group.receiveShadow = true;
    
    // Zvětšení celého wrestlera 1.5x
    this.group.scale.set(1.5, 1.5, 1.5);
    
    // Přidání do scény
    this.scene.add(this.group);
  }
  
  // Kolizní detekce
  checkCollisionWith(otherWrestler) {
    if (!otherWrestler) return false;
    
    // NIKDY nekontrolovat kolize během chvatů
    if (this.isApproachingForMove || otherWrestler.isApproachingForMove ||
        this.isPerformingMove || otherWrestler.isPerformingMove ||
        this.isBeingGrabbed || otherWrestler.isBeingGrabbed) {
      return false;
    }
    
    const dx = this.position.x - otherWrestler.position.x;
    const dz = this.position.z - otherWrestler.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    return distance < (this.radius + otherWrestler.radius);
  }
  
  // Řešení kolize s jiným wrestlerem
  resolveCollisionWith(otherWrestler) {
    if (!otherWrestler) return;
    
    // EXTRA KONTROLA - absolutně ŽÁDNÉ kolize během chvatů nebo přibližování
    if (this.isApproachingForMove || otherWrestler.isApproachingForMove ||
        this.isPerformingMove || otherWrestler.isPerformingMove ||
        this.isBeingGrabbed || otherWrestler.isBeingGrabbed ||
        this.isLyingDown || otherWrestler.isLyingDown) {
      return; // ABSOLUTNĚ NEŘEŠIT kolize během chvatů
    }
    
    const dx = this.position.x - otherWrestler.position.x;
    const dz = this.position.z - otherWrestler.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    // Povolit větší přiblížení než dříve (menší kolizní radius při normálním boji)
    const effectiveRadius = this.radius * 0.7; // Zmenšený radius pro povolení bližšího kontaktu
    
    if (distance < (effectiveRadius + effectiveRadius) && distance > 0) {
      // Jemnější odpuzení pro plynulejší pohyb
      const nx = dx / distance;
      const nz = dz / distance;
      
      const overlap = (effectiveRadius + effectiveRadius) - distance;
      const pushForce = overlap * 0.3; // Jemnější síla
      
      // Aplikuj jemné odpuzení
      this.position.x += nx * pushForce;
      this.position.z += nz * pushForce;
      
      otherWrestler.position.x -= nx * pushForce;
      otherWrestler.position.z -= nz * pushForce;
      
      // Menší přenos hybnosti
      const impactForce = 0.1;
      this.velocity.x += nx * impactForce;
      this.velocity.z += nz * impactForce;
      otherWrestler.velocity.x -= nx * impactForce;
      otherWrestler.velocity.z -= nz * impactForce;
    }
  }
  
  move(direction) {
    // ABSOLUTNÍ ZÁKAZ POHYBU při těchto stavech
    if (this.isStunned || this.isBeingGrabbed || this.isLyingDown || this.isPerformingMove) {
      return;
    }
    // isApproachingForMove je OK - může se pohybovat při přibližování k chvatu
    
    // Pokud se wrestler pohybuje, vypočítat cílovou rotaci
    if (direction.x !== 0 || direction.z !== 0) {
      // Vypočítat úhel směru pohybu - správné otočení čelem vpřed
      this.targetRotation = Math.atan2(direction.x, direction.z);
      
      // Aplikovat rychlost pohybu
      this.velocity.x = direction.x * this.speed;
      this.velocity.z = direction.z * this.speed;
      
      // Animace chůze
      this.walkCycle += 0.0375;  // Zpomaleno 4x (původně 0.15)
      this.animateWalk();
    } else {
      this.resetPose();
    }
  }
  
  animateWalk() {
    // Animace nohou
    const walkAngle = Math.sin(this.walkCycle) * 0.5;
    this.leftLeg.rotation.x = walkAngle;
    this.rightLeg.rotation.x = -walkAngle;
    
    // Animace rukou
    this.leftArm.rotation.x = -walkAngle * 0.5;
    this.rightArm.rotation.x = walkAngle * 0.5;
    
    // Mírné kývání těla
    this.torso.rotation.y = Math.sin(this.walkCycle * 2) * 0.05;
  }
  
  resetPose() {
    // Postupný návrat do neutrální pozice
    this.leftLeg.rotation.x *= 0.9;
    this.rightLeg.rotation.x *= 0.9;
    this.leftArm.rotation.x *= 0.9;
    this.rightArm.rotation.x *= 0.9;
    this.torso.rotation.y *= 0.9;
  }
  
  rotate(angle) {
    this.rotation += angle;
    this.group.rotation.y = this.rotation;
  }
  
  jump() {
    if (!this.isJumping && !this.isApproachingForMove && !this.isPerformingMove && !this.isLyingDown && !this.isStunned) {
      this.velocity.y = this.jumpPower;
      this.isJumping = true;
      
      // Skok bere trochu staminy
      this.stamina -= 3;
      this.stamina = Math.max(0, this.stamina);
    }
  }
  
  punch() {
    if (this.punchCooldown <= 0 && !this.isPunching && !this.isApproachingForMove && !this.isPerformingMove && !this.isLyingDown && !this.isStunned) {
      this.isPunching = true;
      this.punchAnimation = 0;
      this.punchCooldown = 30; // Cooldown frames
      
      // Úder bere trochu staminy
      this.stamina -= 2;
      this.stamina = Math.max(0, this.stamina);
    }
  }
  
  animatePunch() {
    if (this.isPunching) {
      this.punchAnimation += 0.05;  // Zpomaleno 4x (původně 0.2)
      
      // Animace úderu pravou rukou
      const punchProgress = Math.sin(this.punchAnimation);
      this.rightArm.rotation.x = -punchProgress * 1.5;
      this.rightArm.rotation.y = punchProgress * 0.5;
      this.rightFist.position.z = punchProgress * 0.75; // Větší dosah kvůli větší postavě
      
      // Rotace těla při úderu
      this.torso.rotation.y = punchProgress * 0.2;
      
      if (this.punchAnimation > Math.PI) {
        this.isPunching = false;
        this.rightFist.position.z = 0;
      }
    }
  }
  
  block() {
    if (!this.isApproachingForMove && !this.isPerformingMove && !this.isLyingDown && !this.isStunned && this.stamina > 5) {
      this.isBlocking = true;
      // Zvednutí rukou do bloku
      this.leftArm.rotation.x = -1.2;
      this.rightArm.rotation.x = -1.2;
      this.leftArm.rotation.z = 0.3;
      this.rightArm.rotation.z = -0.3;
      
      // Blokování spotřebovává pomalu staminu
      this.stamina -= 0.1;
      this.stamina = Math.max(0, this.stamina);
    } else if (this.stamina <= 5) {
      // Automaticky přestat blokovat když dojde stamina
      this.stopBlocking();
    }
  }
  
  stopBlocking() {
    this.isBlocking = false;
  }
  
  update(otherWrestlers = []) {
    // Pokud leží na zemi - HLAVNÍ LOGIKA LEŽENÍ
    if (this.isLyingDown) {
      // Zajistit správnou pozici a rotaci při ležení
      this.group.position.y = 0.65;
      this.group.rotation.x = -Math.PI / 2; // Leží na zádech
      
      // Odpočítávat časovače
      if (this.lyingTimer > 0) {
        this.lyingTimer--;
        
        // Debug výpis každých 60 framů (1 sekunda)
        if (this.lyingTimer % 60 === 0) {
          console.log(`${this.name} leží, zbývá: ${this.lyingTimer} framů (${(this.lyingTimer/60).toFixed(1)}s)`);
        }
      }
      
      if (this.stunnedTimer > 0) {
        this.stunnedTimer--;
        
        // Během omráčení - jen ležet a občas sebou škubnout
        if (Math.random() < 0.03) {
          // Malé záškuby
          if (this.leftLeg) this.leftLeg.rotation.x = (Math.random() - 0.5) * 0.2;
          if (this.rightArm) this.rightArm.rotation.z = (Math.random() - 0.5) * 0.2;
        }
        
        if (this.stunnedTimer % 30 === 0) {
          console.log(`${this.name} je omráčený, zbývá: ${this.stunnedTimer} framů`);
        }
      }
      
      // Vstávání - pouze když není omráčený a časovač je nízký
      if (this.stunnedTimer <= 0 && this.lyingTimer > 0 && this.lyingTimer <= 60) {
        // Postupné vstávání během posledních 60 framů
        const getUpProgress = 1 - (this.lyingTimer / 60);
        
        if (this.lyingTimer % 15 === 0) {
          console.log(`${this.name} vstává: ${Math.floor(getUpProgress * 100)}%`);
        }
        
        // Animace vstávání
        this.group.rotation.x = -Math.PI / 2 * (1 - getUpProgress);
        
        // Při vstávání se trochu zvednout
        if (getUpProgress > 0.5) {
          this.group.position.y = 0.65 + Math.sin(getUpProgress * Math.PI) * 0.3;
        }
      }
      
      // Kompletně vstal
      if (this.lyingTimer <= 0 && this.stunnedTimer <= 0) {
        console.log(`${this.name} VSTAL! Zpět do boje!`);
        this.isLyingDown = false;
        this.isStunned = false;
        this.group.rotation.x = 0;
        this.group.position.y = 0.65;
        this.lyingTimer = 0;
        this.stunnedTimer = 0;
      }
      
      // Při ležení ZASTAVIT všechno ostatní
      this.velocity.set(0, 0, 0);
      this.isJumping = false;
      this.isPunching = false;
      this.isBlocking = false;
      this.walkCycle = 0;
      
      // Reset animací rukou pokud nejsou v záškubu
      if (Math.random() > 0.05) {
        if (this.leftArm) {
          this.leftArm.rotation.x *= 0.9;
          this.leftArm.rotation.y *= 0.9;
          if (Math.abs(this.leftArm.rotation.z) < Math.PI/2) {
            this.leftArm.rotation.z *= 0.9;
          }
        }
        if (this.rightArm) {
          this.rightArm.rotation.x *= 0.9;
          this.rightArm.rotation.y *= 0.9;
          if (Math.abs(this.rightArm.rotation.z) < Math.PI/2) {
            this.rightArm.rotation.z *= 0.9;
          }
        }
      }
      
      // FIX A: DŮLEŽITÉ - synchronizovat position i při ležení!
      this.position.copy(this.group.position);
      
      // KONEC UPDATE při ležení - nic dalšího nedělat!
      return;
    }
    
    // === NORMÁLNÍ UPDATE (když NELEŽÍ) ===
    
    // Regenerace staminy (pouze když nestojí nebo není v akci)
    if (this.stamina < 100 && !this.isPerformingMove && !this.isPunching && !this.isBlocking) {
      this.stamina += 0.05; // Pomalá regenerace
      this.stamina = Math.min(100, this.stamina);
    }
    
    // Spotřeba staminy při blokování
    if (this.isBlocking && this.stamina > 0) {
      this.stamina -= 0.1;
      this.stamina = Math.max(0, this.stamina);
      
      // Přestat blokovat když dojde stamina
      if (this.stamina <= 0) {
        this.stopBlocking();
      }
    }
    
    // Plynulé otáčení k cílové rotaci
    if (this.targetRotation !== undefined) {
      // Vypočítat nejkratší cestu k cílové rotaci
      let angleDiff = this.targetRotation - this.rotation;
      
      // Normalizovat úhel do rozsahu -PI až PI
      while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
      
      // Plynulá interpolace rotace
      const rotationSpeed = 0.15;
      if (Math.abs(angleDiff) > 0.01) {
        this.rotation += angleDiff * rotationSpeed;
        this.group.rotation.y = this.rotation;
      }
    }
    
    // Aplikace gravitace
    if (this.isJumping) {
      this.velocity.y -= 0.00375; // Gravitace zpomalena 4x (původně 0.015)
    }
    
    // Kontrola kolizí s ostatními wrestlery PŘED pohybem
    // EXTRA podmínka - nekontrolovat kolize vůbec pokud někdo dělá chvat
    let shouldCheckCollisions = true;
    
    if (this.isApproachingForMove || this.isPerformingMove || this.isBeingGrabbed) {
      shouldCheckCollisions = false;
    }
    
    // Zkontrolovat i ostatní wrestlery
    for (let other of otherWrestlers) {
      if (other && (other.isApproachingForMove || other.isPerformingMove || other.isBeingGrabbed || other.isLyingDown)) {
        shouldCheckCollisions = false;
        break;
      }
    }
    
    if (shouldCheckCollisions) {
      for (let other of otherWrestlers) {
        if (other && other !== this && !other.isLyingDown) {
          this.resolveCollisionWith(other);
        }
      }
    }
    
    // Aktualizace pozice
    this.group.position.x += this.velocity.x;
    this.group.position.y += this.velocity.y;
    this.group.position.z += this.velocity.z;
    
    // Omezení pohybu v ringu (10x10) - měkké omezení
    const ringLimit = 4.2; // Trochu menší kvůli větším wrestlerům
    if (Math.abs(this.group.position.x) > ringLimit) {
      this.group.position.x = Math.sign(this.group.position.x) * ringLimit;
      this.velocity.x *= -0.5; // Odraz od kraje
    }
    if (Math.abs(this.group.position.z) > ringLimit) {
      this.group.position.z = Math.sign(this.group.position.z) * ringLimit;
      this.velocity.z *= -0.5; // Odraz od kraje
    }
    
    // Kontrola dopadu na zem
    if (this.group.position.y <= 0.65) { // Zvýšeno kvůli větší postavě (1.5x scale)
      this.group.position.y = 0.65;
      this.velocity.y = 0;
      this.isJumping = false;
    }
    
    // Postupné zpomalení
    this.velocity.x *= 0.85;
    this.velocity.z *= 0.85;
    
    // Animace úderu
    this.animatePunch();
    
    // Cooldown
    if (this.punchCooldown > 0) {
      this.punchCooldown--;
    }
    
    // Aktualizace pozice pro kolize
    this.position.copy(this.group.position);
  }
  
  takeDamage(amount) {
    this.health -= amount;
    this.health = Math.max(0, this.health);
    
    // Efekt poškození - červené zablikání
    const originalColor = this.torso.material.color.getHex();
    this.torso.material.color.setHex(0xff0000);
    setTimeout(() => {
      this.torso.material.color.setHex(originalColor);
    }, 100);
  }
  
  getPosition() {
    return this.group.position;
  }
  
  getHealth() {
    return this.health;
  }
}

// Komponenta pro správu wrestlerů
const WrestlerCharacter = React.forwardRef(({ scene, onUpdate, aiWrestlerRef }, ref) => {
  const playerInternalRef = useRef(null);
  const keysPressed = useRef({});
  const frameRef = useRef(null);
  
  // Expose player to parent component through ref
  useEffect(() => {
    if (ref) {
      ref.current = playerInternalRef.current;
    }
  }, [ref]);
  
  // Uložit pozici při unmount (pro React Strict Mode)
  const savedPositionRef = useRef(null);
  const savedHealthRef = useRef(100);
  const savedStaminaRef = useRef(100);
  const lastUpdateRef = useRef({ health: 100, stamina: 100 });
  const updateCounterRef = useRef(0);
  
  useEffect(() => {
    if (!scene) return;
    
    // DŮLEŽITÉ: Uložit pozici staré instance před odstraněním
    if (playerInternalRef.current && playerInternalRef.current.group) {
      savedPositionRef.current = {
        x: playerInternalRef.current.group.position.x,
        y: playerInternalRef.current.group.position.y,
        z: playerInternalRef.current.group.position.z,
        rotation: playerInternalRef.current.rotation,
        targetRotation: playerInternalRef.current.targetRotation || playerInternalRef.current.rotation,
        // Uložit i důležité stavy
        isLyingDown: playerInternalRef.current.isLyingDown,
        lyingTimer: playerInternalRef.current.lyingTimer,
        isStunned: playerInternalRef.current.isStunned,
        stunnedTimer: playerInternalRef.current.stunnedTimer,
        isPerformingMove: playerInternalRef.current.isPerformingMove,
        isBeingGrabbed: playerInternalRef.current.isBeingGrabbed,
        isApproachingForMove: playerInternalRef.current.isApproachingForMove,
        // NEUKLÁDAT velocity pokud wrestler provádí chvat nebo je v chvatu!
        // Velocity ukládáme jen při normálním pohybu
        velocity: (!playerInternalRef.current.isPerformingMove && 
                   !playerInternalRef.current.isBeingGrabbed && 
                   !playerInternalRef.current.isApproachingForMove &&
                   !playerInternalRef.current.isLyingDown &&
                   !playerInternalRef.current.isStunned &&
                   Math.abs(playerInternalRef.current.velocity.x) < 0.2 &&
                   Math.abs(playerInternalRef.current.velocity.z) < 0.2) ? {
          x: playerInternalRef.current.velocity.x * 0.3, // Ještě víc snížit pro bezpečnost
          y: 0, // Vždy vynulovat Y
          z: playerInternalRef.current.velocity.z * 0.3
        } : null,
        walkCycle: playerInternalRef.current.walkCycle || 0
      };
      savedHealthRef.current = playerInternalRef.current.health;
      savedStaminaRef.current = playerInternalRef.current.stamina;
      
      scene.remove(playerInternalRef.current.group);
      playerInternalRef.current = null;
    }
    
    // Vytvoření hráče
    playerInternalRef.current = new Wrestler(scene, 0xff0000, "Litvínov Lancer");
    
    // Obnovit pozici pokud existuje, jinak použít výchozí
    if (savedPositionRef.current) {
      playerInternalRef.current.group.position.set(
        savedPositionRef.current.x,
        savedPositionRef.current.y,
        savedPositionRef.current.z
      );
      playerInternalRef.current.position.set(
        savedPositionRef.current.x,
        savedPositionRef.current.y,
        savedPositionRef.current.z
      );
      playerInternalRef.current.rotation = savedPositionRef.current.rotation;
      playerInternalRef.current.targetRotation = savedPositionRef.current.targetRotation || savedPositionRef.current.rotation;
      playerInternalRef.current.group.rotation.y = savedPositionRef.current.rotation;
      
      // Ujistit se, že rotace jsou v rozumných mezích
      while (playerInternalRef.current.rotation > Math.PI) playerInternalRef.current.rotation -= 2 * Math.PI;
      while (playerInternalRef.current.rotation < -Math.PI) playerInternalRef.current.rotation += 2 * Math.PI;
      while (playerInternalRef.current.targetRotation > Math.PI) playerInternalRef.current.targetRotation -= 2 * Math.PI;
      while (playerInternalRef.current.targetRotation < -Math.PI) playerInternalRef.current.targetRotation += 2 * Math.PI;
      playerInternalRef.current.health = savedHealthRef.current;
      playerInternalRef.current.stamina = savedStaminaRef.current;
      
      // Obnovit i důležité stavy
      playerInternalRef.current.isLyingDown = savedPositionRef.current.isLyingDown || false;
      playerInternalRef.current.lyingTimer = savedPositionRef.current.lyingTimer || 0;
      playerInternalRef.current.isStunned = savedPositionRef.current.isStunned || false;
      playerInternalRef.current.stunnedTimer = savedPositionRef.current.stunnedTimer || 0;
      playerInternalRef.current.isPerformingMove = savedPositionRef.current.isPerformingMove || false;
      playerInternalRef.current.isBeingGrabbed = savedPositionRef.current.isBeingGrabbed || false;
      playerInternalRef.current.isApproachingForMove = savedPositionRef.current.isApproachingForMove || false;
      
      // Velocity VŽDY vynulovat při re-mountu (bezpečnější než obnovovat)
      playerInternalRef.current.velocity.set(0, 0, 0);
      playerInternalRef.current.walkCycle = savedPositionRef.current.walkCycle || 0;
    } else {
      // Výchozí pozice pouze při prvním vytvoření
      playerInternalRef.current.group.position.set(-2, 0.65, 0);
      playerInternalRef.current.position.set(-2, 0.65, 0);
    }
    
    // Expose to parent ref
    if (ref) {
      ref.current = playerInternalRef.current;
    }
    
    // Kontrola ovládání
    const handleKeyDown = (event) => {
      keysPressed.current[event.key.toLowerCase()] = true;
      
      // Speciální akce
      if (event.key === ' ') {
        playerInternalRef.current.jump();
      }
      if (event.key.toLowerCase() === 'e') {
        playerInternalRef.current.punch();
      }
      if (event.key.toLowerCase() === 'q') {
        playerInternalRef.current.block();
      }
      if (event.key.toLowerCase() === 'f') {
        // Iniciovat chvat na AI (wrestler si sám dojde k cíli)
        if (aiWrestlerRef && aiWrestlerRef.current && playerInternalRef.current) {
          console.log('Hráč zkouší chvat!');
          wrestlingMoves.initiateMove(playerInternalRef.current, aiWrestlerRef.current);
        }
      }
    };
    
    const handleKeyUp = (event) => {
      keysPressed.current[event.key.toLowerCase()] = false;
      
      if (event.key.toLowerCase() === 'q') {
        playerInternalRef.current.stopBlocking();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Game loop
    const gameLoop = () => {
      frameRef.current = requestAnimationFrame(gameLoop);
      
      if (playerInternalRef.current) {
        // DŮLEŽITÉ: Zajistit, že parent ref má vždy aktuální instanci
        if (ref && ref.current !== playerInternalRef.current) {
          ref.current = playerInternalRef.current;
        }
        
        // Pohyb podle stisknutých kláves - pouze pokud wrestler může chodit
        if (!playerInternalRef.current.isApproachingForMove && 
            !playerInternalRef.current.isLyingDown && 
            !playerInternalRef.current.isStunned &&
            !playerInternalRef.current.isPerformingMove &&
            !playerInternalRef.current.isBeingGrabbed) {
          const direction = new THREE.Vector3(0, 0, 0);
          
          // Vertikální pohyb (W/S)
          if (keysPressed.current['w']) direction.z -= 1;
          if (keysPressed.current['s']) direction.z += 1;
          
          // Horizontální pohyb (A/D) - správný směr
          if (keysPressed.current['a']) direction.x -= 1;
          if (keysPressed.current['d']) direction.x += 1;
          
          // Normalizace vektoru pro konstantní rychlost i při diagonálním pohybu
          if (direction.length() > 0) {
            direction.normalize();
          }
          
          playerInternalRef.current.move(direction);
        }
        
        // Update wrestlera s kolizní detekcí
        const otherWrestlers = [];
        if (aiWrestlerRef && aiWrestlerRef.current) {
          otherWrestlers.push(aiWrestlerRef.current);
        }
        playerInternalRef.current.update(otherWrestlers);
        
        // FIX C: ODSTRANĚNO volání wrestlingMoves.update() - už se volá jen v AI smyčce!
        // wrestlingMoves.update();  // TOTO JE ODSTRANĚNO
        
        // Callback pro aktualizaci UI - throttled a pouze při změně
        updateCounterRef.current++;
        if (onUpdate && updateCounterRef.current % 10 === 0) { // Volat jen každý 10. frame
          const currentHealth = playerInternalRef.current.getHealth();
          const currentStamina = playerInternalRef.current.stamina;
          
          // Volat pouze pokud se hodnoty změnily
          if (lastUpdateRef.current.health !== currentHealth || 
              lastUpdateRef.current.stamina !== currentStamina) {
            lastUpdateRef.current.health = currentHealth;
            lastUpdateRef.current.stamina = currentStamina;
            
            onUpdate({
              health: currentHealth,
              stamina: currentStamina,
              position: playerInternalRef.current.getPosition()
            });
          }
        }
      }
    };
    
    gameLoop();
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      // NERUŠÍME aktivní chvat při cleanup - necháme ho dokončit s novými instancemi
      // Pouze uložíme stav pro obnovení
      
      // Odstranění wrestlera ze scény
      if (playerInternalRef.current && playerInternalRef.current.group) {
        scene.remove(playerInternalRef.current.group);
      }
    };
  }, [scene, onUpdate, ref, aiWrestlerRef]);
  
  return null; // Tato komponenta nevrací žádné UI
});

WrestlerCharacter.displayName = 'WrestlerCharacter';

export { Wrestler, WrestlerCharacter as default };