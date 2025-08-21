'use client';

import * as THREE from 'three';

// Třída pro správu wrestlingových chvatů
export class WrestlingMovesSystem {
  constructor() {
    this.activeMove = null;
    this.movePhase = 0;
    this.moveTimer = 0;
    this.moveTarget = null;
    this.moveInitiator = null;
  }
  
  // Získat vzdálenost mezi wrestlery (používá group.position)
  getDistance(wrestler1, wrestler2) {
    if (!wrestler1?.group || !wrestler2?.group) return Infinity;
    
    const pos1 = wrestler1.group.position;
    const pos2 = wrestler2.group.position;
    const dx = pos1.x - pos2.x;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dz * dz);
  }
  
  // Získat úhel mezi wrestlery
  getAngleBetween(attacker, target) {
    if (!attacker?.group || !target?.group) return 0;
    
    const pos1 = attacker.group.position;
    const pos2 = target.group.position;
    const dx = pos2.x - pos1.x;
    const dz = pos2.z - pos1.z;
    return Math.atan2(dx, dz);
  }
  
  // Zjistit jestli je útočník za cílem
  isBehindTarget(attacker, target) {
    if (!attacker?.group || !target?.group) return false;
    
    // Získat směr kam se dívá cíl
    const targetFacing = target.rotation || 0;
    
    // Získat úhel od cíle k útočníkovi
    const angleToAttacker = Math.atan2(
      attacker.group.position.x - target.group.position.x,
      attacker.group.position.z - target.group.position.z
    );
    
    // Vypočítat rozdíl úhlů
    let angleDiff = Math.abs(targetFacing - angleToAttacker);
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    angleDiff = Math.abs(angleDiff);
    
    // Pokud je útočník v úhlu větším než 120 stupňů, je "za" cílem
    return angleDiff > (2 * Math.PI / 3);
  }
  
  // Iniciovat chvat - wrestler si sám dojde k cíli
  initiateMove(attacker, target) {
    console.log('=== POKUS O CHVAT ===');
    
    if (!attacker || !target) {
      console.log('Chvat ZRUŠEN: chybí attacker nebo target');
      return false;
    }
    if (this.activeMove) {
      console.log('Chvat ZRUŠEN: už probíhá jiný chvat');
      return false;
    }
    if (target.isBeingGrabbed) {
      console.log('Chvat ZRUŠEN: cíl už je chycený');
      return false;
    }
    if (target.isLyingDown) {
      console.log('Chvat ZRUŠEN: cíl leží');
      return false;
    }
    if (target.isStunned) {
      console.log('Chvat ZRUŠEN: cíl je omráčený');
      return false;
    }
    if (attacker.isLyingDown) {
      console.log('Chvat ZRUŠEN: útočník leží');
      return false;
    }
    if (attacker.isStunned) {
      console.log('Chvat ZRUŠEN: útočník je omráčený');
      return false;
    }
    if (attacker.isPerformingMove) {
      console.log('Chvat ZRUŠEN: útočník už provádí chvat');
      return false;
    }
    if (attacker.isBeingGrabbed) {
      console.log('Chvat ZRUŠEN: útočník je chycený');
      return false;
    }
    
    // Kontrola staminy - potřeba alespoň 20 staminy pro chvat
    if (attacker.stamina !== undefined && attacker.stamina < 20) {
      console.log(`Chvat ZRUŠEN: nedostatek staminy (${attacker.stamina})`);
      return false;
    }
    
    const distance = this.getDistance(attacker, target);
    console.log(`Chvat INICIOVÁN! Začíná přibližování... Vzdálenost: ${distance.toFixed(2)}`);
    
    // Nastavit přípravu na chvat
    this.activeMove = 'approaching';
    this.moveInitiator = attacker;
    this.moveTarget = target;
    this.movePhase = 0;
    this.moveTimer = 0;
    
    attacker.isApproachingForMove = true;
    
    console.log('===================');
    return true;
  }
  
  // Update pro přibližování k cíli
  updateApproaching() {
    // Kontrola že objekty stále existují
    if (!this.moveInitiator || !this.moveTarget || !this.moveInitiator.group || !this.moveTarget.group) {
      console.log('Chvat zrušen - chybí objekty');
      this.cancelMove();
      return;
    }
    
    // DŮLEŽITÉ: Zrušit chvat pokud cíl mezitím začal ležet nebo je omráčený
    if (this.moveTarget.isLyingDown || this.moveTarget.isStunned) {
      console.log('Chvat zrušen - cíl leží nebo je omráčený');
      this.cancelMove();
      return;
    }
    
    // DŮLEŽITÉ: Zrušit chvat pokud útočník mezitím začal ležet nebo je omráčený
    if (this.moveInitiator.isLyingDown || this.moveInitiator.isStunned) {
      console.log('Chvat zrušen - útočník leží nebo je omráčený');
      this.cancelMove();
      return;
    }
    
    const distance = this.getDistance(this.moveInitiator, this.moveTarget);
    const executeDistance = 2.2; // Vzdálenost pro provedení chvatu
    
    if (this.moveTimer % 10 === 0) { // Každých 10 framů
      console.log(`Přibližování: vzdálenost ${distance.toFixed(2)}, potřeba ${executeDistance}`);
    }
    
    if (distance > executeDistance) {
      // Přiblížit se k cíli
      const angle = this.getAngleBetween(this.moveInitiator, this.moveTarget);
      
      // Nastavit směr pohybu
      const moveDirection = new THREE.Vector3(
        Math.sin(angle),
        0,
        Math.cos(angle)
      );
      
      // RYCHLEJŠÍ přiblížení při chvatu
      this.moveInitiator.velocity.x = moveDirection.x * 0.12;
      this.moveInitiator.velocity.z = moveDirection.z * 0.12;
      
      // Otočit se směrem k cíli
      this.moveInitiator.targetRotation = angle;
      
      // Animace rychlé chůze/běhu
      this.moveInitiator.walkCycle += 0.1;
      if (this.moveInitiator.animateWalk) {
        this.moveInitiator.animateWalk();
      }
      
      this.moveTimer++;
      
      // Timeout pro zrušení pokud se nedaří přiblížit
      if (this.moveTimer > 300) { // 5 sekund
        console.log('Přibližování timeout - zrušeno');
        this.cancelMove();
      }
    } else {
      // Jsme dost blízko - rozhodnout který chvat provést
      console.log('DOSAŽENA VZDÁLENOST PRO CHVAT!');
      const isBehind = this.isBehindTarget(this.moveInitiator, this.moveTarget);
      
      if (isBehind) {
        console.log('>>> PROVÁDÍM GERMAN SUPLEX (ze zadu) <<<');
        this.startGermanSuplex();
      } else {
        console.log('>>> PROVÁDÍM CHOKESLAM (zepředu) <<<');
        this.startChokeslam();
      }
    }
  }
  
  // Zahájit Chokeslam
  startChokeslam() {
    if (!this.moveInitiator || !this.moveTarget) {
      this.cancelMove();
      return;
    }
    
    console.log('CHOKESLAM ZAHÁJEN!');
    this.activeMove = 'chokeslam';
    this.movePhase = 1;
    this.moveTimer = 0;
    
    // Nastavit flagy
    this.moveInitiator.isPerformingMove = true;
    this.moveInitiator.isApproachingForMove = false;
    this.moveTarget.isBeingGrabbed = true;
    
    // Zastavit pohyb obou wrestlerů
    this.moveInitiator.velocity.set(0, 0, 0);
    this.moveTarget.velocity.set(0, 0, 0);
    
    // Otočit útočníka přesně k cíli
    const angle = this.getAngleBetween(this.moveInitiator, this.moveTarget);
    this.moveInitiator.rotation = angle;
    this.moveInitiator.group.rotation.y = angle;
    this.moveInitiator.targetRotation = angle;
  }
  
  // Zahájit German Suplex (ze zadu)
  startGermanSuplex() {
    if (!this.moveInitiator || !this.moveTarget) {
      this.cancelMove();
      return;
    }
    
    console.log('GERMAN SUPLEX ZAHÁJEN!');
    this.activeMove = 'germanSuplex';
    this.movePhase = 1;
    this.moveTimer = 0;
    
    this.moveInitiator.isPerformingMove = true;
    this.moveInitiator.isApproachingForMove = false;
    this.moveTarget.isBeingGrabbed = true;
    
    this.moveInitiator.velocity.set(0, 0, 0);
    this.moveTarget.velocity.set(0, 0, 0);
  }
  
  // Update Chokeslam animace
  updateChokeslam() {
    // Kontrola že objekty stále existují
    if (!this.moveInitiator || !this.moveTarget || !this.moveInitiator.group || !this.moveTarget.group) {
      this.cancelMove();
      return;
    }
    
    this.moveTimer++;
    
    switch(this.movePhase) {
      case 1: // Fáze chycení za krk (1.5x pomaleji)
        this.animateGrab();
        if (this.moveTimer > 45) {  // Bylo 30
          console.log('Chokeslam: Fáze 2 - zvedání');
          this.movePhase = 2;
          this.moveTimer = 0;
        }
        break;
        
      case 2: // Fáze zvednutí (1.5x pomaleji)
        this.animateLift();
        if (this.moveTimer > 60) {  // Bylo 40
          console.log('Chokeslam: Fáze 3 - hození dolů');
          this.movePhase = 3;
          this.moveTimer = 0;
        }
        break;
        
      case 3: // Fáze hození dolů (1.5x pomaleji)
        this.animateSlam();
        if (this.moveTimer > 45) {  // Bylo 30
          console.log('Chokeslam: Fáze 4 - ležení');
          this.movePhase = 4;
          this.moveTimer = 0;
        }
        break;
        
      case 4: // Ležení na zemi - nechat jak je
        this.animateLyingDown();
        if (this.moveTimer > 60) {
          console.log('CHOKESLAM DOKONČEN!');
          this.finishChokeslam();
        }
        break;
    }
  }
  
  // Update German Suplex animace
  updateGermanSuplex() {
    // Kontrola že objekty stále existují
    if (!this.moveInitiator || !this.moveTarget || !this.moveInitiator.group || !this.moveTarget.group) {
      this.cancelMove();
      return;
    }
    
    this.moveTimer++;
    
    switch(this.movePhase) {
      case 1: // Chycení ze zadu (1.5x pomaleji)
        this.animateBackGrab();
        if (this.moveTimer > 38) {  // Bylo 25
          console.log('Suplex: Fáze 2 - zvednutí');
          this.movePhase = 2;
          this.moveTimer = 0;
        }
        break;
        
      case 2: // Zvednutí a převrácení dozadu (1.5x pomaleji)
        this.animateSuplex();
        if (this.moveTimer > 52) {  // Bylo 35
          console.log('Suplex: Fáze 3 - dopad');
          this.movePhase = 3;
          this.moveTimer = 0;
        }
        break;
        
      case 3: // Dopad (1.5x pomaleji)
        this.animateSuplexImpact();
        if (this.moveTimer > 30) {  // Bylo 20
          console.log('Suplex: Fáze 4 - ležení');
          this.movePhase = 4;
          this.moveTimer = 0;
        }
        break;
        
      case 4: // Ležení na zemi
        this.animateLyingDown();
        if (this.moveTimer > 50) {
          console.log('GERMAN SUPLEX DOKONČEN!');
          this.finishGermanSuplex();
        }
        break;
    }
  }
  
  animateGrab() {
    if (!this.moveInitiator || !this.moveTarget) return;
    
    const progress = this.moveTimer / 45;  // Zpomaleno 1.5x
    
    // Útočník zvedne pravou ruku k hrdle soupeře
    if (this.moveInitiator.rightArm) {
      this.moveInitiator.rightArm.rotation.x = -1.8 * progress;
      this.moveInitiator.rightArm.rotation.z = -0.5 * progress;
    }
    
    // Posunout ruku k soupeři
    if (this.moveInitiator.rightFist) {
      this.moveInitiator.rightFist.position.set(
        0.45 + 0.3 * progress,
        1.2 + 0.8 * progress,
        0.5 * progress
      );
    }
    
    // Cíl se začne naklánět dozadu
    if (this.moveTarget.group) {
      this.moveTarget.group.rotation.x = -0.1 * progress;
    }
  }
  
  animateLift() {
    if (!this.moveInitiator || !this.moveTarget) return;
    
    const progress = this.moveTimer / 60;  // Zpomaleno 1.5x
    
    // Útočník drží ruku nahoře
    if (this.moveInitiator.rightArm) {
      this.moveInitiator.rightArm.rotation.x = -1.8;
      this.moveInitiator.rightArm.rotation.z = -0.5;
    }
    if (this.moveInitiator.rightFist) {
      this.moveInitiator.rightFist.position.set(0.75, 2.0 + 0.5 * progress, 0.5);
    }
    
    // Zvedat cíl do vzduchu
    if (this.moveTarget.group) {
      this.moveTarget.group.position.y = 0.65 + 2.5 * progress;
      this.moveTarget.group.rotation.x = -0.2 * progress;
    }
    
    // Cíl mává nohama
    const waveAngle = Math.sin(this.moveTimer * 0.2) * 0.3;
    if (this.moveTarget.leftLeg) {
      this.moveTarget.leftLeg.rotation.x = waveAngle;
    }
    if (this.moveTarget.rightLeg) {
      this.moveTarget.rightLeg.rotation.x = -waveAngle;
    }
  }
  
  animateSlam() {
    if (!this.moveInitiator || !this.moveTarget) return;
    
    const progress = this.moveTimer / 45;  // Zpomaleno 1.5x
    
    // Útočník prudce stáhne ruku dolů
    if (this.moveInitiator.rightArm) {
      this.moveInitiator.rightArm.rotation.x = -1.8 + 2.5 * progress;
    }
    if (this.moveInitiator.rightFist) {
      this.moveInitiator.rightFist.position.z = 0.5 - 0.5 * progress;
    }
    
    // Cíl rychle padá NA SVÉ AKTUÁLNÍ X,Z POZICI
    const fallSpeed = progress * progress;
    if (this.moveTarget.group) {
      // POUZE měníme Y pozici pro pád, X a Z ZŮSTÁVAJÍ!
      const currentX = this.moveTarget.group.position.x;
      const currentZ = this.moveTarget.group.position.z;
      this.moveTarget.group.position.y = 3.15 - (3.15 - 0.65) * fallSpeed;
      // Ujistit se že X a Z se NEMĚNÍ
      this.moveTarget.group.position.x = currentX;
      this.moveTarget.group.position.z = currentZ;
      
      // Rotace při pádu
      this.moveTarget.group.rotation.x = -0.2 - 0.3 * progress;
      this.moveTarget.group.rotation.z = Math.sin(progress * Math.PI) * 0.2;
    }
    
    // Efekt dopadu
    if (progress > 0.9 && !this.moveTarget.slamImpacted) {
      this.moveTarget.slamImpacted = true;
      console.log('💥 SLAM IMPACT!');
      this.createImpactEffect();
    }
  }
  
  animateLyingDown() {
    if (!this.moveTarget || !this.moveTarget.group) return;
    
    // Cíl leží na zádech NA SVÉ AKTUÁLNÍ POZICI - ABSOLUTNĚ ŽÁDNÉ PŘESOUVÁNÍ!
    // Pouze zajistit správnou rotaci pro ležení, pozici NEMĚNÍME!
    this.moveTarget.group.rotation.x = -Math.PI / 2; // 90 stupňů - leží na zádech
    this.moveTarget.group.rotation.z = 0;
    // this.moveTarget.group.position VŮBEC NEMĚNÍME!
    
    // Občasné záškuby (reakce na bolest) - vydýchávání
    if (Math.random() < 0.05) {  // 5% šance na záškub
      const twitch = (Math.random() - 0.5) * 0.05;  // Menší záškuby
      if (this.moveTarget.leftLeg) {
        this.moveTarget.leftLeg.rotation.x = twitch;
      }
      if (this.moveTarget.rightArm) {
        this.moveTarget.rightArm.rotation.z = twitch;
      }
    }
    
    // Simulace těžkého dýchání - mírné pohyby hrudníku
    if (this.moveTarget.torso) {
      const breathing = Math.sin(this.moveTimer * 0.1) * 0.02;
      this.moveTarget.torso.scale.y = 1 + breathing;
      this.moveTarget.torso.scale.x = 1 - breathing * 0.5; // Mírné rozšíření do stran při nádechu
    }
    
    // Útočník se vrací do normální pozice
    if (this.moveInitiator) {
      if (this.moveInitiator.rightArm) {
        this.moveInitiator.rightArm.rotation.x *= 0.95;
        this.moveInitiator.rightArm.rotation.z *= 0.95;
      }
      if (this.moveInitiator.rightFist) {
        this.moveInitiator.rightFist.position.x = 0.45;
        this.moveInitiator.rightFist.position.y = 1.2;
        this.moveInitiator.rightFist.position.z *= 0.95;
      }
      if (this.moveInitiator.leftArm) {
        this.moveInitiator.leftArm.rotation.x *= 0.95;
        this.moveInitiator.leftArm.rotation.y *= 0.95;
      }
    }
  }
  
  animateBackGrab() {
    if (!this.moveInitiator || !this.moveTarget) return;
    
    const progress = this.moveTimer / 38;  // Zpomaleno 1.5x
    
    // Útočník objímá soupeře ze zadu
    if (this.moveInitiator.leftArm) {
      this.moveInitiator.leftArm.rotation.x = -0.8 * progress;
      this.moveInitiator.leftArm.rotation.y = 0.6 * progress;
    }
    if (this.moveInitiator.rightArm) {
      this.moveInitiator.rightArm.rotation.x = -0.8 * progress;
      this.moveInitiator.rightArm.rotation.y = -0.6 * progress;
    }
    
    // Přitáhnout se k soupeři
    if (this.moveInitiator.group && this.moveTarget.group) {
      const targetPos = this.moveTarget.group.position;
      const attackerPos = this.moveInitiator.group.position;
      attackerPos.x += (targetPos.x - attackerPos.x) * progress * 0.3;
      attackerPos.z += (targetPos.z - attackerPos.z) * progress * 0.3;
    }
  }
  
  animateSuplex() {
    if (!this.moveInitiator || !this.moveTarget) return;
    
    const progress = this.moveTimer / 52;  // Zpomaleno 1.5x
    
    // Oba wrestleři se převrací dozadu
    const rotationAngle = progress * Math.PI;
    
    // Útočník se zakloní dozadu
    if (this.moveInitiator.group) {
      this.moveInitiator.group.rotation.x = -rotationAngle * 0.8;
      this.moveInitiator.group.position.y = 0.65 + Math.sin(rotationAngle) * 1.5;
    }
    
    // Cíl letí přes útočníka
    if (this.moveTarget.group) {
      this.moveTarget.group.rotation.x = -rotationAngle;
      this.moveTarget.group.position.y = 0.65 + Math.sin(rotationAngle) * 2.5;
      
      // Posun cíle dozadu
      const angle = this.moveInitiator.rotation || 0;
      this.moveTarget.group.position.x -= Math.sin(angle) * progress * 2;
      this.moveTarget.group.position.z -= Math.cos(angle) * progress * 2;
    }
  }
  
  animateSuplexImpact() {
    if (!this.moveInitiator || !this.moveTarget) return;
    
    const progress = this.moveTimer / 30;  // Zpomaleno 1.5x
    
    // Oba padají na zem
    if (this.moveInitiator.group) {
      this.moveInitiator.group.position.y = 0.65;
      this.moveInitiator.group.rotation.x = 0;
    }
    
    if (this.moveTarget.group) {
      this.moveTarget.group.position.y = 0.65;
      this.moveTarget.group.rotation.x = -Math.PI * (1 - progress);
    }
    
    if (progress > 0.5 && !this.moveTarget.suplexImpacted) {
      this.moveTarget.suplexImpacted = true;
      console.log('💥 SUPLEX IMPACT!');
      this.createImpactEffect();
    }
  }
  
  createImpactEffect() {
    if (!this.moveTarget || !this.moveTarget.group) return;
    
    // Vizuální efekt dopadu
    this.moveTarget.group.scale.y = 0.7;
    setTimeout(() => {
      if (this.moveTarget && this.moveTarget.group) {
        this.moveTarget.group.scale.y = 1.5; // Vrátit na původní scale
      }
    }, 100);
  }
  
  finishChokeslam() {
    if (!this.moveInitiator || !this.moveTarget) {
      this.cancelMove();
      return;
    }
    
    console.log('💀 CHOKESLAM DAMAGE: 35 HP');
    console.log(`${this.moveTarget.name} LEŽÍ NA ZEMI!`);
    
    // DŮLEŽITÉ: Uložit reference PŘED resetem!
    const attacker = this.moveInitiator;
    const victim = this.moveTarget;
    
    // Útočník pouze vrátí ruku do normální pozice
    if (attacker.rightArm) {
      attacker.rightArm.rotation.x = 0;
      attacker.rightArm.rotation.z = 0;
    }
    if (attacker.rightFist) {
      attacker.rightFist.position.set(0.45, 1.2, 0);
    }
    
    // Resetovat všechny flagy útočníka
    attacker.isPerformingMove = false;
    attacker.isApproachingForMove = false;
    attacker.isBeingGrabbed = false;
    
    // Útočník ztratí staminu
    if (attacker.stamina !== undefined) {
      attacker.stamina -= 25;
      attacker.stamina = Math.max(0, attacker.stamina);
    }
    
    // KRITICKÉ: Nastavit stav oběti SPRÁVNĚ
    victim.isBeingGrabbed = false;
    victim.isPerformingMove = false;
    victim.isApproachingForMove = false;
    victim.slamImpacted = false;
    
    // Masivní poškození
    if (victim.takeDamage) {
      victim.takeDamage(35);
    }
    
    // NASTAVIT LEŽENÍ - oběť zůstane TAM KDE JE!
    victim.isLyingDown = true;
    victim.isStunned = true;
    victim.stunnedTimer = 90; // 1.5 sekundy omráčení
    victim.lyingTimer = 300; // 5 sekund celkově ležení
    
    // Ujistit se že leží správně NA SVÉ POZICI - ŽÁDNÝ TELEPORT!
    if (victim.group) {
      victim.group.rotation.x = -Math.PI / 2; // Leží na zádech
      // victim.group.position NEMĚNÍME! Zůstane tam kde je!
      console.log(`${victim.name} leží na pozici: x=${victim.group.position.x.toFixed(2)}, z=${victim.group.position.z.toFixed(2)}`);
    }
    
    // Zastavit veškerý pohyb oběti
    if (victim.velocity) {
      victim.velocity.set(0, 0, 0);
    }
    victim.isJumping = false;
    
    console.log(`${victim.name} bude ležet ${victim.lyingTimer} framů (omráčen: ${victim.stunnedTimer})`);
    console.log(`Kontrola: isLyingDown=${victim.isLyingDown}, lyingTimer=${victim.lyingTimer}`);
    
    // AŽ NAKONEC resetovat systém chvatů
    this.activeMove = null;
    this.movePhase = 0;
    this.moveTimer = 0;
    this.moveInitiator = null;
    this.moveTarget = null;
  }
  
  finishGermanSuplex() {
    if (!this.moveInitiator || !this.moveTarget) {
      this.cancelMove();
      return;
    }
    
    console.log('💀 GERMAN SUPLEX DAMAGE: 30 HP');
    console.log(`${this.moveTarget.name} LEŽÍ NA ZEMI!`);
    
    // DŮLEŽITÉ: Uložit reference PŘED resetem!
    const attacker = this.moveInitiator;
    const victim = this.moveTarget;
    
    // Útočník pouze vrátí ruce do normální pozice
    if (attacker.leftArm) {
      attacker.leftArm.rotation.x = 0;
      attacker.leftArm.rotation.y = 0;
    }
    if (attacker.rightArm) {
      attacker.rightArm.rotation.x = 0;
      attacker.rightArm.rotation.y = 0;
    }
    
    // Resetovat všechny flagy útočníka
    attacker.isPerformingMove = false;
    attacker.isApproachingForMove = false;
    attacker.isBeingGrabbed = false;
    
    // Útočník ztratí staminu
    if (attacker.stamina !== undefined) {
      attacker.stamina -= 20;
      attacker.stamina = Math.max(0, attacker.stamina);
    }
    
    // KRITICKÉ: Nastavit stav oběti SPRÁVNĚ
    victim.isBeingGrabbed = false;
    victim.isPerformingMove = false;
    victim.isApproachingForMove = false;
    victim.suplexImpacted = false;
    
    // Velké poškození
    if (victim.takeDamage) {
      victim.takeDamage(30);
    }
    
    // NASTAVIT LEŽENÍ - oběť zůstane TAM KDE JE!
    victim.isLyingDown = true;
    victim.isStunned = true;
    victim.stunnedTimer = 75; // 1.25 sekundy omráčení
    victim.lyingTimer = 250; // 4+ sekund celkově ležení
    
    // Ujistit se že leží správně NA SVÉ POZICI - ŽÁDNÝ TELEPORT!
    if (victim.group) {
      victim.group.rotation.x = -Math.PI / 2; // Leží na zádech
      // victim.group.position NEMĚNÍME! Zůstane tam kde je!
      console.log(`${victim.name} leží na pozici: x=${victim.group.position.x.toFixed(2)}, z=${victim.group.position.z.toFixed(2)}`);
    }
    
    // Zastavit veškerý pohyb oběti
    if (victim.velocity) {
      victim.velocity.set(0, 0, 0);
    }
    victim.isJumping = false;
    
    console.log(`${victim.name} bude ležet ${victim.lyingTimer} framů (omráčen: ${victim.stunnedTimer})`);
    console.log(`Kontrola: isLyingDown=${victim.isLyingDown}, lyingTimer=${victim.lyingTimer}`);
    
    // AŽ NAKONEC resetovat systém chvatů
    this.activeMove = null;
    this.movePhase = 0;
    this.moveTimer = 0;
    this.moveInitiator = null;
    this.moveTarget = null;
  }
  
  resetMove() {
    console.log('Reset systému chvatů');
    this.activeMove = null;
    this.movePhase = 0;
    this.moveTimer = 0;
    
    // DŮLEŽITÉ: Vyčistit reference ale neresetovat flagy wrestlerů
    // (ty se resetují v finish funkcích)
    this.moveInitiator = null;
    this.moveTarget = null;
  }
  
  cancelMove() {
    console.log('❌ CHVAT ZRUŠEN');
    
    // Resetovat flagy útočníka
    if (this.moveInitiator) {
      this.moveInitiator.isPerformingMove = false;
      this.moveInitiator.isApproachingForMove = false;
      
      // Reset animací
      if (this.moveInitiator.rightArm) {
        this.moveInitiator.rightArm.rotation.x = 0;
        this.moveInitiator.rightArm.rotation.z = 0;
      }
      if (this.moveInitiator.rightFist) {
        this.moveInitiator.rightFist.position.set(0.45, 1.2, 0);
      }
      if (this.moveInitiator.leftArm) {
        this.moveInitiator.leftArm.rotation.x = 0;
        this.moveInitiator.leftArm.rotation.y = 0;
      }
    }
    
    // Resetovat flagy cíle
    if (this.moveTarget) {
      this.moveTarget.isBeingGrabbed = false;
      this.moveTarget.isPerformingMove = false;
      this.moveTarget.isApproachingForMove = false;
      
      if (this.moveTarget.group) {
        // Pokud cíl neleží, vrátit ho do normální pozice
        if (!this.moveTarget.isLyingDown) {
          this.moveTarget.group.rotation.x = 0;
          this.moveTarget.group.rotation.z = 0;
        }
      }
    }
    
    this.resetMove();
  }
  
  // Hlavní update funkce
  update() {
    if (!this.activeMove) return;
    
    switch(this.activeMove) {
      case 'approaching':
        this.updateApproaching();
        break;
      case 'chokeslam':
        this.updateChokeslam();
        break;
      case 'germanSuplex':
        this.updateGermanSuplex();
        break;
    }
  }
}

// Export instance
export const wrestlingMoves = new WrestlingMovesSystem();