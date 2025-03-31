import { Dialog } from './dialog.js';
import { Npc } from './npc.js';
import { Backdrop } from './backdrop.js';
import { Door } from './door.js';
import { IndoorScene } from './indoorScene.js';



class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.collisionHappened = false
        this.touching;
        this.inventory=[];
        this.fulfill=[]
        this.npc={};
        this.backdrop={};
        this.doors={};
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
        this.sceneName = data.sceneName; //town (default scene)
        this.dialogue = data.dialogue || {};
        this.quest = data.quest || {};
        this.alldoor = data.door || {};
        this.indoor = data.indoor || {};
        this.allnpc = data.npc || {};
    }

    preload() { //update on new npc
        this.cameras.main.setBackgroundColor('#E98B45');
        this.load.image('town_bg', 'asset/town_map.jpg');
        this.load.image('town_obstacle', 'asset/town_map_obstacle.png');
        this.load.image('house1_bg', 'asset/town_map.jpg');
        // this.load.image('ben', 'asset/ben.jpg');
        // this.load.image('bin', 'asset/trash_bin.png');
        // this.load.image('apu', 'asset/apu_logo.png');
        // this.load.image('toilet', 'asset/toilet.png');
        // this.load.spritesheet('cat', 'asset/cat-sheet.png', {
        //     frameWidth: 247.5,  // Adjust based on your sprite sheet
        //     frameHeight: 247.5
        // });
        this.load.spritesheet('fighter', 'asset/fighter_walk_idle.png', {
            frameWidth: 128.25,  // Adjust based on your sprite sheet
            frameHeight: 130
        });
        this.load.image("house1_interior", "asset/house1_interior.png");
        this.load.image("ownhouse_interior", "asset/ownhouse_interior.jpg");

        for (let [tag,npc] of Object.entries(this.allnpc)){
            if (npc.type === "image") {
                this.load.image(tag, `asset/${npc.img}`);
            }else if (npc.type === "spritesheet"){
                console.log(tag);
                this.load.spritesheet(tag, `asset/${npc.img}`, {
                    frameWidth: npc.frameSize.width,
                    frameHeight: npc.frameSize.height
                });
                // for (let [key,anim] of Object.entries(npc.animation)){
                //     this.anims.create({
                //         key: key,
                //         frames: this.anims.generateFrameNumbers(tag, { start: anim.startFrame, end: anim.endFrame }),
                //         frameRate: anim.frameRate, // Adjust speed (frames per second)
                //         repeat: anim.repeat // -1 = Loop infinitely
                //     });
                // }
            }
        }

        // for (let [tag,npc] of Object.entries(this.allnpc)){
        //     if (npc.animation){
        //         for (let [key,anim] of Object.entries(npc.animation)){
        //             this.anims.create({
        //                 key: key,
        //                 frames: this.anims.generateFrameNumbers(tag, { start: anim.startFrame, end: anim.endFrame }),
        //                 frameRate: anim.frameRate, // Adjust speed (frames per second)
        //                 repeat: anim.repeat // -1 = Loop infinitely
        //             });
        //         }
        //     }
        // }
    }

    create() {
        //set initial quest and subquest in the beginning
        // this.activeQuest = this.quest.init;
        // this.activeSubQuest = this.quest[this.activeQuest].startquest;
        // console.log(this.activeQuest)
        // console.log(this.activeSubQuest);
        // console.log(this.quest[this.activeQuest].subquest[this.activeSubQuest]);

        //use registry to store data across all scenes
        let activeQuest = this.quest.init;
        let activeSubQuest = this.quest[activeQuest].startquest;
        this.registry.set("activeQuest", activeQuest);
        this.registry.set("activeSubQuest", activeSubQuest);
        this.registry.set("inventory", this.inventory);
        this.registry.set("fulfill", this.fulfill);

        //import background
        this.backdrop['town_map'] = new Backdrop(this, 0, 0, 'town_bg', 2);
        this.current_bg=this.backdrop['town_map'];

        //import npc
        this.spawnNpc();
        // let questNpcData = this.quest[this.activeQuest].subquest[this.activeSubQuest].npc; //list of quest data
        // for (let [tag,npc] of Object.entries(this.allnpc)){
        //     if (questNpcData[tag]){
        //         let npcPos = questNpcData[tag].position; //position of the npc
        //         this.npc[tag] = new Npc(this, npcPos.x, npcPos.y, tag, npc.name, npc.scale);
        //         console.log(tag,this.npc[tag].mapPosx, this.npc[tag].mapPosy);
        //         if (npc.animation){
        //             for (let [key,anim] of Object.entries(npc.animation)){
        //                 this.anims.create({
        //                     key: key,
        //                     frames: this.anims.generateFrameNumbers(tag, { start: anim.startFrame, end: anim.endFrame }),
        //                     frameRate: anim.frameRate, // Adjust speed (frames per second)
        //                     repeat: anim.repeat // -1 = Loop infinitely
        //                 });
        //             }
        //             this.npc[tag].setFrame(npc.initialFrame);
        //         }
        //     }
        // }

        // this.npc['bin'] = new Npc(this, 390, 400, 'bin', 0.1);

        // this.npc['apu'] = new Npc(this, 670, 440, 'apu', 0.5);

        // this.npc['toilet'] = new Npc(this, 980, 330, 'toilet', 0.5);

        // this.anims.create({
        //     key: 'cat_turn',
        //     frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 93 }),
        //     frameRate: 60, // Adjust speed (frames per second)
        //     repeat: 1 // -1 = Loop infinitely
        // });

        // this.npc['cat'] = new Npc(this, 330, 580, 'cat', 0.7);
        // this.npc['cat'].setFrame(0);

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

        //house collision area (door)
        // this.door['house1'] = new Door(this, 369, 240, 409, 292, '#000', 'Beh House'); //add argument behind for opacity
        let doorData = this.alldoor[this.sceneName] //list of door of the current scene
        for (let door of doorData){ //dictionary contains info of a door
            if (door.to){ //not an exit (exit dont have "to")
                let indoorDetail = this.indoor[door.to]; //target indoor detail
                let label = indoorDetail.label; //indoor label for action text
                let doorPos = door.position; //all 4 positions (x1,y1,x2,y2) of doors
                this.doors[door.to] = new Door(this, doorPos.x1, doorPos.y1, doorPos.x2, doorPos.y2, '#000', label, door.to); //create a door object
            }
        }

        //background obstacle
        this.backdrop['town_obstacle'] = new Backdrop(this, 0, 0, 'town_obstacle', 2);

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

        //Collision listener
        this.npcList = Object.values(this.npc);
        this.physics.add.overlap(this.player, this.npcList, this.showTalk, null, this);
        this.doorList = Object.values(this.doors);
        this.physics.add.overlap(this.player, this.doorList, this.showEnter, null, this);

        //Initial position of the player
        this.setGamePos(140,260);

        this.events.on("wake", () => {
            console.log("MainScene Resumed");
            console.log(this.registry.get("activeQuest"));
            console.log(this.registry.get("activeSubQuest"));
            if (this.npcList.length==0 ){
                this.spawnNpc();
                this.setGamePos(this.MapPosx,this.MapPosy);
                console.log(this.MapPosx);
            }
        });
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

    spawnNpc(){
        //import npc
        let activeQuest = this.registry.get("activeQuest");
        let activeSubQuest = this.registry.get("activeSubQuest");
        let questNpcData = this.quest[activeQuest].subquest[activeSubQuest].npc; //list of quest data
        if (this.quest[activeQuest].subquest[activeSubQuest].location != this.sceneName){
            return;
        }
        for (let [tag,npc] of Object.entries(this.allnpc)){
            if (questNpcData[tag]){
                let npcPos = questNpcData[tag].position; //position of the npc
                this.npc[tag] = new Npc(this, npcPos.x, npcPos.y, tag, npc.name, npc.scale);
                console.log(tag,this.npc[tag].mapPosx, this.npc[tag].mapPosy);
                if (npc.animation){
                    for (let [key,anim] of Object.entries(npc.animation)){
                        if (!this.anims.exists(key)){
                            this.anims.create({
                                key: key,
                                frames: this.anims.generateFrameNumbers(tag, { start: anim.startFrame, end: anim.endFrame }),
                                frameRate: anim.frameRate, // Adjust speed (frames per second)
                                repeat: anim.repeat // -1 = Loop infinitely
                            });
                        }
                    }
                    this.npc[tag].setFrame(npc.initialFrame);
                }
            }
        }
    }

    moveMap(x, y) {
        //add npc or game objects into the list to follow map to move
        this.npcList = Object.values(this.npc);
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.doors));
        sprites.forEach(sprite => sprite.setVelocity(x, y));
    }

    setGamePos(x, y) {
        //add npc or game objects into the list to follow map to move
        this.npcList = Object.values(this.npc);
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.doors));
        sprites.forEach(sprite => sprite.setMapPos(x, y));
    }

    talk() { //update on new npc
        this.talkButton.setVisible(false);
        this.collisionHappened = true;
        let object = this.touching;
        console.log(`Talking to the ${object.name}...`);
        let activeSubQuest = this.registry.get("activeSubQuest");
        let chats=this.dialogue[object.tag][activeSubQuest];
        console.log(chats);
        this.dialog1 = new Dialog(this,chats);
        this.dialog1.showDialogs();
    }

    enterDoor() {
        this.enterButton.setVisible(false);
        let objectName = this.touching.label;
        let activeQuest = this.registry.get("activeQuest");
        let activeSubQuest = this.registry.get("activeSubQuest");
        console.log(`Entering ${objectName}...`);

        //remove all npcs in the current scene
        let questDetail = this.quest[activeQuest].subquest[activeSubQuest]; //list of quest data
        if (questDetail.location != this.sceneName){
            for (let npc of Object.values(this.npc)){
                npc.destroy();
            }
            this.npc={};
            this.npcList = [];
        }

        //save current map position
        this.MapPosx = this.current_bg.getMapPos().x;
        this.MapPosy = this.current_bg.getMapPos().y;
        console.log(this.MapPosx);
        console.log(this.MapPosy);

        //switch to indoor scene without pausing or shutdown MainScene
        this.scene.switch('IndoorScene', {
            width: this.gameWidth,
            height: this.gameHeight,
            dialogue: this.dialogue,
            quest: this.quest,
            npc: this.allnpc,
            indoorData: this.indoor,
            doorData: this.alldoor,
            sceneName: this.touching.target,
        });
    }

    showTalk(player, object) {
        if (!this.collisionHappened) {
            this.touching=object;
            let activeQuest = this.registry.get("activeQuest");
            let activeSubQuest = this.registry.get("activeSubQuest");
            if (this.dialogue[object.tag][activeSubQuest] && this.quest[activeQuest].subquest[activeSubQuest].location == this.sceneName){
                this.talkButton.setText(`Talk to ${object.name}`);
                this.talkButton.setVisible(true);
            }else{
                this.talkButton.setVisible(false);
            }
        }
    }

    showEnter(player, object) {
        if (!this.collisionHappened) {
            this.touching=object; //door.name (Your House etc)
            let objectName = object.label;
            this.enterButton.setText(`Enter ${objectName}`);
            this.enterButton.setVisible(true);
        }
    }
}

class Game {
    constructor(gameWidth, gameHeight) {
        this.dialogue = {}; // Store dialogues from API
        this.quest = {};
        this.door = {};
        this.indoor = {};
        this.npc = {};
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
            const response3 = await fetch('https://data-bank-delta.vercel.app/door');
            const response4 = await fetch('https://data-bank-delta.vercel.app/indoor');
            const response5 = await fetch('https://data-bank-delta.vercel.app/npc');
            const data1 = await response1.json();
            const data2 = await response2.json();
            const data3 = await response3.json();
            const data4 = await response4.json();
            const data5 = await response5.json();
            this.dialogue = data1;  // Store API data
            this.quest = data2;
            this.door = data3;
            this.indoor = data4;
            this.npc = data5;
            console.log("Fetched data 1:", data1);
            console.log("Fetched data 2:", data2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchFaculties = async () => {
        try {
          const { data } = await axios.get("http://localhost:4000/npc", {
            withCredentials: true,
          });
          if (data.success) {
            setFaculties(data.faculties);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.message);
        }
      };

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

        let sceneName = "town";

        // Start MainScene and pass gameWidth, gameHeight, and dialogues
        this.game.scene.start('MainScene', {
            width: this.gameWidth,
            height: this.gameHeight,
            sceneName: sceneName,
            dialogue: this.dialogue,
            quest: this.quest,
            door: this.door,
            indoor: this.indoor,
            npc: this.npc,
        });
    }
}


// Create the game object with dynamic width & height
const myGame = new Game(1500, 700);

