// --- АУДИО ДВИЖОК ---
const sfx = {
    spin: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-audio.wav'),
    win: new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-audio.wav'),
    lose: new Audio('https://assets.mixkit.co/active_storage/sfx/3148/3148-audio.wav'),
    card: new Audio('https://assets.mixkit.co/active_storage/sfx/3005/3005-audio.wav'),
    
    play(soundName) {
        let sound = this[soundName].cloneNode();
        sound.volume = 0.4;
        sound.play().catch(e => console.log("Sound locked until user interaction"));
    }
};

// --- ГЛАВНЫЙ КОНТРОЛЛЕР ---
const app = {
    balance: 0,
    user: '',
    
    // Наша "База Данных"
    validUsers: {
        "vlad": { name: "Vlad Kelman", pass: "123123", startBalance: 5000, role: "Admin" },
        "margo":  { name: "Menja zawut Margo", pass: "margo123", startBalance: 5000, role: "Admin" },
        "roman": { name: "Roman", pass: "3,14159", startBalance: 5000, role: "VIP Tester" }
    },

    // Рабочие промокоды
    promoCodes: {
        "START1000": { amount: 1000, used: false },
        "BULKA_VIP": { amount: 5000, used: false }
    },

    init() {
        setTimeout(() => {
            const progress = document.getElementById('loading-progress');
            progress.style.width = '100%';
            setTimeout(() => {
                document.getElementById('preloader').style.opacity = '0';
                setTimeout(() => document.getElementById('preloader').style.display = 'none', 500);
            }, 500);
        }, 1000);
    },

    login() {
        const input = document.getElementById('login-name').value.toLowerCase().trim();
        const passInput = document.getElementById('login-pass').value;
        
        if(this.validUsers[input]) {
            const userData = this.validUsers[input];
            
            if(passInput === userData.pass) {
                this.user = userData.name;
                
                const savedBalance = localStorage.getItem(`balance_${input}`);
                this.balance = savedBalance ? parseInt(savedBalance) : userData.startBalance;

                document.getElementById('auth-modal').style.display = 'none';
                document.getElementById('app-interface').style.display = 'flex';
                
                document.getElementById('display-username').innerText = this.user;
                document.getElementById('tourney-username').innerText = this.user;
                document.getElementById('vip-level').innerText = userData.role;
                document.getElementById('profile-role').innerText = userData.role;
                
                this.updateUI();
                games.slots.loadType('classic');
                this.notify(`Autoryzacja udana! Witaj, ${this.user}`);
            } else {
                this.notify("Błąd: Nieprawidłowe hasło!", "error");
            }
        } else {
            this.notify("Błąd: Nieznany login. Odmowa dostępu.", "error");
        }
    },

    // --- НОВАЯ СИСТЕМА ДЕПОЗИТА ---
    openDepositModal() {
        document.getElementById('deposit-modal').style.display = 'flex';
    },

    closeDepositModal() {
        document.getElementById('deposit-modal').style.display = 'none';
        // Очищаем поля при закрытии
        document.getElementById('deposit-amount').value = '';
        document.getElementById('blik-code').value = '';
        document.getElementById('card-number').value = '';
        document.getElementById('deposit-promo').value = '';
    },

    selectPayment(method) {
        document.querySelectorAll('.method-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`method-${method}`).classList.add('active');
        
        if(method === 'blik') {
            document.getElementById('payment-details-blik').style.display = 'flex';
            document.getElementById('payment-details-card').style.display = 'none';
        } else {
            document.getElementById('payment-details-blik').style.display = 'none';
            document.getElementById('payment-details-card').style.display = 'flex';
        }
    },

    processDeposit() {
        const amount = parseInt(document.getElementById('deposit-amount').value);
        const promo = document.getElementById('deposit-promo').value.toUpperCase().trim();

        // 1. Пасхалка ДАВИДА
        if(promo === "DAVID" || promo === "ДАВИД") {
            const sidebar = document.querySelector('.slot-sidebar'); 
            if(sidebar && !document.getElementById('type-dew')) {
                const jackpot = document.querySelector('.jackpot-widget');
                const btnHtml = `<button onclick="games.slots.loadType('dew')" class="btn-slot-type" id="type-dew" style="color: #00ff00; border-color: #00ff00; text-shadow: 0 0 5px #00ff00;">🥫 Dew Fortune</button>`;
                if (jackpot) jackpot.insertAdjacentHTML('beforebegin', btnHtml);
                else sidebar.insertAdjacentHTML('beforeend', btnHtml);
            }
            this.notify("Znalazłeś Easter Egg: Odblokowano ukryty automat!", "success");
            this.closeDepositModal();
            this.showTab('slots');
            games.slots.loadType('dew');
            return; 
        }

        // 2. Пасхалка MOHEB
        if(promo === "MOHEB" || promo === "МОХЕБ") {
            const sidebar = document.querySelector('.slot-sidebar'); 
            if(sidebar && !document.getElementById('type-moheb')) {
                const jackpot = document.querySelector('.jackpot-widget');
                const btnHtml = `<button onclick="games.slots.loadType('moheb')" class="btn-slot-type" id="type-moheb" style="color: #d4af37; border-color: #d4af37; text-shadow: 0 0 5px #d4af37;">🏎️ Moheb mode</button>`;
                if (jackpot) jackpot.insertAdjacentHTML('beforebegin', btnHtml);
                else sidebar.insertAdjacentHTML('beforeend', btnHtml);
            }
            this.notify("Tryb MOHEB! Niemiecka motoryzacja przejmuje kontrolę.", "success");
            this.closeDepositModal();
            this.showTab('slots');
            games.slots.loadType('moheb');
            return; 
        }

        // 3. Валидация суммы (Минимум 50 USD)
        if(isNaN(amount) || amount < 50) {
            return this.notify("Błąd: Minimalna kwota wpłaty to 50 USD.", "error");
        }

        // 4. Обработка обычных промокодов
        let finalAmount = amount;
        if(promo) {
            if(this.promoCodes[promo]) {
                if(!this.promoCodes[promo].used) {
                    finalAmount += this.promoCodes[promo].amount;
                    this.promoCodes[promo].used = true;
                    this.notify(`Zastosowano kod! Dodatkowe $${this.promoCodes[promo].amount} w drodze.`, "success");
                } else {
                    return this.notify("Błąd: Ten kod promocyjny został już użyty.", "error");
                }
            } else {
                return this.notify("Błąd: Nieprawidłowy kod promocyjny.", "error");
            }
        }

        // 5. Имитация обработки банком
        const btn = document.getElementById('btn-process-pay');
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Przetwarzanie...`;
        btn.disabled = true;

        setTimeout(() => {
            this.balance += finalAmount;
            this.updateUI();
            this.notify(`Sukces! Saldo zostało zasilone kwotą $${finalAmount}.`, "success");
            this.closeDepositModal();
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 1500);
    },

    showTab(id) {
        document.querySelectorAll('.content-tab').forEach(t => t.style.display = 'none');
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`tab-${id}`).style.display = 'block';
        document.getElementById(`btn-${id}`).classList.add('active');
    },

    launchGame(tabId, gameType = null) {
        this.showTab(tabId); 
        if (tabId === 'slots' && gameType) {
            games.slots.loadType(gameType);
        }
    },

    logout() { location.reload(); },

    notify(message, type = "success") {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderLeftColor = type === 'error' ? '#ff3333' : '#00f2fe';
        toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    },

    mockFeature(featureName) {
        this.notify(`Moduł "${featureName}" jest obecnie niedostępny w wersji demonstracyjnej.`, "error");
    },

    claimBonus() {
        const bonusClaimed = localStorage.getItem(`bonus_${this.user}`);
        if(bonusClaimed) {
            this.notify("Już odebrałeś swój bonus powitalny!", "error");
        } else {
            this.balance += 200;
            localStorage.setItem(`bonus_${this.user}`, "true");
            this.updateUI();
            this.notify("Sukces! Dodano 200$ bonusu powitalnego do twojego salda.", "success");
        }
    },

    toggleAuto() {
        this.notify("Tryb Auto-Spin został aktywowany. (Funkcja VIP)", "success");
    },

    updateUI() {
        document.getElementById('balance-val').innerText = this.balance.toLocaleString();
        
        const profileBalance = document.getElementById('profile-balance');
        if(profileBalance) profileBalance.innerText = this.balance.toLocaleString();
        
        const profileName = document.getElementById('profile-name');
        if(profileName) profileName.innerText = this.user;
        
        const currentLogin = document.getElementById('login-name').value.toLowerCase().trim();
        localStorage.setItem(`balance_${currentLogin}`, this.balance);
    }
};

// --- ИГРОВЫЕ МОДУЛИ ---
const games = {
    // 1. СИСТЕМА СЛОТОВ
    slots: {
        types: {
            classic: { name: "Classic 777", symbols: ['🍒', '🍋', '🔔', '💎', '7️⃣'], themeClass: 'theme-classic', jackpot: '7️⃣', mult: 20 },
            cyber: { name: "Cyber Neon", symbols: ['🤖', '👾', '🔋', '🚀', '🌌'], themeClass: 'theme-cyber', jackpot: '🚀', mult: 30 },
            mystic: { name: "Dark Magic", symbols: ['👁️', '🔮', '🌙', '💀', '🧛'], themeClass: 'theme-mystic', jackpot: '🔮', mult: 50 },
            dew: { 
                name: "David's Mountain Dew", 
                symbols: ['<img src="dew.png" class="slot-icon">'], 
                themeClass: 'theme-dew', 
                jackpot: '<img src="dew.png" class="slot-icon">', 
                mult: 5 
            },
            moheb: { 
                name: "Dark Moheb Mode", 
                symbols: [
                    '<img src="https://cdn11.bigcommerce.com/s-ydriczk/images/stencil/1500x1500/products/88784/92305/Jin-from-BTS-K-Pop-face-mask-available-now-at-starstills__93277.1548765854.jpg?c=2" class="car-logo">',
                    '<img src="https://m.media-amazon.com/images/I/71MJ+wF4yXL._AC_UF1000,1000_QL80_.jpg" class="car-logo">',
                    '<img src="https://i.pinimg.com/564x/c3/dd/7e/c3dd7e75aecbcce93f9ba9da4ece817f.jpg" class="car-logo">'
                ], 
                themeClass: 'theme-moheb', 
                jackpot: '<img src="https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" class="car-logo">', 
                mult: 10 
            }
        },
        currentType: 'classic',
        isSpinning: false,

        loadType(typeKey) {
            if(this.isSpinning) return;
            this.currentType = typeKey;
            const cfg = this.types[typeKey];

            // Магия с темным дубом для Мохеба
            if(typeKey === 'moheb') {
                document.body.classList.add('dark-oak-bg');
            } else {
                document.body.classList.remove('dark-oak-bg');
            }

            document.querySelectorAll('.btn-slot-type').forEach(b => b.classList.remove('active'));
            const typeBtn = document.getElementById(`type-${typeKey}`);
            if(typeBtn) typeBtn.classList.add('active');

            const container = document.getElementById('machine-container');
            container.className = `machine-body ${cfg.themeClass}`;
            document.getElementById('slot-title').innerText = cfg.name;
            
            document.getElementById('reel-1').innerHTML = cfg.symbols[Math.floor(Math.random() * cfg.symbols.length)];
            document.getElementById('reel-2').innerHTML = cfg.symbols[Math.floor(Math.random() * cfg.symbols.length)];
            document.getElementById('reel-3').innerHTML = cfg.symbols[Math.floor(Math.random() * cfg.symbols.length)];
            
            document.getElementById('slot-msg').innerText = "System gotowy do gry!";
            document.getElementById('slot-msg').style.color = "#fff";
        },

        spin() {
            if(this.isSpinning) return;
            const bet = parseInt(document.getElementById('slot-bet').value);
            if(bet > app.balance || bet < 10) return app.notify("Brak środków lub zła stawka!", "error");

            this.isSpinning = true;
            app.balance -= bet;
            app.updateUI();
            
            const cfg = this.types[this.currentType];
            const reels = [document.getElementById('reel-1'), document.getElementById('reel-2'), document.getElementById('reel-3')];
            reels.forEach(r => r.classList.add('spinning'));

            let count = 0;
            sfx.play('spin');

            const timer = setInterval(() => {
                reels.forEach(r => r.innerHTML = cfg.symbols[Math.floor(Math.random() * cfg.symbols.length)]);
                count++;
                
                if(count > 25) {
                    clearInterval(timer);
                    reels.forEach(r => r.classList.remove('spinning'));
                    this.checkResult(bet, cfg);
                }
            }, 60);
        },

        checkResult(bet, cfg) {
            const r = [document.getElementById('reel-1').innerHTML, document.getElementById('reel-2').innerHTML, document.getElementById('reel-3').innerHTML];
            let win = 0;
            const msg = document.getElementById('slot-msg');

            if(r[0] === r[1] && r[1] === r[2]) {
                win = r[0] === cfg.jackpot ? bet * cfg.mult : bet * 5;
                msg.innerHTML = `🔥 JACKPOT: +$${win} 🔥`;
                msg.style.color = "#00ff00";
                sfx.play('win');
                app.notify(`Niesamowite! Wygrałeś $${win} w automatach!`);
            } 
            else if(r[0] === r[1] || r[1] === r[2] || r[0] === r[2]) {
                win = Math.floor(bet * 1.5);
                msg.innerText = `Wygrana: +$${win}`;
                msg.style.color = "#00f2fe";
                sfx.play('win');
            } 
            else {
                msg.innerText = "Brak wygranej. Spróbuj ponownie.";
                msg.style.color = "#888";
                sfx.play('lose');
            }
            
            app.balance += win;
            this.isSpinning = false;
            app.updateUI();
        }
    },

    // 2. ПРОДВИНУТЫЙ БЛЭКДЖЕК
    bj: {
        suits: ['♥', '♦', '♣', '♠'],
        values: ['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
        deck: [], pCards: [], dCards: [],
        pScore: 0, dScore: 0, state: 'idle', bet: 0,

        buildDeck() {
            this.deck = [];
            for(let s of this.suits) {
                for(let v of this.values) {
                    let weight = parseInt(v);
                    if(v === 'J' || v === 'Q' || v === 'K') weight = 10;
                    if(v === 'A') weight = 11;
                    this.deck.push({ suit: s, value: v, weight: weight, color: (s==='♥'||s==='♦') ? 'card-red' : 'card-black' });
                }
            }
            this.deck.sort(() => Math.random() - 0.5);
        },

        drawCard() { return this.deck.pop(); },

        calcScore(cards) {
            let score = 0; let aces = 0;
            cards.forEach(c => { score += c.weight; if(c.value === 'A') aces++; });
            while(score > 21 && aces > 0) { score -= 10; aces--; } 
            return score;
        },

        renderCard(card, hidden = false) {
            if(hidden) return `<div class="bj-card card-hidden"></div>`;
            return `
                <div class="bj-card ${card.color}">
                    <div class="card-top">${card.value}</div>
                    <div class="card-center">${card.suit}</div>
                    <div class="card-bottom">${card.value}</div>
                </div>`;
        },

        start() {
            if(app.balance < 100) return app.notify("Min. zakład to 100$!", "error");
            this.bet = 100;
            app.balance -= this.bet;
            app.updateUI();
            
            this.buildDeck();
            this.state = 'playing';
            
            this.pCards = [this.drawCard(), this.drawCard()];
            this.dCards = [this.drawCard(), this.drawCard()]; 
            sfx.play('card');

            this.updateBoard();
            this.toggleBtns(true);

            if(this.calcScore(this.pCards) === 21) {
                this.stand(); 
            }
        },

        updateBoard(revealDealer = false) {
            this.pScore = this.calcScore(this.pCards);
            
            let pHTML = this.pCards.map(c => this.renderCard(c)).join('');
            document.getElementById('player-cards').innerHTML = pHTML;
            document.getElementById('player-score').innerText = this.pScore;

            let dHTML = '';
            if(revealDealer) {
                this.dScore = this.calcScore(this.dCards);
                dHTML = this.dCards.map(c => this.renderCard(c)).join('');
                document.getElementById('dealer-score').innerText = this.dScore;
            } else {
                dHTML = this.renderCard(this.dCards[0]) + this.renderCard(null, true);
                document.getElementById('dealer-score').innerText = this.dCards[0].weight;
            }
            document.getElementById('dealer-cards').innerHTML = dHTML;

            if(this.pScore > 21) this.endGame("Przegrałeś (Fura)", 0);
        },

        hit() {
            if(this.state !== 'playing') return;
            this.pCards.push(this.drawCard());
            sfx.play('card');
            this.updateBoard();
        },

        stand() {
            if(this.state !== 'playing') return;
            this.state = 'dealerTurn';
            this.toggleBtns(false);
            
            let dScore = this.calcScore(this.dCards);
            const dealerDraw = setInterval(() => {
                if(dScore < 17) {
                    this.dCards.push(this.drawCard());
                    dScore = this.calcScore(this.dCards);
                    sfx.play('card');
                    this.updateBoard(true);
                } else {
                    clearInterval(dealerDraw);
                    this.finalizeGame();
                }
            }, 800);
            
            this.updateBoard(true);
        },

        finalizeGame() {
            this.dScore = this.calcScore(this.dCards);
            if(this.dScore > 21 || this.pScore > this.dScore) {
                this.endGame("Wygrałeś!", this.bet * 2);
            } else if(this.pScore === this.dScore) {
                this.endGame("Remis (Zwrot)", this.bet);
            } else {
                this.endGame("Krupier wygrywa", 0);
            }
        },

        endGame(msg, payout) {
            this.state = 'idle';
            this.toggleBtns(false);
            if(payout > 0) {
                app.balance += payout;
                app.notify(`Blackjack: ${msg} (+${payout}$)`);
            } else {
                app.notify(`Blackjack: ${msg}`, "error");
            }
            app.updateUI();
        },

        toggleBtns(play) {
            document.getElementById('bj-hit').disabled = !play;
            document.getElementById('bj-stand').disabled = !play;
            document.getElementById('bj-start').disabled = play;
            document.getElementById('bj-start').innerText = play ? "Gra Trwa..." : "Nowa Gra (100$)";
        }
    }
};

window.onload = () => { app.init(); };
