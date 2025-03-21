import { Backdrop } from './backdrop.js';
import { Door } from './door.js';


export class IndoorScene extends Phaser.Scene {
    constructor() {
        super({ key: "IndoorScene" }); // Scene key
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
        this.houseName = data.houseName;
    }

    preload() {
        this.cameras.main.setBackgroundColor('#4F546B');

    }

    create() {
        console.log("Entered House Interior");
        this.backdrop['house_map'] = new Backdrop(this, 0, 0, 'houseInterior', 1.2);
        this.current_bg=this.backdrop['house_map'];

        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'fighter');

        this.npcList = Object.values(this.npc);

        this.door['exit'] = new Door(this, 384, 832, 443, 895, '#000', 'Exit');

        this.doorList = Object.values(this.door);
        this.physics.add.overlap(this.player, this.doorList, this.showEnter, null, this);

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

        this.setGamePos(415,780);
        console.log(this.houseName);
        
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

        if (!this.physics.overlap(this.player, this.doorList)) {
            this.enterButton.setVisible(false);
        }
    }

    showEnter(player, object) {
        if (!this.collisionHappened) {
            this.touching=object.name;
            if (this.touching=="Exit"){
                this.enterButton.setText(`Exit ${this.houseName}`);
            }else{
                let npcName=object.name.charAt(0).toUpperCase() + object.name.slice(1);
                this.enterButton.setText(`Enter ${npcName}`);
            }
            this.enterButton.setVisible(true);
        }
    }

    enterDoor() {
        this.enterButton.setVisible(false);
        console.log(`Entering ${this.touching}...`);
        if (this.touching=="Exit"){
            this.exitHouse()
        }else{
            this.startIndoor(this.touching);
        }
    }

    startIndoor(houseName) {
        // this.scene.pause("MainScene");
        this.cameras.main.fadeOut(2000);
        this.scene.start('IndoorScene', {
            width: this.gameWidth,
            height: this.gameHeight,
            houseName: houseName,
        });
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

    exitHouse() {
        console.log("Exiting house...");
        this.scene.switch("MainScene");
        this.scene.stop("IndoorScene");
    }
}
