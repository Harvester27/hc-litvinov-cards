'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Wrestler } from './WrestlerCharacter';
import { wrestlingMoves } from './WrestlingMoves';

// AI Wrestler třída rozšiřující základního wrestlera
class AIWrestler extends Wrestler {
  constructor(scene, color = 0x0000ff, name = "AI Opponent") {
    super(scene, color, name);
    
    // AI specifické vlastnosti
    this.aiState = 'idle'; // idle, chasing, attacking, retreating, blocking
    this.target = null;
    this.attackRange = 2;
    this.chaseRange = 8;
    this.retreatHealth = 30;
    this.decisionCooldown = 0;
    this.strafeCooldown = 0;
    this.aggressiveness = 0.7; // 0-1, jak agresivní je AI
    this.reactionTime = 10; // frames
    this.dodgeChance = 0.3;
    
    // Taktické parametry
    this.preferredDistance = 2.0; // Ideální vzdálenost od soupeře (zvýšeno z 1.5 pro lepší chvaty)
    this.circleDirection = 1; // 1 nebo -1 pro kroužívý pohyb
    this.comboCounter = 0;
    this.lastActionTime = 0;
    
    // Přidáme flagy pro ležení a přibližování (zdědí se z Wrestler, ale pro jistotu)
    this.isApproachingForMove = false;
    this.isLyingDown = false;
    this.lyingTimer = 0;
  }
  
  setTarget(target) {
    this.target = target;
  }
  
  getDistanceToTarget() {
    if (!this.target) return Infinity;
    
    const dx = this.target.position.x - this.position.x;
    const dz = this.target.position.z - this.position.z;
    return Math.sqrt(dx * dx + dz * dz);
  }
  
  getAngleToTarget() {
    if (!this.target) return 0;
    
    const dx = this.target.position.x - this.position.x;
    const dz = this.target.position.z - this.position.z;
    return Math.atan2(dx, dz);
  }
  
  makeDecision() {
    // DŮLEŽITÉ: Nepřerušovat AI pokud se přibližuje pro chvat!
    if (this.isApproachingForMove) {
      return; // Nedělat žádná rozhodnutí během přibližování k chvatu
    }
    
    if (this.decisionCooldown > 0) {
      this.decisionCooldown--;
      return;
    }
    
    const distance = this.getDistanceToTarget();
    const healthPercentage = this.health / 100;
    const staminaPercentage = this.stamina / 100;
    
    // Rozhodování na základě situace
    if (healthPercentage < 0.3 && Math.random() < 0.125) {  // Zpomaleno 4x
      // Nízké zdraví - být opatrnější
      this.aiState = 'retreating';
      this.aggressiveness = 0.3;
    } else if (staminaPercentage < 0.2) {
      // Nízká stamina - ustoupit a regenerovat
      this.aiState = 'retreating';
    } else if (distance < this.attackRange) {
      // V dosahu útoku
      const attackRoll = Math.random();
      if (attackRoll < this.aggressiveness) {
        this.aiState = 'attacking';
      } else if (attackRoll < this.aggressiveness + 0.2) {
        this.aiState = 'blocking';
      } else {
        this.aiState = 'circling';
      }
    } else if (distance < this.chaseRange) {
      // Pronásledování
      this.aiState = 'chasing';
    } else {
      // Příliš daleko
      this.aiState = 'idle';
    }
    
    this.decisionCooldown = this.reactionTime;
  }
  
  executeAIBehavior() {
    // Pokud AI leží, pouze čekat až vstane
    if (this.isLyingDown) {
      return;
    }
    
    // DŮLEŽITÉ: Pokud se AI přibližuje pro chvat, pokračovat v přibližování!
    if (this.isApproachingForMove) {
      // Nechat wrestling moves system řídit pohyb
      return; // Nedělat nic jiného během přibližování
    }
    
    // Pokud AI provádí chvat nebo je omráčená, nedělat nic
    if (this.isPerformingMove || this.isBeingGrabbed || this.isStunned) {
      return;
    }
    
    if (!this.target) {
      this.aiState = 'idle';
      return;
    }
    
    this.makeDecision();
    
    // Vykonávat akce podle stavu
    switch(this.aiState) {
      case 'chasing':
        this.chase();
        break;
      case 'attacking':
        this.attackPattern();
        break;
      case 'retreating':
        this.retreat();
        break;
      case 'circling':
        this.circle();
        break;
      case 'blocking':
        this.defensiveStance();
        break;
      case 'idle':
        this.idle();
        break;
    }
    
    // Náhodné úhybné manévry
    if (Math.random() < 0.0025) {  // Zpomaleno 4x
      this.strafeCooldown = 20;
      this.circleDirection *= -1;
    }
  }
  
  chase() {
    const distance = this.getDistanceToTarget();
    
    // Pokud se přibližujeme pro chvat, nechat wrestling moves řídit pohyb
    if (this.isApproachingForMove) {
      return;
    }
    
    if (distance > this.preferredDistance) {
      // Vypočítat směr k cíli
      const dx = this.target.position.x - this.position.x;
      const dz = this.target.position.z - this.position.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      
      if (length > 0) {
        // Normalizovaný směr pohybu
        const direction = new THREE.Vector3(dx / length, 0, dz / length);
        this.move(direction);
      }
      
      // Občas skočit při pronásledování (zpomaleno)
      if (Math.random() < 0.005 && !this.isJumping) {  // Zpomaleno 4x
        this.jump();
      }
    }
  }
  
  attackPattern() {
    const distance = this.getDistanceToTarget();
    
    if (distance <= this.attackRange) {
      // Šance na chvat místo normálního útoku (pouze s dostatkem staminy)
      // ZVÝŠENÁ ŠANCE a upravená vzdálenost pro lepší fungování
      if (Math.random() < 0.15 && !this.isPerformingMove && !this.isApproachingForMove && 
          !this.target.isBeingGrabbed && !this.target.isLyingDown && this.stamina > 25) {
        // Iniciovat chvat (AI si sama dojde k cíli)
        console.log('AI pokouší se o chvat!'); // Debug
        if (wrestlingMoves.initiateMove(this, this.target)) {
          console.log('Chvat úspěšně zahájen!'); // Debug
          return; // Chvat byl úspěšně zahájen
        } else {
          console.log('Chvat se nepodařilo zahájit'); // Debug
        }
      }
      
      // Combo útok
      if (this.comboCounter === 0) {
        this.punch();
        this.comboCounter++;
      } else if (this.comboCounter === 1 && this.punchCooldown < 10) {
        this.punch();
        this.comboCounter++;
      } else if (this.comboCounter === 2 && this.punchCooldown < 5) {
        // Finisher - skok a úder
        if (!this.isJumping) {
          this.jump();
        }
        this.punch();
        this.comboCounter = 0;
      }
      
      // Po útoku trochu ustoupit
      if (Math.random() < 0.075) {  // Zpomaleno 4x
        this.aiState = 'circling';
      }
    } else {
      // Příliš daleko na útok
      this.aiState = 'chasing';
    }
  }
  
  retreat() {
    // Couvání od soupeře
    const dx = this.position.x - this.target.position.x;
    const dz = this.position.z - this.target.position.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    
    if (length > 0) {
      const direction = new THREE.Vector3(dx / length, 0, dz / length);
      this.move(direction);
    }
    
    // Při ústupu se bránit
    if (Math.random() < 0.125) {  // Zpomaleno 4x
      this.block();
    } else {
      this.stopBlocking();
    }
    
    // Občas uskočit stranou
    if (this.strafeCooldown > 0) {
      const angleToTarget = this.getAngleToTarget();
      const strafeAngle = angleToTarget + (Math.PI / 2) * this.circleDirection;
      const strafeDirection = new THREE.Vector3(
        Math.sin(strafeAngle) * 0.5,
        0,
        Math.cos(strafeAngle) * 0.5
      );
      this.move(strafeDirection);
      this.strafeCooldown--;
    }
  }
  
  circle() {
    // Kroužívý pohyb kolem soupeře
    const distance = this.getDistanceToTarget();
    const angleToTarget = this.getAngleToTarget();
    
    // Vypočítat směr kroužení (kolmo k směru k cíli)
    const circleAngle = angleToTarget + (Math.PI / 2) * this.circleDirection;
    
    // Kombinovat kroužení s udržováním vzdálenosti
    let moveX = Math.sin(circleAngle) * 0.7;
    let moveZ = Math.cos(circleAngle) * 0.7;
    
    // Upravit vzdálenost
    if (distance > this.preferredDistance + 0.5) {
      // Přiblížit se
      const dx = this.target.position.x - this.position.x;
      const dz = this.target.position.z - this.position.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      if (length > 0) {
        moveX += (dx / length) * 0.3;
        moveZ += (dz / length) * 0.3;
      }
    } else if (distance < this.preferredDistance - 0.5) {
      // Oddálit se
      const dx = this.position.x - this.target.position.x;
      const dz = this.position.z - this.target.position.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      if (length > 0) {
        moveX += (dx / length) * 0.3;
        moveZ += (dz / length) * 0.3;
      }
    }
    
    const direction = new THREE.Vector3(moveX, 0, moveZ);
    direction.normalize();
    this.move(direction);
    
    // Občas změnit směr kroužení
    if (Math.random() < 0.0125) {  // Zpomaleno 4x
      this.circleDirection *= -1;
    }
    
    // Náhodný útok při kroužení
    if (Math.random() < 0.025 && distance < this.attackRange) {  // Zpomaleno 4x
      this.aiState = 'attacking';
    }
  }
  
  defensiveStance() {
    this.block();
    
    // Držet blok po určitou dobu
    if (Math.random() < 0.05) {  // Zpomaleno 4x
      this.stopBlocking();
      
      // Protiútok po bloku
      if (Math.random() < this.aggressiveness) {
        this.aiState = 'attacking';
      } else {
        this.aiState = 'circling';
      }
    }
    
    // Uhýbání během blokování
    if (this.strafeCooldown > 0) {
      const angleToTarget = this.getAngleToTarget();
      const strafeAngle = angleToTarget + (Math.PI / 2) * this.circleDirection;
      const strafeDirection = new THREE.Vector3(
        Math.sin(strafeAngle) * 0.3,
        0,
        Math.cos(strafeAngle) * 0.3
      );
      this.move(strafeDirection);
      this.strafeCooldown--;
    }
  }
  
  idle() {
    // Náhodný pohyb když není cíl v dosahu
    if (Math.random() < 0.0125) {  // Zpomaleno 4x
      const randomAngle = Math.random() * Math.PI * 2;
      const randomDirection = new THREE.Vector3(
        Math.sin(randomAngle) * 0.5,
        0,
        Math.cos(randomAngle) * 0.5
      );
      this.move(randomDirection);
    }
    
    // Občas udělat taunt (posměšné gesto)
    if (Math.random() < 0.0025) {  // Zpomaleno 4x
      this.jump();
      this.leftArm.rotation.z = Math.PI / 2;
      setTimeout(() => {
        this.leftArm.rotation.z = 0;
      }, 500);
    }
  }
  
  // Override update metody pro AI logiku
  update(otherWrestlers = []) {
    // Volat AI behavior (obsahuje kontrolu pro přibližování)
    this.executeAIBehavior();
    
    // Volat původní update s kolizemi
    super.update(otherWrestlers);
    
    // Regenerace staminy (pouze když není v akci)
    if (this.stamina < 100 && !this.isPerformingMove && !this.isApproachingForMove) {
      this.stamina += 0.1;
    }
    
    // Adaptivní obtížnost
    if (this.health < 20) {
      this.aggressiveness = Math.min(0.9, this.aggressiveness + 0.1);
      this.reactionTime = Math.max(5, this.reactionTime - 1);
    }
  }
  
  // Reakce na úder
  onHit(damage) {
    this.takeDamage(damage);
    
    // Šance na okamžitou reakci
    if (Math.random() < this.dodgeChance * 0.25) {  // Zpomaleno 4x
      // Uskočit
      this.strafeCooldown = 15;
      this.aiState = 'retreating';
    } else if (Math.random() < this.aggressiveness * 0.25) {  // Zpomaleno 4x
      // Protiútok
      this.aiState = 'attacking';
    } else {
      // Začít blokovat
      this.aiState = 'blocking';
    }
  }
}

// React komponenta pro správu AI wrestlera
const AIWrestlerComponent = React.forwardRef(({ scene, playerRef, difficulty = 'medium', onUpdate }, ref) => {
  const aiInternalRef = useRef(null);
  const frameRef = useRef(null);
  
  // Expose AI to parent component through ref
  useEffect(() => {
    if (ref) {
      ref.current = aiInternalRef.current;
    }
  }, [ref]);
  
  useEffect(() => {
    if (!scene || !playerRef) return;
    
    // Nastavení obtížnosti
    let aiColor = 0x0000ff;
    let aiName = "AI Rival";
    let aggressiveness = 0.5;
    let reactionTime = 15;
    
    switch(difficulty) {
      case 'easy':
        aiColor = 0x00ff00;
        aiName = "Rookie Fighter";
        aggressiveness = 0.3;
        reactionTime = 20;
        break;
      case 'medium':
        aiColor = 0x0000ff;
        aiName = "Pro Wrestler";
        aggressiveness = 0.5;
        reactionTime = 15;
        break;
      case 'hard':
        aiColor = 0xff00ff;
        aiName = "Champion";
        aggressiveness = 0.7;
        reactionTime = 10;
        break;
      case 'extreme':
        aiColor = 0xff0000;
        aiName = "Legend";
        aggressiveness = 0.9;
        reactionTime = 5;
        break;
    }
    
    // Vytvoření AI wrestlera
    aiInternalRef.current = new AIWrestler(scene, aiColor, aiName);
    aiInternalRef.current.aggressiveness = aggressiveness;
    aiInternalRef.current.reactionTime = reactionTime;
    
    // Nastavení počáteční pozice (na pravé straně ringu) - zvýšeno kvůli větší postavě
    aiInternalRef.current.group.position.set(2, 0.65, 0);
    
    // Nastavení hráče jako cíl
    if (playerRef.current) {
      aiInternalRef.current.setTarget(playerRef.current);
    }
    
    // Expose to parent ref
    if (ref) {
      ref.current = aiInternalRef.current;
    }
    
    // AI update loop
    const aiLoop = () => {
      frameRef.current = requestAnimationFrame(aiLoop);
      
      if (aiInternalRef.current && playerRef.current) {
        // Aktualizace cíle
        aiInternalRef.current.setTarget(playerRef.current);
        
        // Update AI s kolizní detekcí
        const otherWrestlers = playerRef.current ? [playerRef.current] : [];
        aiInternalRef.current.update(otherWrestlers);
        
        // Update wrestling chvatů
        wrestlingMoves.update();
        
        // Kontrola kolizí a úderů
        const distance = aiInternalRef.current.getDistanceToTarget();
        
        // Pokud je hráč blízko a AI útočí
        if (distance < 1.5 && aiInternalRef.current.isPunching && !playerRef.current.isBlocking) {
          // Zasáhnout hráče
          if (Math.random() < 0.125) { // 12.5% šance na zásah (zpomaleno)
            playerRef.current.takeDamage(10);
          }
        }
        
        // Pokud hráč útočí a je blízko AI
        if (distance < 1.5 && playerRef.current.isPunching && !aiInternalRef.current.isBlocking) {
          // AI dostane zásah
          if (Math.random() < 0.15) { // 15% šance že hráč zasáhne (zpomaleno)
            aiInternalRef.current.onHit(15);
          }
        }
        
        // Callback pro aktualizaci UI
        if (onUpdate) {
          onUpdate({
            health: aiInternalRef.current.getHealth(),
            stamina: aiInternalRef.current.stamina
          });
        }
      }
    };
    
    aiLoop();
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (aiInternalRef.current && aiInternalRef.current.group) {
        scene.remove(aiInternalRef.current.group);
      }
    };
  }, [scene, playerRef, difficulty, ref, onUpdate]);
  
  return null;
});

AIWrestlerComponent.displayName = 'AIWrestlerComponent';

export { AIWrestler, AIWrestlerComponent as default };