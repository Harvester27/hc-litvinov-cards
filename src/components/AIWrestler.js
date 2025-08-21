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
    this.attackRange = 2.5; // Zvýšeno pro lepší dosah chvatů
    this.chaseRange = 8;
    this.retreatHealth = 30;
    this.decisionCooldown = 0;
    this.strafeCooldown = 0;
    this.aggressiveness = 0.7; // 0-1, jak agresivní je AI
    this.reactionTime = 10; // frames
    this.dodgeChance = 0.3;
    
    // Taktické parametry
    this.preferredDistance = 2.2; // Ideální vzdálenost od soupeře (upraveno pro chvaty)
    this.circleDirection = 1; // 1 nebo -1 pro kroužívý pohyb
    this.comboCounter = 0;
    this.lastActionTime = 0;
    
    // Flagy pro ležení a přibližování se zdědí z Wrestler třídy
    // NEPREPISOVAT je zde! (byly zde redundantní definice které způsobovaly problémy)
  }
  
  setTarget(target) {
    this.target = target;
  }
  
  // FIX B: Používat group.position místo this.position
  getDistanceToTarget() {
    if (!this.target || !this.group || !this.target.group) return Infinity;
    
    const dx = this.target.group.position.x - this.group.position.x;
    const dz = this.target.group.position.z - this.group.position.z;
    return Math.sqrt(dx * dx + dz * dz);
  }
  
  // FIX B: Používat group.position místo this.position
  getAngleToTarget() {
    if (!this.target || !this.group || !this.target.group) return 0;
    
    const dx = this.target.group.position.x - this.group.position.x;
    const dz = this.target.group.position.z - this.group.position.z;
    return Math.atan2(dx, dz);
  }
  
  makeDecision() {
    // DŮLEŽITÉ: Nepřerušovat AI pokud se přibližuje pro chvat!
    if (this.isApproachingForMove) {
      return; // Nedělat žádná rozhodnutí během přibližování k chvatu
    }
    
    // SPECIÁLNÍ: Pokud soupeř leží, automaticky taunt
    if (this.target && this.target.isLyingDown) {
      this.aiState = 'taunting';
      return;
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
    // Debug výpis stavu soupeře
    if (this.target && Math.random() < 0.05) { // 5% šance na výpis
      console.log(`AI vidí soupeře: isLyingDown=${this.target.isLyingDown}, lyingTimer=${this.target.lyingTimer}`);
    }
    
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
    
    // KRITICKÉ: Pokud soupeř leží, VŽDY dělat taunt
    if (this.target.isLyingDown) {
      console.log(`AI: Soupeř leží (timer: ${this.target.lyingTimer}), dělám taunt!`);
      this.aiState = 'taunting';
      this.taunt();
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
      case 'taunting':
        this.taunt();
        break;
    }
    
    // Náhodné úhybné manévry
    if (Math.random() < 0.0025) {  // Zpomaleno 4x
      this.strafeCooldown = 20;
      this.circleDirection *= -1;
    }
  }
  
  taunt() {
    // Taunt animace když soupeř leží
    if (Math.random() < 0.03) { // 3% šance každý frame
      const tauntType = Math.floor(Math.random() * 5);
      
      switch(tauntType) {
        case 0:
          // Zvednutí rukou nad hlavu (vítězné gesto)
          if (this.leftArm && this.rightArm) {
            this.leftArm.rotation.z = Math.PI;
            this.rightArm.rotation.z = -Math.PI;
            setTimeout(() => {
              if (this.leftArm && this.rightArm) {
                this.leftArm.rotation.z = 0;
                this.rightArm.rotation.z = 0;
              }
            }, 1000);
            console.log(`${this.name}: "YEAH! Jsem vítěz!"`);
          }
          break;
          
        case 1:
          // Flexing (napínání svalů)
          if (this.leftArm && this.rightArm) {
            this.leftArm.rotation.x = -1.5;
            this.rightArm.rotation.x = -1.5;
            this.leftArm.rotation.z = 0.7;
            this.rightArm.rotation.z = -0.7;
            setTimeout(() => {
              if (this.leftArm && this.rightArm) {
                this.leftArm.rotation.x = 0;
                this.rightArm.rotation.x = 0;
                this.leftArm.rotation.z = 0;
                this.rightArm.rotation.z = 0;
              }
            }, 800);
            console.log(`${this.name}: "Podívejte na ty svaly!"`);
          }
          break;
          
        case 2:
          // Skok radosti
          if (!this.isJumping) {
            this.jump();
            // Při skoku roztáhnout ruce
            if (this.leftArm && this.rightArm) {
              this.leftArm.rotation.z = Math.PI / 2;
              this.rightArm.rotation.z = -Math.PI / 2;
              setTimeout(() => {
                if (this.leftArm && this.rightArm) {
                  this.leftArm.rotation.z = 0;
                  this.rightArm.rotation.z = 0;
                }
              }, 500);
            }
            console.log(`${this.name}: "WOO HOO!"`);
          }
          break;
          
        case 3:
          // Otočení se k publiku s poklonou
          this.targetRotation = Math.random() * Math.PI * 2;
          if (this.torso) {
            this.torso.rotation.x = 0.3; // Mírná úklona
            setTimeout(() => {
              if (this.torso) {
                this.torso.rotation.x = 0;
              }
            }, 600);
          }
          console.log(`${this.name}: "Děkuji, děkuji publiku!"`);
          break;
          
        case 4:
          // Provokativní gesto - ukázání na ležícího soupeře
          if (this.rightArm && this.rightFist) {
            const angleToTarget = this.getAngleToTarget();
            this.targetRotation = angleToTarget;
            this.rightArm.rotation.x = -Math.PI / 2;
            this.rightArm.rotation.y = 0.5;
            this.rightFist.position.z = 1.0;
            setTimeout(() => {
              if (this.rightArm && this.rightFist) {
                this.rightArm.rotation.x = 0;
                this.rightArm.rotation.y = 0;
                this.rightFist.position.z = 0;
              }
            }, 1200);
            console.log(`${this.name}: "Tohle je váš šampion? Ha!"`);
          }
          break;
      }
    }
    
    // Pomalu kroužit kolem ležícího soupeře
    if (Math.random() < 0.7) {
      const angleToTarget = this.getAngleToTarget();
      const circleAngle = angleToTarget + (Math.PI / 2) * this.circleDirection;
      const circleDirection = new THREE.Vector3(
        Math.sin(circleAngle) * 0.3,
        0,
        Math.cos(circleAngle) * 0.3
      );
      this.move(circleDirection);
      
      // Občas změnit směr kroužení
      if (Math.random() < 0.02) {
        this.circleDirection *= -1;
      }
    }
  }
  
  chase() {
    // NIKDY nepronásledovat ležícího soupeře
    if (this.target && this.target.isLyingDown) {
      this.aiState = 'taunting';
      return;
    }
    
    const distance = this.getDistanceToTarget();
    
    // Pokud se přibližujeme pro chvat, nechat wrestling moves řídit pohyb
    if (this.isApproachingForMove) {
      return;
    }
    
    if (distance > this.preferredDistance) {
      // Vypočítat směr k cíli - opraveno na group.position
      const dx = this.target.group.position.x - this.group.position.x;
      const dz = this.target.group.position.z - this.group.position.z;
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
      // DŮLEŽITÉ: NIKDY se nepokoušet o chvat když soupeř leží!
      if (this.target && this.target.isLyingDown) {
        console.log(`${this.name}: Soupeř leží, nedělám chvat!`);
        // Místo útoku přejít na taunt
        this.aiState = 'taunting';
        return;
      }
      
      // Šance na chvat místo normálního útoku
      if (Math.random() < 0.25 && !this.isPerformingMove && !this.isApproachingForMove && 
          !this.target.isBeingGrabbed && !this.target.isLyingDown && 
          !this.target.isStunned && this.stamina > 20) {
        // Iniciovat chvat (AI si sama dojde k cíli)
        console.log('AI pokouší se o chvat! Vzdálenost:', distance.toFixed(2));
        if (wrestlingMoves.initiateMove(this, this.target)) {
          console.log('Chvat úspěšně zahájen!');
          return; // Chvat byl úspěšně zahájen
        } else {
          console.log('Chvat se nepodařilo zahájit');
        }
      }
      
      // Combo útok - pouze pokud soupeř neleží
      if (!this.target.isLyingDown) {
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
    // Couvání od soupeře - opraveno na group.position
    const dx = this.group.position.x - this.target.group.position.x;
    const dz = this.group.position.z - this.target.group.position.z;
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
    
    // Upravit vzdálenost - opraveno na group.position
    if (distance > this.preferredDistance + 0.5) {
      // Přiblížit se
      const dx = this.target.group.position.x - this.group.position.x;
      const dz = this.target.group.position.z - this.group.position.z;
      const length = Math.sqrt(dx * dx + dz * dz);
      if (length > 0) {
        moveX += (dx / length) * 0.3;
        moveZ += (dz / length) * 0.3;
      }
    } else if (distance < this.preferredDistance - 0.5) {
      // Oddálit se
      const dx = this.group.position.x - this.target.group.position.x;
      const dz = this.group.position.z - this.target.group.position.z;
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
  
  // Uložit pozici při unmount (pro React Strict Mode)
  const savedPositionRef = useRef(null);
  const savedHealthRef = useRef(100);
  const savedStaminaRef = useRef(100);
  const savedStateRef = useRef('idle');
  const lastUpdateRef = useRef({ health: 100, stamina: 100 });
  const updateCounterRef = useRef(0);
  
  // Expose AI to parent component through ref
  useEffect(() => {
    if (ref) {
      ref.current = aiInternalRef.current;
    }
  }, [ref]);
  
  useEffect(() => {
    if (!scene || !playerRef) return;
    
    // DŮLEŽITÉ: Uložit stav staré instance před odstraněním
    if (aiInternalRef.current && aiInternalRef.current.group) {
      savedPositionRef.current = {
        x: aiInternalRef.current.group.position.x,
        y: aiInternalRef.current.group.position.y,
        z: aiInternalRef.current.group.position.z,
        rotation: aiInternalRef.current.rotation,
        targetRotation: aiInternalRef.current.targetRotation || aiInternalRef.current.rotation,
        // Uložit všechny důležité stavy
        isLyingDown: aiInternalRef.current.isLyingDown,
        lyingTimer: aiInternalRef.current.lyingTimer,
        isStunned: aiInternalRef.current.isStunned,
        stunnedTimer: aiInternalRef.current.stunnedTimer,
        isPerformingMove: aiInternalRef.current.isPerformingMove,
        isBeingGrabbed: aiInternalRef.current.isBeingGrabbed,
        isApproachingForMove: aiInternalRef.current.isApproachingForMove,
        // Velocity raději VŮBEC neukládat - způsobuje problémy při re-mountu
        // Wrestler začne stát na místě, což je lepší než odlétat pryč
        velocity: null,
        walkCycle: aiInternalRef.current.walkCycle || 0
      };
      savedHealthRef.current = aiInternalRef.current.health;
      savedStaminaRef.current = aiInternalRef.current.stamina;
      savedStateRef.current = aiInternalRef.current.aiState;
      
      scene.remove(aiInternalRef.current.group);
      aiInternalRef.current = null;
    }
    
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
    
    // Obnovit pozici a stav pokud existuje, jinak použít výchozí
    if (savedPositionRef.current) {
      aiInternalRef.current.group.position.set(
        savedPositionRef.current.x,
        savedPositionRef.current.y,
        savedPositionRef.current.z
      );
      aiInternalRef.current.position.set(
        savedPositionRef.current.x,
        savedPositionRef.current.y,
        savedPositionRef.current.z
      );
      aiInternalRef.current.rotation = savedPositionRef.current.rotation;
      aiInternalRef.current.targetRotation = savedPositionRef.current.targetRotation || savedPositionRef.current.rotation;
      aiInternalRef.current.group.rotation.y = savedPositionRef.current.rotation;
      
      // Ujistit se, že rotace jsou v rozumných mezích
      while (aiInternalRef.current.rotation > Math.PI) aiInternalRef.current.rotation -= 2 * Math.PI;
      while (aiInternalRef.current.rotation < -Math.PI) aiInternalRef.current.rotation += 2 * Math.PI;
      while (aiInternalRef.current.targetRotation > Math.PI) aiInternalRef.current.targetRotation -= 2 * Math.PI;
      while (aiInternalRef.current.targetRotation < -Math.PI) aiInternalRef.current.targetRotation += 2 * Math.PI;
      aiInternalRef.current.health = savedHealthRef.current;
      aiInternalRef.current.stamina = savedStaminaRef.current;
      aiInternalRef.current.aiState = savedStateRef.current;
      
      // Obnovit všechny důležité stavy
      aiInternalRef.current.isLyingDown = savedPositionRef.current.isLyingDown || false;
      aiInternalRef.current.lyingTimer = savedPositionRef.current.lyingTimer || 0;
      aiInternalRef.current.isStunned = savedPositionRef.current.isStunned || false;
      aiInternalRef.current.stunnedTimer = savedPositionRef.current.stunnedTimer || 0;
      aiInternalRef.current.isPerformingMove = savedPositionRef.current.isPerformingMove || false;
      aiInternalRef.current.isBeingGrabbed = savedPositionRef.current.isBeingGrabbed || false;
      aiInternalRef.current.isApproachingForMove = savedPositionRef.current.isApproachingForMove || false;
      
      // Velocity VŽDY vynulovat při re-mountu (bezpečnější než obnovovat)
      aiInternalRef.current.velocity.set(0, 0, 0);
      aiInternalRef.current.walkCycle = savedPositionRef.current.walkCycle || 0;
    } else {
      // Výchozí pozice pouze při prvním vytvoření
      aiInternalRef.current.group.position.set(2, 0.65, 0);
      aiInternalRef.current.position.set(2, 0.65, 0);
    }
    
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
        // DŮLEŽITÉ: Zajistit, že parent ref má vždy aktuální instanci
        if (ref && ref.current !== aiInternalRef.current) {
          ref.current = aiInternalRef.current;
        }
        
        // Aktualizace cíle
        aiInternalRef.current.setTarget(playerRef.current);
        
        // FAILSAFE: Omezit maximální rychlost pro případ bugů
        if (aiInternalRef.current.velocity) {
          const maxSpeed = 0.15;
          const vel = aiInternalRef.current.velocity;
          const speed = Math.sqrt(vel.x * vel.x + vel.z * vel.z);
          
          if (speed > maxSpeed * 2) {
            console.warn(`AI velocity příliš vysoká! x:${vel.x.toFixed(3)}, z:${vel.z.toFixed(3)}, speed:${speed.toFixed(3)}`);
          }
          
          if (Math.abs(vel.x) > maxSpeed) {
            vel.x = Math.sign(vel.x) * maxSpeed;
          }
          if (Math.abs(vel.z) > maxSpeed) {
            vel.z = Math.sign(vel.z) * maxSpeed;
          }
          // Y velocity by neměla být moc velká (skok)
          if (vel.y > 0.3) {
            vel.y = 0.3;
          }
          if (vel.y < -0.5) {
            vel.y = -0.5; // Omezit i pád
          }
        }
        
        // Update AI s kolizní detekcí
        const otherWrestlers = playerRef.current ? [playerRef.current] : [];
        aiInternalRef.current.update(otherWrestlers);
        
        // Update wrestling chvatů - musí být PŘED kontrolou úderů
        // FIX: Aktualizovat reference ve wrestlingMoves na aktuální instance
        if (aiInternalRef.current && playerRef.current && 
            aiInternalRef.current.group && playerRef.current.group) {
          
          // Aktualizovat reference pokud se změnily
          if (wrestlingMoves.activeMove) {
            // Pokud probíhá chvat, zkontrolovat a aktualizovat reference
            if (wrestlingMoves.moveInitiator) {
              // Pokud je iniciátor AI, aktualizovat na novou instanci
              if (wrestlingMoves.moveInitiator.name === aiInternalRef.current.name) {
                wrestlingMoves.moveInitiator = aiInternalRef.current;
              }
              // Pokud je iniciátor hráč, aktualizovat na novou instanci
              else if (wrestlingMoves.moveInitiator.name === playerRef.current.name) {
                wrestlingMoves.moveInitiator = playerRef.current;
              }
            }
            
            if (wrestlingMoves.moveTarget) {
              // Pokud je cíl AI, aktualizovat na novou instanci
              if (wrestlingMoves.moveTarget.name === aiInternalRef.current.name) {
                wrestlingMoves.moveTarget = aiInternalRef.current;
              }
              // Pokud je cíl hráč, aktualizovat na novou instanci
              else if (wrestlingMoves.moveTarget.name === playerRef.current.name) {
                wrestlingMoves.moveTarget = playerRef.current;
              }
            }
          }
          
          // Nyní můžeme bezpečně volat update
          wrestlingMoves.update();
        }
        
        // Kontrola kolizí a úderů - POUZE pokud nikdo neleží
        if (!playerRef.current.isLyingDown && !aiInternalRef.current.isLyingDown) {
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
        }
        
        // Callback pro aktualizaci UI - throttled a pouze při změně
        updateCounterRef.current++;
        if (onUpdate && updateCounterRef.current % 10 === 0) { // Volat jen každý 10. frame
          const currentHealth = aiInternalRef.current.getHealth();
          const currentStamina = aiInternalRef.current.stamina;
          
          // Volat pouze pokud se hodnoty změnily
          if (lastUpdateRef.current.health !== currentHealth || 
              lastUpdateRef.current.stamina !== currentStamina) {
            lastUpdateRef.current.health = currentHealth;
            lastUpdateRef.current.stamina = currentStamina;
            
            onUpdate({
              health: currentHealth,
              stamina: currentStamina
            });
          }
        }
      }
    };
    
    aiLoop();
    
    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      // NERUÍME aktivní chvat při cleanup - necháme ho dokončit s novými instancemi
      // Pouze uložíme stav pro obnovení
      if (aiInternalRef.current && aiInternalRef.current.group) {
        // Stav se uloží automaticky na začátku useEffect
        scene.remove(aiInternalRef.current.group);
      }
    };
  }, [scene, playerRef, difficulty, ref, onUpdate]);
  
  return null;
});

AIWrestlerComponent.displayName = 'AIWrestlerComponent';

export { AIWrestler, AIWrestlerComponent as default };