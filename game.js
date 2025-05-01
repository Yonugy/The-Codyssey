import { Dialog } from './dialog.js';
import { Npc } from './npc.js';
import { Backdrop } from './backdrop.js';
import { Door } from './door.js';
import { IndoorScene } from './indoorScene.js';



class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.collisionHappened = false
        this.touching={'door':null,'npc':null}; //in case touching door and npc at the same time
        this.inventory=[];
        this.fulfill=[]
        this.npc={};
        this.backdrop={};
        this.doors={};
        this.current_bg;
        this.movementSpeed=200;
        this.player_direction=-1;
        this.zoomFactor=1.8; //1.8
        this.locationId=0;
        this.player_id=1; //need change after login
    }

    init(data) {
        // Receive game width & height from the constructor
        this.gameWidth = data.width;
        this.gameHeight = data.height;
        this.sceneName = data.sceneName; //town (default scene)
        this.dialogue = data.dialogue || {};
        this.quest = data.quest || {};
        this.location = data.location || {};
        this.inventory = data.inventory || [];
        this.player = data.player || {};
        this.item = data.item || {};
        this.action = data.action || {};
        this.packageDetail = data.packageDetail || {};
        this.position = data.position || {};
        this.subquest = data.subquest || {};
        this.package = data.package || {};
        this.choice = data.choice || {};
        this.playerProgress = data.playerProgress || {};
        this.admin = data.admin || {};
        this.npcDetail = data.npcDetail || {};
        this.locationDetail = data.locationDetail || {};
    }

    preload() {
        this.load.image("Dungeon_Tileset", "asset/map_asset/Dungeon_Tileset.png");
        this.load.image("Big_Set", "asset/map_asset/Big_Set.png");
        this.load.image("Rustic_Indoor", "asset/map_asset/Rustic_Indoor.png");
        this.load.tilemapTiledJSON("map1", "asset/map_asset/map1.tmj"); //Mbat, Dungeon_Tileset
        this.load.tilemapTiledJSON("map2", "asset/map_asset/map2.tmj"); //House1, Big_Set
        this.load.tilemapTiledJSON("map3", "asset/map_asset/map3.tmj"); //House2, Big_Set
        this.load.tilemapTiledJSON("map4", "asset/map_asset/map4.tmj"); //House3, Big_Set
        this.load.tilemapTiledJSON("map5", "asset/map_asset/map5.tmj"); //Diner, Rustic_Indoor
        this.load.tilemapTiledJSON("map6", "asset/map_asset/map6.tmj"); //Purple, Rustic_Indoor

        this.load.image('town_bg', 'asset/town_map.jpg');
        this.load.image('town_obstacle', 'asset/town_map_obstacle.png');
        this.load.spritesheet('fighter', 'asset/fighter_walk_idle.png', {
            frameWidth: 128.25,  // Adjust based on your sprite sheet
            frameHeight: 130
        });
        this.load.image("house1_interior", "asset/house1_interior.png");
        this.load.image("ownhouse_interior", "asset/ownhouse_interior.jpg");

        // for (let [tag,npc] of Object.entries(this.allnpc)){
        //     if (npc.type === "image") {
        //         this.load.image(tag, `asset/${npc.img}`);
        //     }else if (npc.type === "spritesheet"){
        //         console.log(tag);
        //         this.load.spritesheet(tag, `asset/${npc.img}`, {
        //             frameWidth: npc.frameSize.width,
        //             frameHeight: npc.frameSize.height
        //         });
        //     }
        // }

        for (let [tag,npc] of Object.entries(this.npcDetail)){
            if (npc.type === "image") {
                this.load.image(tag, `asset/${npc.img}`);
            }else if (npc.type === "spritesheet"){
                console.log(tag);
                this.load.spritesheet(tag, `asset/${npc.img}`, {
                    frameWidth: npc.frameSize.width,
                    frameHeight: npc.frameSize.height
                });
            }
        }
    }

    create() {
        //set initial quest and subquest in the beginning
        //use registry to store data across all scenes
        // let activeQuest = this.quest.init; //comment this before committing
        // let activeQuest = "quest2"; //uncomment this before committing
        let activeQuest = 1;
        // let activeSubQuest = this.quest[activeQuest].startquest;
        let activeSubQuest = 1;
        this.registry.set("activeQuest", activeQuest);
        this.registry.set("activeSubQuest", activeSubQuest);
        this.registry.set("inventory", this.inventory);
        this.registry.set("fulfill", this.fulfill);

        //import background
        let locationDetail = this.locationDetail[this.locationId];
        this.cameras.main.setBackgroundColor(locationDetail.bgcolor);
        this.zoomFactor=locationDetail.scale;
        this.backdrop['map'] = new Backdrop(this, 0, 0, locationDetail.img, this.zoomFactor);
        this.current_bg=this.backdrop['map'];

        //background obstacle
        this.backdrop['obstacle'] = new Backdrop(this, 0, 0, 'town_obstacle', this.zoomFactor);

        //import npc
        this.spawnNpc();

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
        let locationDoors = this.location.filter(location => location.location_id !== this.locationId);
        console.log(locationDoors);
        for (let location of locationDoors){ //dictionary contains info of a door
            let location_id = location.location_id
            let label = this.locationDetail[location_id].label
            let entrance = location.entrance_position;
            this.doors[location_id] = new Door(this, entrance.x1, entrance.y1, entrance.x2, entrance.y2, '#000', label, location_id, 0); //create a door object
        }

        // let doorData = this.alldoor[this.sceneName] //list of door of the current scene
        // for (let door of doorData){ //dictionary contains info of a door
        //     if (door.to){ //not an exit (exit dont have "to")
        //         let indoorDetail = this.location[door.to]; //target location detail
        //         let label = indoorDetail.label; //location label for action text
        //         let doorPos = door.position; //all 4 positions (x1,y1,x2,y2) of doors
        //         this.doors[door.to] = new Door(this, doorPos.x1, doorPos.y1, doorPos.x2, doorPos.y2, '#000', label, door.to, 0); //create a door object
        //     }
        // }

        //Talk to npc button
        this.talkButton = this.add.text(this.gameWidth/2+50, this.gameHeight/2-50, 'Talk to someone', {
            fontSize: '20px',
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
            fontSize: '20px',
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
        let spawnPos = this.location.find(location => location.location_id === this.locationId).spawn_position;
        let playerStartPosX = spawnPos.x * this.zoomFactor;
        let playerStartPosY = spawnPos.y * this.zoomFactor;
        this.player.setPosition(playerStartPosX,playerStartPosY);

        //detect back to mainscene from indoor scene
        this.events.on("wake", () => {
            console.log("MainScene Resumed");
            console.log(this.registry.get("activeQuest"));
            console.log(this.registry.get("activeSubQuest"));
            if (this.npcList.length==0 ){
                this.spawnNpc();
                console.log(this.MapPosx);
            }
        });

        // this.cameras.main.setZoom(zoomFactor);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.current_bg.width*this.zoomFactor, this.current_bg.height*this.zoomFactor);
        this.physics.world.setBounds(0, 0, this.current_bg.width*this.zoomFactor, this.current_bg.height*this.zoomFactor);
        this.player.setCollideWorldBounds(true); // Prevent the player from moving outside the bounds
        // this.player.setScale(1/zoomFactor);
        // this.movementSpeed = this.movementSpeed/zoomFactor;
    }

    update() {
        let cursors = this.input.keyboard.createCursorKeys();
        let keys = this.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.player.setVelocity(0);
        let moveX=0;
        let moveY=0;

        if (this.collisionHappened) {
            if (this.player_direction==1) {
                this.player.anims.play('fighter_left_idle', true);
            }else if (this.player_direction==-1){
                this.player.anims.play('fighter_right_idle', true);
            }
        }else{
            if (cursors.left.isDown || keys.A.isDown) { //move left
                moveX-=1;
                this.player_direction=1
            }
            if (cursors.right.isDown || keys.D.isDown) { //move right
                moveX+=1;
                this.player_direction=-1
            }
            if (cursors.up.isDown || keys.W.isDown) { //move up
                moveY-=1;
            }
            if (cursors.down.isDown || keys.S.isDown) { //move down
                moveY+=1;
            }
            if (moveX!=0 || moveY!=0) {
                if (this.player_direction==1) {
                    this.player.anims.play('fighter_left', true);
                }else if (this.player_direction==-1){
                    this.player.anims.play('fighter_right', true);
                }
            }else{
                if (this.player_direction==1) {
                    this.player.anims.play('fighter_left_idle', true);
                }else if (this.player_direction==-1){
                    this.player.anims.play('fighter_right_idle', true);
                }
            }
            this.player.setVelocity(this.movementSpeed*moveX, this.movementSpeed*moveY);
        }

        if (!this.physics.overlap(this.player, this.npcList)) {
            this.talkButton.setVisible(false);
        }

        if (!this.physics.overlap(this.player, this.doorList)) {
            this.enterButton.setVisible(false);
        }
    }

    spawnNpc(){
        for (let npc of Object.values(this.npc)){
            npc.destroy();
        }
        this.npc={};
        this.npcList = [];

        //import npc
        let activeQuest = this.registry.get("activeQuest");
        let activeSubQuest = this.registry.get("activeSubQuest");
        // let questNpcData = this.quest[activeQuest].subquest[activeSubQuest].npc || {}; //list of quest data
        // let locationNpcData = this.location[this.sceneName].npc || {}; //list of location data

        let posData = this.position.filter(position => position.location_id === this.locationId && (position.subquest_id === activeSubQuest || position.subquest_id === null));
        console.log(posData);

        for (let pos of posData){ //loop through all npc
            let coordinate = pos.coordinates;
            let tag = pos.npc;
            console.log(tag);
            let npcData = this.npcDetail[tag];
            console.log(npcData);
            this.npc[tag] = new Npc(this, coordinate.x, coordinate.y, tag, npcData.name, npcData.scale);
            if (npcData.animation){
                for (let [key,anim] of Object.entries(npcData.animation)){
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
        this.children.bringToTop(this.player);
        this.children.bringToTop(this.backdrop['obstacle']);
    }

    talk() {
        this.talkButton.setVisible(false);
        this.collisionHappened = true;
        let object = this.touching['npc'];
        console.log(`Talking to the ${object.name}...`);
        let chats = this.dialogue.filter(dialogue => dialogue.position_id === object.position_id);
        console.log(chats);
        this.dialog1 = new Dialog(this,chats);
        this.dialog1.showDialogs();
        // fetch("https://codyssey-mongodb.vercel.app/inventory", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //       player_id: 1,
        //       item_id: 1,
        //       amount: 1
        //     })
        //   })
    }

    enterDoor() {
        this.enterButton.setVisible(false);
        let objectName = this.touching['door'].label;
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
            location: this.location,
            doorData: this.alldoor,
            sceneName: this.touching['door'].target,
        });
    }

    showTalk(player, object) {
        if (!this.collisionHappened) {
            this.touching['npc']=object;
            let activeSubQuest = this.registry.get("activeSubQuest");
            this.children.bringToTop(this.talkButton);
            let positionDetail = this.position.find(position => position.npc === object.tag && position.location_id === this.locationId && (position.subquest_id === activeSubQuest || position.subquest_id === null));
            if (positionDetail) {
                object.position_id = positionDetail.position_id;
                let current_chat = this.dialogue.filter(dialogue => dialogue.position_id === positionDetail.position_id);
                if (current_chat.length>0){
                    this.talkButton.setPosition(object.x - this.talkButton.width / 2,object.y - object.displayHeight/2 - this.talkButton.height - 5)
                    this.talkButton.setText(`Talk to ${object.name}`);
                    this.talkButton.setVisible(true);
                }else{
                    this.talkButton.setVisible(false);
                }
            }
        }
    }

    showEnter(player, object) {
        if (!this.collisionHappened) {
            this.touching['door']=object; //door.name (Your House etc)
            let objectName = object.label;
            this.children.bringToTop(this.enterButton);
            this.enterButton.setPosition(object.x - this.enterButton.width / 2, object.y - object.height/2 - this.enterButton.height - 5);
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
        this.location = {};
        this.npc = {};
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        console.log(window.innerWidth,window.innerHeight);
        this.gameWidth = window.innerWidth;
        this.gameHeight = window.innerHeight;
        this.fetchData(); // Fetch data from MongoDB
        this.fetchMongo().then(() => {
            this.startGame(); // Start game only after fetching data
        });
    }

    async fetchNpcJson() {
        try {
            const response = await fetch('./game-data/npc.json');
            const npcData = await response.json();
            this.npc = npcData;
            console.log("Fetched NPC data:", npcData);
        } catch (error) {
            console.error('Error fetching npc.json:', error);
        }
    }

    async fetchData() {
        try {
            const response1 = await fetch('https://data-bank-delta.vercel.app/');
            const response2 = await fetch('https://data-bank-delta.vercel.app/quest');
            const response3 = await fetch('https://data-bank-delta.vercel.app/door');
            const response4 = await fetch('https://data-bank-delta.vercel.app/location');
            const response5 = await fetch('https://data-bank-delta.vercel.app/npc');
            const data1 = await response1.json();
            const data2 = await response2.json();
            const data3 = await response3.json();
            const data4 = await response4.json();
            const data5 = await response5.json();
            this.dialogue = data1;  // Store API data
            this.quest = data2;
            this.door = data3;
            this.location = data4;
            this.npc = data5;
            console.log("Fetched data 1:", data1);
            console.log("Fetched data 2:", data2);
            await this.fetchNpcJson(); // Fetch npc.json after other data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    fetchMongo = async () => {
        try {
            const urls = [
                "https://codyssey-mongodb.vercel.app/dialogue",
                "https://codyssey-mongodb.vercel.app/quest",
                "https://codyssey-mongodb.vercel.app/location",
                "https://codyssey-mongodb.vercel.app/inventory",
                "https://codyssey-mongodb.vercel.app/player",
                "https://codyssey-mongodb.vercel.app/item",
                "https://codyssey-mongodb.vercel.app/action",
                "https://codyssey-mongodb.vercel.app/package_detail",
                "https://codyssey-mongodb.vercel.app/position",
                "https://codyssey-mongodb.vercel.app/subquest",
                "https://codyssey-mongodb.vercel.app/package",
                "https://codyssey-mongodb.vercel.app/choice",
                "https://codyssey-mongodb.vercel.app/player_progress",
                "https://codyssey-mongodb.vercel.app/admin",
                './game-data/npc_detail.json',
                './game-data/location_detail.json'
            ];

            const responses = await Promise.all(urls.map(url => fetch(url)));
            const [
                dialogue, quest, location,
                inventory, player, item, action, packageDetail,
                position, subquest, packageData, choice, playerProgress, admin,
                npcDetail, locationDetail
            ] = await Promise.all(responses.map(res => res.json()));

            this.dialogue = dialogue;
            this.quest = quest;
            this.location = location;
            this.inventory = inventory;
            this.player = player;
            this.item = item;
            this.action = action;
            this.packageDetail = packageDetail;
            this.position = position;
            this.subquest = subquest;
            this.package = packageData;
            this.choice = choice;
            this.playerProgress = playerProgress;
            this.admin = admin;
            this.npcDetail = npcDetail;
            this.locationDetail = locationDetail;

            console.log("Fetched dialogue:", dialogue);
            console.log("Fetched quest:", quest);
            console.log("Fetched location:", location);
            console.log("Fetched inventory:", inventory);
            console.log("Fetched player:", player);
            console.log("Fetched item:", item);
            console.log("Fetched action:", action);
            console.log("Fetched packageDetail:", packageDetail);
            console.log("Fetched position:", position);
            console.log("Fetched subquest:", subquest);
            console.log("Fetched package:", packageData);
            console.log("Fetched choice:", choice);
            console.log("Fetched playerProgress:", playerProgress);
            console.log("Fetched admin:", admin);
            console.log("Fetched npcDetail:", npcDetail);
            console.log("Fetched locationDetail:", locationDetail);
        } catch (error) {
            console.error('Error fetching data from MongoDB:', error);
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
            location: this.location,
            inventory: this.inventory,
            player: this.player,
            item: this.item,
            action: this.action,
            packageDetail: this.packageDetail,
            position: this.position,
            subquest: this.subquest,
            package: this.package,
            choice: this.choice,
            playerProgress: this.playerProgress,
            admin: this.admin,
            npcDetail: this.npcDetail,
            locationDetail: this.locationDetail
        });
    }
}


// Create the game object with dynamic width & height
const myGame = new Game(1450, 650); //size wont be use

