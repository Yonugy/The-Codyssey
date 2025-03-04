export class Npc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name, scale) {
        super(scene, x, y, name);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(scale);
        this.name=name
    }

    talk(chats) {
        this.dialog1 = new Dialog(this.scene, chats);
        this.dialog1.showDialogs();
    }

    move(x, y) {
        this.setVelocity(x, y);
    }
}

// export class Npc{
//     constructor(game,x,y,name,scale){
//         this.game=game;
//         this.posx=x;
//         this.posy=y;
//         this.name=name;
//         this.scale=scale;
//         this.spawn(x,y,name,scale);
//     }

//     spawn(x,y,img,scale){
//         this.player=this.game.physics.add.image(x, y, img);
//         this.player.setScale(scale);
//     }

//     get(){
//         return this.player;
//     }

//     talk(chats){
//         this.dialog1 = new Dialog(this.game,chats);
//         this.dialog1.showDialogs();
//     }

//     move(x,y){
//         this.player.setVelocity(x, y);
//     }
// }

