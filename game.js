import { Dialog } from './dialog.js';
import { Npc } from './npc.js';


class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
        this.collisionHappened = false
        this.touching="";
        this.inventory=[];
        this.fulfill=[]
        this.npc={};
    }

    init(data) {
        // Receive game width & height from the constructor
        this.gameWidth = data.width;
        this.gameHeight = data.height;
        this.dialogue = data.dialogue || {};
        this.quest = data.quest || {};
    }

    preload() { //update on new npc
        this.load.image('bg', 'asset/walpaper.jpg');
        this.load.image('ben', 'asset/ben.jpg');
        this.load.image('bin', 'asset/trash_bin.png');
        this.load.image('apu', 'asset/apu_logo.png');
        this.load.image('toilet', 'asset/toilet.png');
        this.load.spritesheet('cat', 'asset/cat-sheet2.png', {
            frameWidth: 247.5,  // Adjust based on your sprite sheet
            frameHeight: 247.5
        });
        
    }

    create() { //update on new npc'
        // await this.fetchData();
        console.log("hi");
        console.log(this.dialogue);
        console.log(this.dialogue["npc"]);
        this.bg = this.physics.add.image(0, 0, 'bg');
        this.bg.setScale(2);

        // this.bin = this.physics.add.sprite(100, -100, 'bin');
        // this.bin.setScale(0.1);
        this.npc['bin'] = new Npc(this, 100, -100, 'bin', 0.1);

        // this.apu = this.physics.add.sprite(0, 200, 'apu');
        // this.apu.setScale(0.5);
        this.npc['apu'] = new Npc(this, 0, 200, 'apu', 0.5);

        // this.toilet = this.physics.add.sprite(500, 0, 'toilet');
        // this.toilet.setScale(0.5);
        this.npc['toilet'] = new Npc(this, 500, 0, 'toilet', 0.5);

        this.anims.create({
            key: 'cat_turn',
            frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 93 }),
            frameRate: 60, // Adjust speed (frames per second)
            repeat: 1 // -1 = Loop infinitely
        });
        // this.cat = this.physics.add.sprite(600, 300, 'cat');
        // this.cat.setScale(0.7);
        // this.cat.setFrame(0);
        // this.cat.play('cat_turn');
        this.npc['cat'] = new Npc(this, 600, 300, 'cat', 0.7);
        this.npc['cat'].setFrame(0);

        this.npcList = [this.bin, this.apu, this.toilet, this.cat]; //update on new npc

        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'ben');
        this.player.setScale(0.2);

        this.npcStatus={'bin':0, "apu":0, "toilet":0, "cat":0}; //update on new npc

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

        this.npcList = Object.values(this.npc);
        this.physics.add.overlap(this.player, this.npcList, this.showTalk, null, this);

        //set initial quest and subquest in the beginning
        this.activeQuest = this.quest.init;
        this.activeSubQuest = this.quest[this.activeQuest].startquest;
        console.log(this.activeQuest)
        console.log(this.activeSubQuest);
        console.log(this.quest[this.activeQuest].subquest[this.activeSubQuest]);
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
        if (this.cursors.left.isDown || this.keys.A.isDown) {
            x = 160;
        } else if (this.cursors.right.isDown || this.keys.D.isDown) {
            x = -160;
        }
        
        // Up/down movement
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            y = 160;
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {
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

        // if (this.quest["Give toilet shit"]==1){
        //     this.npcStatus['bin']=2;
        // }


    }

    moveMap(x, y) {
        //add npc or game objects into the list to follow map to move
        let sprites=this.npcList.concat(this.bg);
        sprites.forEach(sprite => sprite.setVelocity(x, y));
    }

    // talkToBin(){
    //     console.log('Talking to the bin...');
    //     if (this.npcStatus['bin']==0){
    //         this.chats={
    //             'Do you want to live in bin or marry bin?':{
    //                 'Live in bin':'Welcome home Ben, you definitely belong in the bin!',
    //                 "Marry bin":"Congrats on your marriage!"
    //             },
    //             'Please go get some help!':'',
    //             'Who will even want to live in bin or even marry the smelly bin.':'',
    //             'Ben is the first one that does it no cap no aura.':'',
    //             'Now go get the shit in the toilet.':''
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();
    //         this.npcStatus['bin']=1;

    //     }else if (this.npcStatus['bin']==1){
    //         this.chats={
    //             'Go get the shit in the toilet!':''
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();

    //     }else if (this.npcStatus['bin']==2){
    //         this.chats={
    //             'Good job in getting the shit in the skibidi toilet!':'',
    //             'Next, go get the trash in the oiia!':''
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();
    //         this.npcStatus['bin']=3;

    //     }else if (this.npcStatus['bin']==3){
    //         this.chats={
    //             'Go get the trash in the oiia!':''
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();

    //     }else if (this.npcStatus['bin']==4){
    //         this.chats={
    //             'Good job':''
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();

    //     }
    // }

    // talkToApu(){
    //     console.log('Talking to the apu...');
    //     if (this.npcStatus['apu']==0){
    //             this.chats={
    //             'What do you want?':{
    //                 'Trash':'Here you go! Trash taking trash!',
    //                 "Shit":"Here you go! Shit taking shit!"
    //             }
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();
    //     }
    // }

    // talkToToilet(){
    //     console.log('Talking to the toilet...');
    //     if (this.npcStatus['toilet']==0){
    //         this.chats={
    //             'Skibidi skibidi toilet!':'',
    //             'What is your problem?':{
    //                 "Give Shit":"HUUUURGGEHH",
    //                 "Bye":"..."
    //             },
    //             "What the sigma?":""
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();
    //     }
    // }

    // talkToCat(){
    //     console.log('Talking to the cat...');
    //     if (this.npcStatus['cat']==0){
    //         this.cat.play('cat_turn');
    //         this.chats={
    //             'Oiiai, oiiai':'',
    //             'Oiiai, oiiai?':{
    //                 "Give Trash":"EEEEEEAAAAAAAAAAAAAAARRRRRRRRRRRRRREIR",
    //                 "Bye":"Oiiai, oiiai"
    //             }
    //         }
    //         this.dialog1 = new Dialog(this,this.chats);
    //         this.dialog1.showDialogs();
    //     }
    // }

    talk() { //update on new npc
        this.talkButton.setVisible(false);
        this.collisionHappened = true;
        console.log(`Talking to the ${this.touching}...`);
        let chats=this.dialogue[this.touching][this.activeSubQuest];
        console.log(chats);
        this.dialog1 = new Dialog(this,chats);
        this.dialog1.showDialogs();

    //     if (this.touching=="bin"){
    //         this.talkToBin();
    //     }else if (this.touching=="apu"){
    //         this.talkToApu();
    //     }else if (this.touching=="toilet"){
    //         this.talkToToilet();
    //     }else if (this.touching=="cat"){
    //         this.talkToCat();
    //     }
    }

    showTalk(player, object) { //update on new npc
        // console.log(object.name);
        if (!this.collisionHappened) {
            this.touching=object.name;
            let npcName=object.name.charAt(0).toUpperCase() + object.name.slice(1);
            this.talkButton.setText(`Talk to ${npcName}`);

            // if (object === this.bin) {
            //     this.talkButton.setText('Talk to Bin');
            //     this.touching='bin';
            // }else if (object === this.apu) {
            //     this.talkButton.setText('Talk to APU');
            //     this.touching='apu';
            // }else if (object === this.toilet) {
            //     this.talkButton.setText('Talk to Toilet');
            //     this.touching='toilet';
            // }else if (object === this.cat) {
            //     this.talkButton.setText('Talk to Cat');
            //     this.touching='cat';
            // }
            this.talkButton.setVisible(true);
        }
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
            scene: [MainScene]
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

