import { Dialog } from './dialog.js';
import { Backdrop } from './backdrop.js';
import { Door } from './door.js';
import { Npc } from './npc.js';



export class IndoorScene extends Phaser.Scene {
    constructor() {
        super({ key: "IndoorScene" }); // Scene key
        this.collisionHappened = false
        this.touching={'door':null,'npc':null};
        this.npc={};
        this.backdrop={};
        this.doors={};
        this.player_direction=-1;
        this.current_bg={};
        this.gameposx=140;
        this.gameposy=260;
        this.movementSpeed=200;
        this.zoomFactor = 6;
    }

    init(data) {
        this.gameWidth = data.width;
        this.gameHeight = data.height;
        this.locationId = data.locationId;
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

    }

    create() {
        console.log("Entered House Interior");
        let indoorDetail = this.locationDetail[this.locationId];
        console.log(this.locationId);
        console.log(indoorDetail);
        this.cameras.main.setBackgroundColor(indoorDetail.bgcolor);
        this.current_bg.scale = this.zoomFactor;

        //Create player sprite
        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'fighter');

        // Set a smaller hitbox for the player
        let hitboxWidth = 640;  // Adjust width of the hitbox
        let hitboxHeight = 640; // Adjust height of the hitbox
        let offsetX = 0;      // Horizontal offset
        let offsetY = 0;      // Vertical offset
        this.player.body.setSize(hitboxWidth, hitboxHeight).setOffset(offsetX, offsetY);


        //import tilemap
        const map = this.make.tilemap({ key: indoorDetail.map });
        const tileset = map.addTilesetImage(indoorDetail.name, indoorDetail.tileset); //Change in tmj file Line 259
        let mapLayers = map.layers;
        for (let i = 0; i < mapLayers.length; i++) {
            let eachLayer = mapLayers[i];
            let layer = map.createLayer(eachLayer.name, tileset, 0, 0);
            layer.setScale(this.zoomFactor);
            this.current_bg[i]=layer;
            if (eachLayer.name == "Wall") {
                let collidableTiles = [];
                let allProperties = map.tilesets[0].tileProperties;
                let firstGid = map.tilesets[0].firstgid;
                for (let key in allProperties) {
                    if (allProperties[key].passable === false) {
                    collidableTiles.push(firstGid + Number(key));
                    }
                }
                layer.setCollision(collidableTiles);
                this.physics.add.collider(this.player, layer);
            }
        }

        //import npc
        this.spawnNpc();

        //house collision area (door)
        let spawnPos = this.location.find(location => location.location_id === this.locationId).spawn_position;
        let x1 = spawnPos.x - 16;
        let y1 = spawnPos.y - 16;
        let x2 = spawnPos.x + 16;
        let y2 = spawnPos.y + 16;
        this.door = new Door(this, x1, y1, x2, y2, '#000', "Exit", "", 0);

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
        this.enterButton = this.add.text(this.gameWidth/2+50, this.gameHeight/2-50, `Exit ${indoorDetail.label}`, {
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
        this.physics.add.overlap(this.player, this.door, this.showEnter, null, this);

        let playerStartPosX = spawnPos.x * this.zoomFactor;
        let playerStartPosY = spawnPos.y * this.zoomFactor;
        this.player.setPosition(playerStartPosX,playerStartPosY);
        this.player.setScale(0.1);

        this.cameras.main.startFollow(this.player);

        // this.playerBounds = this.add.graphics();
        // this.playerBounds.lineStyle(2, 0xff0000, 1);
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

        if (!this.physics.overlap(this.player, this.door)) {
            this.enterButton.setVisible(false);
        }

        // this.playerBounds.clear();
        // this.playerBounds.lineStyle(2, 0xff0000, 1); // Red outline for the bounding box
        // this.playerBounds.strokeRect(
        //     this.player.getBounds().x,
        //     this.player.getBounds().y,
        //     this.player.getBounds().width,
        //     this.player.getBounds().height
        // );
    }

    spawnNpc(){
        for (let npc of Object.values(this.npc)){
            npc.destroy();
        }
        this.npc={};
        this.npcList = [];

        let activeSubQuest = this.registry.get("activeSubQuest");

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

    showTalk(player, object) { //update on new npc
        if (!this.collisionHappened) {
            this.touching=object;
            let activeQuest = this.registry.get("activeQuest");
            let activeSubQuest = this.registry.get("activeSubQuest");
            if (this.dialogue[object.tag][activeSubQuest]  && this.quest[activeQuest].subquest[activeSubQuest].location == this.sceneName){
                this.talkButton.setPosition(object.x - this.talkButton.width / 2,object.y - object.displayHeight/2 - this.talkButton.height - 5)
                this.talkButton.setText(`Talk to ${object.name}`);
                this.talkButton.setVisible(true);
            }else{
                this.talkButton.setVisible(false);
            }
        }
    }

    showEnter(player, object) {
        if (!this.collisionHappened) {
            this.touching['door']=object;
            this.children.bringToTop(this.enterButton);
            this.enterButton.setPosition(object.x - this.enterButton.width / 2, object.y + object.height/2 + this.enterButton.height);
            this.enterButton.setVisible(true);
            console.log(this.enterButton.x, this.enterButton.y);
        }
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
        console.log("Exiting");
        this.exitHouse()
    }

    exitHouse() {
        console.log("Exiting house...");
        this.scene.switch("MainScene");
        this.scene.stop("IndoorScene");
    }
}
