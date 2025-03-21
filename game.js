import { Dialog } from './dialog.js';
import { Npc } from './npc.js';
import { Backdrop } from './backdrop.js';
import { Door } from './door.js';
import { IndoorScene } from './indoorScene.js';



class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.collisionHappened = false
        this.touching="";
        this.inventory=[];
        this.fulfill=[]
        this.npc={};
        this.backdrop={};
        this.door={};
        this.player_direction=-1;
        this.current_bg;
        this.gameposx=140;
        this.gameposy=260;
        this.movementSpeed=200;
    }

    init(data) {
        // Receive game width & height from the constructor
        this.gameWidth = data.width;
        this.gameHeight = data.height;
        this.dialogue = data.dialogue || {};
        this.quest = data.quest || {};
    }

    preload() { //update on new npc
        this.cameras.main.setBackgroundColor('#E98B45');
        this.load.image('town_bg', 'asset/town_map.jpg');
        this.load.image('town_obstacle', 'asset/town_map_obstacle.png');
        this.load.image('house1_bg', 'asset/town_map.jpg');
        this.load.image('ben', 'asset/ben.jpg');
        this.load.image('bin', 'asset/trash_bin.png');
        this.load.image('apu', 'asset/apu_logo.png');
        this.load.image('toilet', 'asset/toilet.png');
        this.load.spritesheet('cat', 'asset/cat-sheet.png', {
            frameWidth: 247.5,  // Adjust based on your sprite sheet
            frameHeight: 247.5
        });
        this.load.spritesheet('fighter', 'asset/fighter_walk_idle.png', {
            frameWidth: 128.25,  // Adjust based on your sprite sheet
            frameHeight: 130
        });
        this.load.image("houseInterior", "asset/house1_interior.png");
    }

    create() { //update on new npc'
        //import background
        // this.backdrop['town_map'] = this.physics.add.image(0, 0, 'town_bg').setScale(2);
        // this.current_bg=this.backdrop['town_map'];
        this.backdrop['town_map'] = new Backdrop(this, 0, 0, 'town_bg', 2);
        this.current_bg=this.backdrop['town_map'];

        //import npc
        this.npc['bin'] = new Npc(this, 390, 400, 'bin', 0.1);

        this.npc['apu'] = new Npc(this, 670, 440, 'apu', 0.5);

        this.npc['toilet'] = new Npc(this, 980, 330, 'toilet', 0.5);

        this.anims.create({
            key: 'cat_turn',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 93 }),
            frameRate: 60, // Adjust speed (frames per second)
            repeat: 1 // -1 = Loop infinitely
        });

        this.npc['cat'] = new Npc(this, 330, 580, 'cat', 0.7);
        this.npc['cat'].setFrame(0);

        //player (fighter)
        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'fighter');
        // this.player.setScale(0.2);

        this.anims.create({
            key: 'fighter_left',
            frames: this.anims.generateFrameNumbers('fighter', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'fighter_right',
            frames: this.anims.generateFrameNumbers('fighter', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'fighter_left_idle',
            frames: this.anims.generateFrameNumbers('fighter', { start: 16, end: 21 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'fighter_right_idle',
            frames: this.anims.generateFrameNumbers('fighter', { start: 24, end: 29 }),
            frameRate: 10,
            repeat: -1
        });

        //background obstacle
        this.backdrop['town_obstacle'] = new Backdrop(this, 0, 0, 'town_obstacle', 2);

        //house collision area
        this.door['house1'] = new Door(this, 369, 240, 409, 292, '#000', 'Beh House'); //add argument behind for opacity

        this.npcStatus={'bin':0, "apu":0, "toilet":0, "cat":0}; //update on new npc

        //Talk to npc button
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

        //Enter house button
        this.enterButton = this.add.text(this.gameWidth/2+50, this.gameHeight/2-50, 'Enter house', {
            fontSize: '24px',
            fill: '#ffffff',
            backgroundColor: '#000000'
        })
        .setPadding(10)
        .setInteractive() // Make the text clickable
        .on('pointerdown', () => {
            this.enterDoor();
        });
        this.enterButton.setVisible(false);

        this.npcList = Object.values(this.npc);
        this.physics.add.overlap(this.player, this.npcList, this.showTalk, null, this);
        this.doorList = Object.values(this.door);
        this.physics.add.overlap(this.player, this.doorList, this.showEnter, null, this);

        //set initial quest and subquest in the beginning
        this.activeQuest = this.quest.init;
        this.activeSubQuest = this.quest[this.activeQuest].startquest;
        console.log(this.activeQuest)
        console.log(this.activeSubQuest);
        console.log(this.quest[this.activeQuest].subquest[this.activeSubQuest]);

        this.setGamePos(140,260);

    }

    update() {
        let x = 0, y = 0;

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Left movement
        if ((this.cursors.left.isDown || this.keys.A.isDown) && this.current_bg.x<this.gameWidth/2-this.player.displayWidth/2) {
            x = this.movementSpeed;
            this.player_direction=1;
        } else if ((this.cursors.right.isDown || this.keys.D.isDown) && this.current_bg.displayWidth+this.current_bg.x>this.gameWidth/2+this.player.displayWidth/2) {
            x = -this.movementSpeed;
            this.player_direction=-1;
        }

        // Up/down movement
        if ((this.cursors.up.isDown || this.keys.W.isDown) && this.current_bg.y<this.gameHeight/2-this.player.displayHeight/2) {
            y = this.movementSpeed;
        } else if ((this.cursors.down.isDown || this.keys.S.isDown) && this.current_bg.displayHeight+this.current_bg.y>this.gameHeight/2+this.player.displayHeight/2) {
            y = -this.movementSpeed;
        }

        if (this.collisionHappened) {
            this.moveMap(0,0);
        }else{
            if (x==0 && y==0) {
                if (this.player_direction==1) {
                    this.player.anims.play('fighter_left_idle', true);
                }else if (this.player_direction==-1){
                    this.player.anims.play('fighter_right_idle', true);
                }
            }else{
                if (this.player_direction==1) {
                    this.player.anims.play('fighter_left', true);
                }else if (this.player_direction==-1){
                    this.player.anims.play('fighter_right', true);
                }
            }

            this.moveMap(x, y);
        }

        if (!this.physics.overlap(this.player, this.npcList)) {
            this.talkButton.setVisible(false);
        }

        if (!this.physics.overlap(this.player, this.doorList)) {
            this.enterButton.setVisible(false);
        }
    }

    moveMap(x, y) {
        //add npc or game objects into the list to follow map to move
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.door));
        sprites.forEach(sprite => sprite.setVelocity(x, y));
    }

    setGamePos(x, y) {
        //add npc or game objects into the list to follow map to move
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.door));
        sprites.forEach(sprite => sprite.setMapPos(x, y));
    }

    talk() { //update on new npc
        this.talkButton.setVisible(false);
        this.collisionHappened = true;
        console.log(`Talking to the ${this.touching}...`);
        let chats=this.dialogue[this.touching][this.activeSubQuest];
        console.log(chats);
        this.dialog1 = new Dialog(this,chats);
        this.dialog1.showDialogs();
    }

    enterDoor() { //update on new npc
        this.enterButton.setVisible(false);
        // this.collisionHappened = true;
        console.log(`Entering ${this.touching}...`);
        this.startIndoor(this.touching);
    }

    showTalk(player, object) { //update on new npc
        if (!this.collisionHappened) {
            this.touching=object.name;
            if (this.dialogue[this.touching][this.activeSubQuest]){
                let npcName=object.name.charAt(0).toUpperCase() + object.name.slice(1);
                this.talkButton.setText(`Talk to ${npcName}`);
                this.talkButton.setVisible(true);
            }else{
                this.talkButton.setVisible(false);
            }
        }
    }

    showEnter(player, object) { //update on new npc
        if (!this.collisionHappened) {
            this.touching=object.name;
            let npcName=object.name.charAt(0).toUpperCase() + object.name.slice(1);
            this.enterButton.setText(`Enter ${npcName}`);
            this.enterButton.setVisible(true);
        }
    }

    startIndoor(houseName) {
        // this.scene.pause("MainScene");
        // this.cameras.main.fadeOut(2000);
        this.scene.switch('IndoorScene', {
            width: this.gameWidth,
            height: this.gameHeight,
            houseName:houseName,
        });
    }
}

class Game {
    constructor(gameWidth, gameHeight) {
        this.dialogue = {}; // Store dialogues from API
        this.quest = {};
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.fetchData().then(() => {
            this.startGame(); // Start game only after fetching data
        });
    }

    async fetchData() {
        try {
            const response1 = await fetch('https://data-bank-delta.vercel.app/');
            const response2 = await fetch('https://data-bank-delta.vercel.app/quest');
            const data1 = await response1.json();
            const data2 = await response2.json();
            this.dialogue = data1;  // Store API data
            this.quest = data2;
            console.log("Fetched data 1:", data1);
            console.log("Fetched data 2:", data2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    startGame() {
        this.config = {
            type: Phaser.AUTO,
            width: this.gameWidth,
            height: this.gameHeight,
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false }
            },
            scene: [MainScene,IndoorScene]
        };

        this.game = new Phaser.Game(this.config);

        // Start MainScene and pass gameWidth, gameHeight, and dialogues
        this.game.scene.start('MainScene', {
            width: this.gameWidth,
            height: this.gameHeight,
            dialogue: this.dialogue,
            quest: this.quest
        });
    }
}


// Create the game object with dynamic width & height
const myGame = new Game(1500, 700);

