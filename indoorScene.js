import { Backdrop } from './backdrop.js';

export class IndoorScene extends Phaser.Scene {
    constructor() {
        super({ key: "IndoorScene" }); // Scene key
        this.collisionHappened = false
        this.touching="";
        this.inventory=[];
        this.fulfill=[]
        this.npc={};
        this.backdrop={};
        this.house={};
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
    }

    preload() {
        this.cameras.main.setBackgroundColor('#098B45');
        // Load assets for the house interior
        this.load.image("houseInterior", "asset/house1_interior.png");
        this.load.spritesheet('fighter', 'asset/fighter_walk_idle.png', {
            frameWidth: 128.25,  // Adjust based on your sprite sheet
            frameHeight: 130
        });
    }

    create() {
        console.log("Entered House Interior");
        this.backdrop['house_map'] = new Backdrop(this, 0, 0, 'houseInterior', 1.2);
        this.current_bg=this.backdrop['house_map'];

        this.player = this.physics.add.sprite(this.gameWidth / 2, this.gameHeight / 2, 'fighter');

        this.npcList = Object.values(this.npc);
        
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
    }

    moveMap(x, y) {
        //add npc or game objects into the list to follow map to move
        let sprites=this.npcList.concat(Object.values(this.backdrop)).concat(Object.values(this.house));
        sprites.forEach(sprite => sprite.setVelocity(x, y));
    }

    exitHouse() {
        console.log("Exiting house...");
        this.scene.start("MainScene", { playerX: 100, playerY: 200 }); // Go back outside
    }
}
