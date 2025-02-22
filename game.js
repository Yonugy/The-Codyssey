import { Dialog } from './dialog.js';

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.collisionHappened = false
        this.touching="";
        this.inventory=[];
    }

    init(data) {
        // Receive game width & height from the constructor
        this.gameWidth = data.width;
        this.gameHeight = data.height;
    }

    preload() {
        this.load.image('bg', 'asset/walpaper.jpg');
        this.load.image('ben', 'asset/ben.jpg');
        this.load.image('bin', 'asset/trash_bin.png');
        this.load.image('apu', 'asset/apu_logo.png');
        this.load.image('toilet', 'asset/toilet.png');
    }

    create() {
        this.bg = this.physics.add.image(0, 0, 'bg');
        this.bg.setScale(2);

        this.bin = this.physics.add.sprite(100, -100, 'bin');
        this.bin.setScale(0.1);

        this.apu = this.physics.add.sprite(0, 200, 'apu');
        this.apu.setScale(0.5);

        this.toilet = this.physics.add.sprite(500, 0, 'toilet');
        this.toilet.setScale(0.5);

        this.npcList = [this.bin, this.apu, this.toilet];

        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'ben');
        this.player.setScale(0.2);

        this.npcStatus={'bin':0};

        this.talkButton = this.add.text(this.gameWidth/2+50, this.gameHeight/2-50, 'Talk to someone', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        })
        .setPadding(10)
        .setInteractive() // Make the text clickable
        .on('pointerdown', () => {
            this.talk();
        });
        this.talkButton.setVisible(false);

        this.physics.add.overlap(this.player, this.npcList, this.showTalk, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        let x = 0, y = 0;

        if (this.cursors.left.isDown) {
            x = 160;
        } else if (this.cursors.right.isDown) {
            x = -160;
        }

        if (this.cursors.up.isDown) {
            y = 160;
        } else if (this.cursors.down.isDown) {
            y = -160;
        }

        if (this.collisionHappened) {
            this.moveMap(0,0);
        }else{
            this.moveMap(x, y);
        }

        if (!this.physics.overlap(this.player, this.npcList)) {
            this.talkButton.setVisible(false);
        }


    }

    moveMap(x, y) {
        //add npc or game objects into the list to follow map to move
        let sprites=this.npcList.concat(this.bg);
        sprites.forEach(sprite => sprite.setVelocity(x, y));
    }

    talkToBin(){
        console.log('Talking to the bin...');
        if (this.npcStatus['bin']==0){
            this.chats={
                'Do you want to live in bin or marry bin?':{
                    'Live in bin':'Welcome home Ben, you definitely belong in the bin!',
                    "Marry bin":"Congrats on your marriage!"
                },
                'Please go get some help!':'',
                'Who will even want to live in bin or even marry the smelly bin.':'',
                'Ben is the first one that does it no cap no aura.':'',
                'Now go get the shit in the toilet.':''
            }
            this.dialog1 = new Dialog(this,this.chats);
            this.dialog1.showDialogs();
            this.npcStatus['bin']=1;

        }else if (this.npcStatus['bin']==1){
            this.chats={
                'Go get the shit in the toilet!':''
            }
            this.dialog1 = new Dialog(this,this.chats);
            this.dialog1.showDialogs();
        }
    }

    talkToApu(){
        console.log('Talking to the apu...');
        this.chats={
            'What do you want?':{
                'Trash':'Here you go! Trash taking trash!',
                "Shit":"Here you go! Shit taking shit!"
            }
        }
        this.dialog1 = new Dialog(this,this.chats);
        this.dialog1.showDialogs();
    }

    talkToToilet(){
        console.log('Talking to the toilet...');
        this.chats={
            'Skibidi skibidi toilet!':'',
            'What is your problem?':{
                "Give Shit":"HUUUURGGEHH"
            },
            "What the sigma?":""
        }
        this.dialog1 = new Dialog(this,this.chats);
        this.dialog1.showDialogs();
    }

    talk() {
        this.talkButton.setVisible(false);
        this.collisionHappened = true;
        if (this.touching=="bin"){
            this.talkToBin();
        }else if (this.touching=="apu"){
            this.talkToApu();
        }else if (this.touching=="toilet"){
            this.talkToToilet();
        }
    }

    showTalk(player, object) {
        if (!this.collisionHappened) {
            if (object === this.bin) {
                this.talkButton.setText('Talk to Bin');
                this.touching='bin';
            }else if (object === this.apu) {
                this.talkButton.setText('Talk to APU');
                this.touching='apu';
            }else if (object === this.toilet) {
                this.talkButton.setText('Talk to Toilet');
                this.touching='toilet';
            }
            this.talkButton.setVisible(true);
        }
    }
}

class Game {
    constructor(gameWidth, gameHeight) {
        this.config = {
            type: Phaser.AUTO,
            width: gameWidth,
            height: gameHeight,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [MainScene]
        };

        this.game = new Phaser.Game(this.config);

        // Start the MainScene and pass gameWidth & gameHeight
        this.game.scene.start('MainScene', { width: gameWidth, height: gameHeight });
    }
}

// Create the game object with dynamic width & height
const myGame = new Game(1500, 700);

