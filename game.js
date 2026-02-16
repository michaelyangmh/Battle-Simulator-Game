// Totally Fun Battle Simulator - Game Logic

// Unit definitions - 30 Unit Types!
const UNIT_TYPES = {
    // Tier 1 - Basic Infantry
    knight: { name: 'Knight', hp: 100, attack: 15, range: 40, speed: 1.5, attackSpeed: 1000, icon: '🗡️' },
    archer: { name: 'Archer', hp: 60, attack: 20, range: 200, speed: 1.2, attackSpeed: 800, icon: '🏹' },
    warrior: { name: 'Warrior', hp: 110, attack: 18, range: 40, speed: 1.4, attackSpeed: 900, icon: '⚔️' },
    
    // Tier 1 - Heavy Units
    soldier: { name: 'Soldier', hp: 120, attack: 12, range: 35, speed: 1.0, attackSpeed: 1100, icon: '🛡️' },
    pikeman: { name: 'Pikeman', hp: 90, attack: 20, range: 60, speed: 1.1, attackSpeed: 950, icon: '🔱' },
    
    // Ranged Units
    crossbowman: { name: 'Crossbowman', hp: 55, attack: 25, range: 180, speed: 1.0, attackSpeed: 850, icon: '🎯' },
    longbowman: { name: 'Longbowman', hp: 50, attack: 30, range: 250, speed: 0.9, attackSpeed: 900, icon: '🎯' },
    marksman: { name: 'Marksman', hp: 45, attack: 35, range: 220, speed: 1.1, attackSpeed: 700, icon: '🔫' },
    
    // Magic Units
    mage: { name: 'Mage', hp: 50, attack: 30, range: 150, speed: 0.8, attackSpeed: 1500, icon: '🔮' },
    wizard: { name: 'Wizard', hp: 45, attack: 40, range: 140, speed: 0.7, attackSpeed: 1800, icon: '🧙' },
    sorcerer: { name: 'Sorcerer', hp: 40, attack: 45, range: 130, speed: 0.6, attackSpeed: 2000, icon: '🧙‍♂️' },
    warlock: { name: 'Warlock', hp: 55, attack: 35, range: 120, speed: 0.9, attackSpeed: 1600, icon: '🧟' },
    
    // Healer Units
    healer: { name: 'Healer', hp: 80, attack: 5, heal: 15, range: 120, speed: 1.0, attackSpeed: 2000, icon: '💚' },
    priest: { name: 'Priest', hp: 70, attack: 8, heal: 20, range: 100, speed: 0.9, attackSpeed: 1800, icon: '✝️' },
    cleric: { name: 'Cleric', hp: 75, attack: 6, heal: 18, range: 110, speed: 1.0, attackSpeed: 1900, icon: '☪️' },
    
    // Heavy Melee
    barbarian: { name: 'Barbarian', hp: 120, attack: 25, range: 35, speed: 1.0, attackSpeed: 1200, icon: '🪓' },
    berserker: { name: 'Berserker', hp: 100, attack: 35, range: 30, speed: 1.3, attackSpeed: 600, icon: '😡' },
    executioner: { name: 'Executioner', hp: 130, attack: 30, range: 35, speed: 0.8, attackSpeed: 1400, icon: '🗡️' },
    gladiator: { name: 'Gladiator', hp: 95, attack: 22, range: 45, speed: 1.6, attackSpeed: 800, icon: '🎭' },
    
    // Cavalry
    horseman: { name: 'Horseman', hp: 90, attack: 20, range: 35, speed: 2.2, attackSpeed: 900, icon: '🐴' },
    knight_rider: { name: 'Knight Rider', hp: 110, attack: 25, range: 40, speed: 2.0, attackSpeed: 850, icon: '🐎' },
    cavalry: { name: 'Cavalry', hp: 100, attack: 22, range: 35, speed: 2.1, attackSpeed: 880, icon: '🏇' },
    
    // Defensive
    guardian: { name: 'Guardian', hp: 150, attack: 10, range: 35, speed: 0.7, attackSpeed: 1500, icon: '🛡️' },
    sentinel: { name: 'Sentinel', hp: 140, attack: 12, range: 40, speed: 0.8, attackSpeed: 1300, icon: '🚪' },
    shield_bearer: { name: 'Shield Bearer', hp: 160, attack: 8, range: 30, speed: 0.6, attackSpeed: 1600, icon: '🛡️' },
    
    // Support
    scout: { name: 'Scout', hp: 40, attack: 15, range: 100, speed: 2.5, attackSpeed: 500, icon: '🏃' },
    assassin: { name: 'Assassin', hp: 50, attack: 40, range: 25, speed: 2.0, attackSpeed: 400, icon: '🗡️' },
    ninja: { name: 'Ninja', hp: 45, attack: 35, range: 30, speed: 2.3, attackSpeed: 450, icon: '🥷' },
    
    // Special
    dragon: { name: 'Dragon', hp: 200, attack: 50, range: 80, speed: 1.5, attackSpeed: 2000, icon: '🐉' },
    golem: { name: 'Golem', hp: 250, attack: 20, range: 30, speed: 0.4, attackSpeed: 2500, icon: '🗿' },
    elemental: { name: 'Elemental', hp: 80, attack: 45, range: 100, speed: 1.2, attackSpeed: 1200, icon: '🔥' }
};

// Max units per team
const MAX_UNITS_PER_TEAM = 50;
const TOTAL_UNITS = 30;

// Game state
let canvas, ctx;
let units = [];
let selectedUnit = 'knight';
let selectedTeam = 'red';
let isBattling = false;
let gameLoop = null;
let particles = [];

// DOM elements
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const clearBtn = document.getElementById('clearBtn');
const redCount = document.getElementById('redCount');
const blueCount = document.getElementById('blueCount');
const battleStatus = document.getElementById('battleStatus');
const winnerOverlay = document.getElementById('winnerOverlay');
const winnerText = document.getElementById('winnerText');
const playAgainBtn = document.getElementById('playAgainBtn');

// Initialize game
function init() {
    canvas = document.getElementById('battlefield');
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Unit button handlers
    document.querySelectorAll('.unit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.unit-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedUnit = btn.dataset.unit;
        });
    });
    
    // Select first unit by default
    document.querySelector('.unit-btn[data-unit="knight"]').classList.add('selected');
    
    // Team button handlers
    document.querySelectorAll('.team-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.team-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTeam = btn.dataset.team;
        });
    });
    
    // Canvas click handler
    canvas.addEventListener('click', handleCanvasClick);
    
    // Action button handlers
    startBtn.addEventListener('click', startBattle);
    resetBtn.addEventListener('click', resetGame);
    clearBtn.addEventListener('click', clearField);
    playAgainBtn.addEventListener('click', resetGame);
    
    // Start render loop
    requestAnimationFrame(render);
}

// Resize canvas to fit container
function resizeCanvas() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width - 20;
    canvas.height = rect.height - 20;
}

// Handle canvas click for unit placement
function handleCanvasClick(e) {
    if (isBattling) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check bounds
    if (x < 20 || x > canvas.width - 20 || y < 20 || y > canvas.height - 20) {
        return;
    }
    
    addUnit(x, y, selectedUnit, selectedTeam);
}

// Add a unit to the battlefield
function addUnit(x, y, type, team) {
    // Check unit limit per team
    const teamUnits = units.filter(u => u.team === team && !u.dying);
    if (teamUnits.length >= MAX_UNITS_PER_TEAM) {
        battleStatus.textContent = `Max ${MAX_UNITS_PER_TEAM} units per team!`;
        return;
    }
    
    const unitType = UNIT_TYPES[type];
    const unit = {
        id: Date.now() + Math.random(),
        x: x,
        y: y,
        type: type,
        team: team,
        hp: unitType.hp,
        maxHp: unitType.hp,
        attack: unitType.attack,
        range: unitType.range,
        speed: unitType.speed,
        attackSpeed: unitType.attackSpeed,
        lastAttack: 0,
        target: null,
        moving: false,
        radius: 15,
        color: team === 'red' ? '#e74c3c' : '#3498db',
        icon: unitType.icon,
        heal: unitType.heal || 0,
        opacity: 1,
        dying: false
    };
    
    units.push(unit);
    updateStats();
    render();
}

// Update stats display
function updateStats() {
    const redUnits = units.filter(u => u.team === 'red' && !u.dying);
    const blueUnits = units.filter(u => u.team === 'blue' && !u.dying);
    redCount.textContent = redUnits.length;
    blueCount.textContent = blueUnits.length;
}

// Start the battle
function startBattle() {
    const redUnits = units.filter(u => u.team === 'red');
    const blueUnits = units.filter(u => u.team === 'blue');
    
    if (redUnits.length === 0 || blueUnits.length === 0) {
        battleStatus.textContent = 'Need at least 1 unit per team!';
        return;
    }
    
    isBattling = true;
    startBtn.disabled = true;
    battleStatus.textContent = '⚔️ Battle in progress! ⚔️';
    
    // Start game loop
    let lastTime = 0;
    gameLoop = (timestamp) => {
        if (!isBattling) return;
        
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        
        updateBattle(timestamp);
        checkWinCondition();
        
        if (isBattling) {
            requestAnimationFrame(gameLoop);
        }
    };
    
    requestAnimationFrame(gameLoop);
}

// Update battle logic
function updateBattle(timestamp) {
    const aliveUnits = units.filter(u => !u.dying);
    
    aliveUnits.forEach(unit => {
        // Find target
        unit.target = findTarget(unit);
        
        if (unit.target) {
            const distance = getDistance(unit, unit.target);
            
            if (unit.heal > 0) {
                // Healer logic
                if (distance <= unit.range) {
                    healUnit(unit, unit.target, timestamp);
                } else {
                    moveToward(unit, unit.target, timestamp);
                }
            } else {
                // Attack logic
                if (distance <= unit.range) {
                    attackUnit(unit, unit.target, timestamp);
                } else {
                    moveToward(unit, unit.target, timestamp);
                }
            }
        }
    });
    
    // Update particles
    updateParticles();
}

// Find target for unit
function findTarget(unit) {
    const enemies = units.filter(u => u.team !== unit.team && !u.dying);
    
    if (unit.heal > 0) {
        // Healers target lowest HP ally
        const allies = units.filter(u => u.team === unit.team && !u.dying && u.hp < u.maxHp);
        if (allies.length === 0) return null;
        
        return allies.reduce((lowest, ally) => 
            ally.hp < lowest.hp ? ally : lowest
        );
    }
    
    if (enemies.length === 0) return null;
    
    // Find nearest enemy
    return enemies.reduce((nearest, enemy) => {
        const dist = getDistance(unit, enemy);
        const nearestDist = getDistance(unit, nearest);
        return dist < nearestDist ? enemy : nearest;
    });
}

// Get distance between two units
function getDistance(u1, u2) {
    return Math.sqrt(Math.pow(u2.x - u1.x, 2) + Math.pow(u2.y - u1.y, 2));
}

// Move unit toward target
function moveToward(unit, target, timestamp) {
    const dx = target.x - unit.x;
    const dy = target.y - unit.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
        const moveX = (dx / distance) * unit.speed;
        const moveY = (dy / distance) * unit.speed;
        
        unit.x += moveX;
        unit.y += moveY;
        unit.moving = true;
    } else {
        unit.moving = false;
    }
    
    // Keep in bounds
    unit.x = Math.max(20, Math.min(canvas.width - 20, unit.x));
    unit.y = Math.max(20, Math.min(canvas.height - 20, unit.y));
}

// Attack unit
function attackUnit(attacker, target, timestamp) {
    if (timestamp - attacker.lastAttack < attacker.attackSpeed) {
        return;
    }
    
    attacker.lastAttack = timestamp;
    
    // Deal damage
    target.hp -= attacker.attack;
    attacker.moving = false;
    
    // Create attack particle
    createAttackParticle(attacker, target);
    
    // Check if target died
    if (target.hp <= 0) {
        killUnit(target);
    }
}

// Heal unit
function healUnit(healer, target, timestamp) {
    if (timestamp - healer.lastAttack < healer.attackSpeed) {
        return;
    }
    
    healer.lastAttack = timestamp;
    
    // Heal target
    target.hp = Math.min(target.maxHp, target.hp + healer.heal);
    healer.moving = false;
    
    // Create heal particle
    createHealParticle(healer, target);
}

// Kill unit
function killUnit(unit) {
    unit.dying = true;
    unit.hp = 0;
    createDeathParticles(unit);
    updateStats();
}

// Create attack particle effect
function createAttackParticle(from, to) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    particles.push({
        type: 'attack',
        x: from.x,
        y: from.y,
        targetX: to.x,
        targetY: to.y,
        angle: angle,
        life: 1,
        decay: 0.05
    });
}

// Create heal particle effect
function createHealParticle(from, to) {
    particles.push({
        type: 'heal',
        x: to.x,
        y: to.y,
        life: 1,
        decay: 0.03
    });
}

// Create death particles
function createDeathParticles(unit) {
    for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 / 15) * i;
        const speed = 2 + Math.random() * 3;
        particles.push({
            type: 'death',
            x: unit.x,
            y: unit.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: 0.02,
            color: unit.color
        });
    }
}

// Update particles
function updateParticles() {
    particles = particles.filter(p => {
        p.life -= p.decay;
        
        if (p.type === 'death') {
            p.x += p.vx;
            p.y += p.vy;
        }
        
        return p.life > 0;
    });
}

// Check win condition
function checkWinCondition() {
    const redAlive = units.filter(u => u.team === 'red' && !u.dying).length;
    const blueAlive = units.filter(u => u.team === 'blue' && !u.dying).length;
    
    if (redAlive === 0 || blueAlive === 0) {
        isBattling = false;
        
        const winner = redAlive > 0 ? 'red' : 'blue';
        showWinner(winner);
    }
}

// Show winner overlay
function showWinner(winner) {
    winnerText.textContent = winner === 'red' ? '🔴 Red Team Wins! 🔴' : '🔵 Blue Team Wins! 🔵';
    winnerText.className = winner === 'red' ? 'red-wins' : 'blue-wins';
    winnerOverlay.classList.remove('hidden');
    battleStatus.textContent = winner === 'red' ? 'Red Team Wins!' : 'Blue Team Wins!';
}

// Reset game
function resetGame() {
    isBattling = false;
    units = [];
    particles = [];
    startBtn.disabled = false;
    battleStatus.textContent = 'Place your soldiers!';
    winnerOverlay.classList.add('hidden');
    updateStats();
}

// Clear field
function clearField() {
    if (isBattling) return;
    units = [];
    updateStats();
    render();
}

// Render the game
function render() {
    // Clear canvas
    ctx.fillStyle = '#2d4a3e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw battlefield grid
    drawGrid();
    
    // Draw units
    units.forEach(unit => {
        drawUnit(unit);
    });
    
    // Draw particles
    drawParticles();
    
    // Continue render loop
    requestAnimationFrame(render);
}

// Draw grid pattern
function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    
    const gridSize = 40;
    
    for (let x = gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    for (let y = gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Draw a unit
function drawUnit(unit) {
    ctx.save();
    
    // Apply dying animation
    if (unit.dying) {
        ctx.globalAlpha = unit.opacity;
        unit.opacity -= 0.05;
    }
    
    // Draw unit circle
    ctx.beginPath();
    ctx.arc(unit.x, unit.y, unit.radius, 0, Math.PI * 2);
    ctx.fillStyle = unit.color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw health bar
    const barWidth = 30;
    const barHeight = 5;
    const barX = unit.x - barWidth / 2;
    const barY = unit.y - unit.radius - 12;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    
    // Health
    const healthPercent = unit.hp / unit.maxHp;
    ctx.fillStyle = healthPercent > 0.5 ? '#27ae60' : healthPercent > 0.25 ? '#f39c12' : '#e74c3c';
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Draw icon
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(unit.icon, unit.x, unit.y);
    
    // Draw team indicator
    ctx.font = '10px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(unit.team === 'red' ? '🔴' : '🔵', unit.x, unit.y + unit.radius + 8);
    
    ctx.restore();
}

// Draw particles
function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.life;
        
        if (p.type === 'attack') {
            // Draw attack line
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.targetX, p.targetY);
            ctx.stroke();
            
            // Draw impact
            ctx.beginPath();
            ctx.arc(p.targetX, p.targetY, 10 * p.life, 0, Math.PI * 2);
            ctx.fillStyle = '#ff0';
            ctx.fill();
        } else if (p.type === 'heal') {
            // Draw heal effect
            ctx.beginPath();
            ctx.arc(p.x, p.y, 15 * (1 - p.life) + 5, 0, Math.PI * 2);
            ctx.fillStyle = '#0f0';
            ctx.fill();
        } else if (p.type === 'death') {
            // Draw death particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        
        ctx.restore();
    });
}

// Start the game when page loads
window.addEventListener('load', init);
