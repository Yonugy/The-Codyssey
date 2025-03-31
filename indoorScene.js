import { Dialog } from './dialog.js';
import { Backdrop } from './backdrop.js';
import { Door } from './door.js';
import { Npc } from './npc.js';



export class IndoorScene extends Phaser.Scene {
    constructor() {
        super({ key: "IndoorScene" }); // Scene key
        this.collisionHappened = false
        this.touching="";
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
        this.dialogue = data.dialogue
        this.quest = data.quest; //quest data from main scene
        this.allnpc = data.npc; //all npc data from main scene
        this.indoor = data.indoorData;
        this.alldoor = data.doorData;
        this.sceneName = data.sceneName;
    }

    preload() {

    }

    create() {
        console.log("Entered House Interior");
        let indoorDetail = this.indoor[this.sceneName];
        this.cameras.main.setBackgroundColor(indoorDetail.bgcolor);

        this.backdrop['house_map'] = new Backdrop(this, 0, 0, indoorDetail.img, indoorDetail.scale);
        this.current_bg=this.backdrop['house_map'];

        //import npc
        this.npc={};
        let activeQuest = this.registry.get("activeQuest");
        let activeSubQuest = this.registry.get("activeSubQuest");
        let questNpcData = this.quest[activeQuest].subquest[activeSubQuest].npc; //list of quest data
        let questLocation = this.quest[activeQuest].subquest[activeSubQuest].location; //location of the quest
        for (let [tag,npc] of Object.entries(this.allnpc)){
            if (questNpcData[tag] && questLocation===this.sceneName){
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

        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'fighter');
        this.player_direction=-1;

        //house collision area (door)
        let doorData = this.alldoor[this.sceneName]
        for (let door of doorData){ //dictionary contains info of a door
            if (door.to){ //not an exit (exit dont have "to")
                let indoorDetail = this.indoor[door.to]; //target indoor detail
                let label = indoorDetail.label; //indoor label for action text
                let doorPos = door.position; //all 4 positions (x1,y1,x2,y2) of doors
                this.doors[door.to] = new Door(this, doorPos.x1, doorPos.y1, doorPos.x2, doorPos.y2, '#000', label, door.to); //create a door object
            }else{
                let doorPos = door.position;
                this.doors[door.to] = new Door(this, doorPos.x1, doorPos.y1, doorPos.x2, doorPos.y2, '#000', "Exit");
            }
        }

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

        let spawnPos = indoorDetail.spawn; //dictionary contains {x:? , y:?}
        this.setGamePos(spawnPos.x,spawnPos.y);
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

    showTalk(player, object) { //update on new npc
        if (!this.collisionHappened) {
            this.touching=object;
            let activeQuest = this.registry.get("activeQuest");
            let activeSubQuest = this.registry.get("activeSubQuest");
            if (this.dialogue[object.tag][activeSubQuest]  && this.quest[activeQuest].subquest[activeSubQuest].location == this.sceneName){
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
            if (objectName=="Exit"){
                let houseName = this.indoor[this.sceneName].label;
                this.enterButton.setText(`Exit ${houseName}`);
            }else{
                this.enterButton.setText(`Enter ${objectName}`);
            }
            this.enterButton.setVisible(true);
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
        let objectName = this.touching.label;
        console.log(`Entering ${objectName}...`);
        if (objectName=="Exit"){
            //exit current indoor
            this.exitHouse()
        }else{
            //go indoor
            let indoorDetail = this.indoor[this.touching.target]; //target is "to" of a door
            this.scene.switch('IndoorScene', {
                width: this.gameWidth,
                height: this.gameHeight,
                indoorData: indoorDetail,
                sceneName: this.touching.target,
            });
        }
    }

    moveMap(x, y) {
        //add npc or game objects into the list to follow map to move
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.doors));
        sprites.forEach(sprite => sprite.setVelocity(x, y));
    }

    setGamePos(x, y) {
        //add npc or game objects into the list to follow map to move
        this.npcList = Object.values(this.npc);
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.doors));
        sprites.forEach(sprite => sprite.setMapPos(x, y));
    }

    exitHouse() {
        console.log("Exiting house...");
        this.scene.switch("MainScene");
        this.scene.stop("IndoorScene");
    }
}
