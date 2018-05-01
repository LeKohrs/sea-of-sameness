<template>
    <div class="controller">
        <section class="games">
            <ul>
                <li v-for="(game, index) in games.game" @click="selectedGameButton" :class="game.buttonClass" class="controller-button" :key="`${index}`">
                    <p>
                        {{game.text}}
                    </p>
                </li>
            </ul>
        </section>
        <section class="controls">
            <div class="controls__screen-states">
                <h2>Screen States</h2>
                <ul>
                    <li v-for="(state, index) in controls.states" @click="selectedButton" :class="state.buttonClass" class="controller-button" :key="`${index}`">
                        <p>
                            {{state.text}}
                        </p>
                    </li>
                </ul>
            </div>
            <div class="controls__catagories">
                <h2>Get Catagory</h2>
                <ul>
                    <li v-for="(catagory, index) in controls.catagories" @click="playGame" :class="catagory.buttonClass" class="controller-button" :key="`${index}`">
                        <p>
                            {{catagory.text}}
                        </p>
                    </li>
                </ul>
            </div>
            <div class="controls__active-puzzle">
                <h2>Active Puzzle</h2>
                <ul>
                    <li v-for="(control, index) in controls.controls" @click="selectedButton" :class="control.buttonClass" class="controller-button" :key="`${index}`">
                        <p>
                            {{control.text}}
                        </p>
                    </li>
                </ul>
            </div>
            <div class="controls__current-word hide">
                <h2>Current Word</h2>
                <div class="catagory-container">
                    <p class="catagory-title">
                        Category:
                    </p>
                    <p class="word-catagory"></p>
                </div>
                <div class="word-container">
                    <p class="catagory-title">
                        Word:
                    </p>
                    <p class="selected-word"></p>
                </div>
                <div class="controller-timer">
                    <p>Time left: 12</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    export default {
        name: 'Controls',
        data() {
            return {
                controls: {
                    states: [
                        {
                            text: 'Screen Saver',
                            buttonClass: 'button--screen-saver deactivate'
                        },
                        {
                            text: 'Game Mode',
                            buttonClass: 'button--game'

                        }
                    ],
                    catagories: [
                        {
                            text: 'Play Game',
                            buttonClass: 'button--play'
                        }
                    ],
                    controls: [
                        {
                            text: 'Correct',
                            buttonClass: 'button--correct'
                        }
                    ]
                },
                games: {
                    game: [
                        {
                            text: 'Open Game',
                            buttonClass: 'button--sea-of-sameness'
                        }
                    ]
                },
                phrases: {
                    catagories: {
                        graphicElements: ["Dove","Cross","Heart","Hands","Band-Aid","Lab coat","stethoscope","scrubs","surgical mask","ekg monitor","syringe","medicine","test tube","chart","ribbon","thermometer","lungs","brain","iv bag","bone"],
                        photography: ["arms crossed","consultation","wheel chair","window gazing","comforting patient","gurney","x-ray","surgical mask","life flight","surgery","doctors walking","hand on shoulder","hug","camera aware","testimonial portrait","mri","teddy bear","balloons","flowers","stethoscope","lab work","scrubbing in","physical therapy","cpr","defibrillation"],
                        messaging: ["compassion","trust","expertise","healing","confidence","care","innovation","technology","leadership","state-of-the-art","close to home","commitment","we are passionate","we care","we are about healing","community","family of healing","legacy of excellence","passion for healing","advanced medicine"]
                    }
                },
                pieId: '0',
                pieCounter: 0,
                inPlay: false,
                lockWord: false,
                lockedId: '0',
                playingGame: false
            }
        },
        created: function() {
            let self = this;
            this.$root.usedMessageWords = [];
            this.$root.usedPhotographyWords = [];
            this.$root.usedElementWords = [];
            this.$root.controlTimerInterval;

            var socket = io('http://10.242.149.187:3000/');
            console.log(this.playingGame)
            socket.on('tagid', function(id) {
                self.pieId = id;
                console.log(self.inPlay)
                console.log(self.lockedId)
                console.log(self.pieId)
                console.log(self.lockWord)
                
                if(self.lockedId !== self.pieId && self.playingGame) {
                    self.lockWord = false
                    self.inPlay = true
                }

                if(self.inPlay && !self.lockWord && self.playingGame) {
                    if(self.pieCounter === 10) {
                        self.inPlay = false 
                        self.pieCounter = 0
                        self.lockWord = true
                        self.lockedId = self.pieId
                        self.selectCatagory(self.pieId)  
                    } else {
                        console.log('wait for it')
                        self.pieCounter++
                    }
                }
            });

            window.addEventListener('message',function(event) {
                let correctButton = document.getElementsByClassName('button--correct')[0];

                if(event.data === "count down complete") {
                    correctButton.classList.remove('deactivate');
                    correctButton.classList.remove('locked');
                }
                self.startControlTimer();
            });
        },
        methods: {
            startControlTimer: function() {
                let self = this;
                let controlTimer = document.getElementsByClassName('controller-timer')[0];
                let timerp = controlTimer.getElementsByTagName('p')[0];
                let second = '12';

                this.$root.controlTimerInterval = setInterval(function() {
                    if(second > 0) {
                        second--;
                        timerp.innerHTML = 'Time left: ' + second;
                    }
                    else {
                        self.stopControlTimer();
                    }
                }, 1000);
            },
            stopControlTimer: function() {
                let self = this;
                clearInterval(self.$root.controlTimerInterval);
            },
            playGame: function() {
               this.playingGame = true
               console.log(this.playingGame)
            },
            selectedButton: function(event) {
                var controlPanel = document.getElementsByClassName('controls')[0];
                var controls = controlPanel.getElementsByClassName('controller-button');

                for(let x of controls) {
                    x.classList.remove("active");
                }
                event.currentTarget.classList.add("active");
                var that = event.currentTarget;
                checkStates(that);
                this.selectCatagory(that);
                this.correctAnswer(that);
                this.screenSaver(that);
                this.game(that);

                function checkStates(e) {
                    var controlPanel = document.getElementsByClassName('controls')[0];
                    let controls = controlPanel.getElementsByClassName('controller-button');

                    if(e.classList.contains('button--screen-saver')) {
                        e.classList.remove('deactivate');
                        for(let l of controls) {
                            if(l != e){
                                l.classList.add("deactivate");
                            }
                            if(l.classList.contains('button--game')) {
                            }
                            else {
                                l.classList.add('locked');
                            }
                        }
                    }
                    else if(e.classList.contains('button--game')) {
                        let screenSaverButton = controlPanel.getElementsByClassName('button--screen-saver')[0];
                        for(let l of controls) {
                            if(l.classList.contains('button--correct')) {

                            }
                            else {
                                l.classList.remove("deactivate");
                                l.classList.remove('locked');
                            }
                        }
                        screenSaverButton.classList.add("deactivate");
                    }
                }
            },
            selectedGameButton: function(event) {
                var gamePanel = document.getElementsByClassName('games')[0];
                var controls = gamePanel.getElementsByClassName('controller-button');

                for(let x of controls) {
                    x.classList.remove("active");
                    x.classList.add("deactivate");
                }
                event.currentTarget.classList.add("active");
                event.currentTarget.classList.remove("deactivate");

                this.openWindow();
            },
            openWindow: function(e) {
                var controlPanel = document.getElementsByClassName('controls')[0];
                let controls = controlPanel.getElementsByClassName('controller-button');
                let currentWord = controlPanel.getElementsByClassName('controls__current-word')[0];

                this.controllerRestart();
                this.$root.gameWindow = window.open(window.location.origin + '/game', 'gameWindow', 'resizable,scrollbars=no,status=no,menubar=no,titlebar=no');
                let screenSaverButton = controlPanel.getElementsByClassName('button--screen-saver')[0];
                for(let l of controls) {
                    l.classList.remove("deactivate");
                    l.classList.remove('locked');
                    l.classList.remove('active');
                }
                screenSaverButton.classList.add("deactivate");
                currentWord.classList.add("hide");
            },
            selectCatagory: function(e) {
                let self = this;
                let words;
                var word;
                let selectedWord = document.getElementsByClassName('selected-word')[0];
                let wordCatagory = document.getElementsByClassName('word-catagory')[0];
                let currentWord = document.getElementsByClassName('controls__current-word')[0];
                let correctButton = document.getElementsByClassName('button--correct')[0];

                if (e === '136436197109' || e === '1364813915' || e === '13642177212' || e === '1364217239186' || e === '1364222208130' || e === '1364135161170') {
                    self.controllerRestart();
                    wordCheck();

                    if(self.$root.usedMessageWords.length > 18) {
                        self.$root.usedMessageWords = [];
                    }
                    self.$root.usedMessageWords.push(word);
                    var message = {
                        type: "messaging",
                        word: word,
                    }
                    selectedWord.innerHTML = self.toTitleCase(message.word);
                    wordCatagory.innerHTML = self.toTitleCase(message.type);
                    currentWord.classList.remove('hide');
                    self.$root.gameWindow.postMessage(message, window.location.origin + "/game");
                    correctButton.classList.add('deactivate');
                    correctButton.classList.add('locked');

                    function wordCheck() {
                        getWord();
                        for(let usedWord of self.$root.usedMessageWords) {
                            if(word === usedWord) {
                                wordCheck();
                            }
                        }
                    }

                    function getWord() {
                        words = self.phrases.catagories.messaging;
                        word = words[Math.floor(Math.random()*words.length)];
                    }
                }
                else if(e === '13648245243' || e === '136482126160' || e === '136453124197' || e === '136434198104') {
                    self.controllerRestart();
                    wordCheck();

                    if(self.$root.usedPhotographyWords.length > 23) {
                        self.$root.usedPhotographyWords = [];
                    }
                    self.$root.usedPhotographyWords.push(word);
                    var message = {
                        type: "photography",
                        word: word,
                    }
                    selectedWord.innerHTML = self.toTitleCase(message.word);
                    wordCatagory.innerHTML = self.toTitleCase(message.type);
                    currentWord.classList.remove('hide');
                    self.$root.gameWindow.postMessage(message, window.location.origin + "/game");
                    correctButton.classList.add('deactivate');
                    correctButton.classList.add('locked');

                    function wordCheck() {
                        getWord();
                        for(let usedWord of self.$root.usedPhotographyWords) {
                            if(word === usedWord) {
                                wordCheck();
                            }
                        }
                    }
                    function getWord() {
                        words = self.phrases.catagories.photography;
                        word = words[Math.floor(Math.random()*words.length)];
                    }
                }
                else if(e === '13641654924' || e === '13647442236' || e === '487114163218' || e === '136410242192') {
                    self.controllerRestart();
                    wordCheck();

                    if(self.$root.usedElementWords.length > 18) {
                        self.$root.usedElementWords = [];
                    }
                    self.$root.usedElementWords.push(word);
                    var message = {
                        type: "graphic elements",
                        word: word,
                    }
                    selectedWord.innerHTML = self.toTitleCase(message.word);
                    wordCatagory.innerHTML = self.toTitleCase(message.type);
                    currentWord.classList.remove('hide');
                    self.$root.gameWindow.postMessage(message, window.location.origin + "/game");
                    correctButton.classList.add('deactivate');
                    correctButton.classList.add('locked');

                    function wordCheck() {
                        getWord();
                        for(let usedWord of self.$root.usedElementWords) {
                            if(word === usedWord) {
                                wordCheck();
                            }
                        }
                    }
                    function getWord() {
                        words = self.phrases.catagories.graphicElements;
                        word = words[Math.floor(Math.random()*words.length)];
                    }
                }
            },
            toTitleCase: function(str) {
                return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
            },
            correctAnswer: function(e) {
                let self = this;
                if(e.classList.contains('button--correct')) {
                    this.$root.gameWindow.postMessage("correct", window.location.origin + "/game");
                    self.stopControlTimer();
                }
            },
            screenSaver: function(e) {
                let self = this;
                const currentWord = document.getElementsByClassName('controls__current-word')[0];

                if(e.classList.contains('button--screen-saver')) {
                    self.controllerRestart();
                    this.$root.gameWindow.postMessage("saver", window.location.origin + "/game");
                    currentWord.classList.add('hide');
                }
            },
            game: function(e) {
                let self = this;
                let currentWord = document.getElementsByClassName('controls__current-word')[0];

                if(e.classList.contains('button--game')) {
                    self.controllerRestart();
                    this.$root.gameWindow.postMessage("game", window.location.origin + "/game");
                    currentWord.classList.add("hide");
                }
            },
            controllerRestart: function() {
                let self = this;
                let currentWord = document.getElementsByClassName('controls__current-word')[0];

                if(currentWord.classList.contains('hide')) {

                }
                else {
                    let controlTimer = document.getElementsByClassName('controller-timer')[0];
                    let timerp = controlTimer.getElementsByTagName('p')[0];

                    self.stopControlTimer();
                    timerp.innerHTML = 'Time left: 12';
                }
            }
        }
    }
</script>
<style lang="scss" scope>
    $site-orange: #FBC27E;
    $site-orange-dark: #E89A4B;
    $site-orange-light: #FCC37D;
    $site-white: #FFFFFF;
    $site-gray: #58595B;

    $t: .3s;

    @font-face {
        font-family:'DIN Black';
        src: url('/src/assets/font/DIN Black.eot');
        src: url('/src/assets/font/DIN Black.eot?#iefix') format('embedded-opentype'),
            url('/src/assets/font/DIN Black.woff2') format('woff2'),
            url('/src/assets/font/DIN Black.woff') format('woff'),
            url('/src/assets/font/DIN Black.svg#DIN Black') format('svg');
        font-weight: 900;
        font-style: normal;
        font-stretch: normal;
        unicode-range: U+0020-02DC;
    }

    .controller {
        margin: 30px;
    }
    .games,
    .controls {
        display: flex;
        justify-content: flex-start;
        flex-wrap: no-wrap;
        width: 200px;
        font-family: "DIN Alternate", sans-serif;


        h2 {
            margin: 35px auto 20px;
            font-size: 20px;
        }
        ul {
            margin-right: 30px;
            padding-left: 0;
        }
        .game,
        .controller-button {
            margin-bottom: 10px;
            width: 200px;
            height: 100px;
            background: radial-gradient(ellipse, $site-orange-light , $site-orange, $site-orange-dark );
            border-radius: 20px;
            list-style: none;
            cursor: pointer;
            transition: $t;

            &:hover {
                transform: scale(1.1);
            }

            &.deactivate {
                background: $site-gray;
                color: $site-white;
            }
            &.locked {
                pointer-events: none;
            }

            p {
                padding: 40px 35px;
                text-align: center;
                font-size: 16px;
            }
        }
        .button--messaging,
        .button--photography,
        .button--elements {
            &.active {
                background: $site-orange-dark;
                color: $site-white;
            }
        }
    }
    .controls {
        .controls__current-word {
            h2 {
                width: 200px;
            }
            p {
                margin-right: 5px;
                margin-bottom: 10px;
                font-size: 16px;

                &.selected-word,
                &.word-catagory {
                    color: $site-orange-dark;
                }
            }

            .catagory-container,
            .word-container {
                display: flex;
                flex-wrap: no-wrap;
                justify-content: flex-start;
            }
        }
    }
</style>