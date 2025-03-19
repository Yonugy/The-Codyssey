export class Npc extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x, y, name, scale) {
        super(game, 0, 0, name);
        game.add.existing(this);
        game.physics.add.existing(this);
        this.setScale(scale);
        this.game = game;
        this.mapPosx=x;
        this.mapPosy=y;
        this.setMapPos(x,y);
        this.name=name;
    }

    talk(chats) {
        this.dialog1 = new Dialog(this.game, chats);
        this.dialog1.showDialogs();
    }

    // move(x, y) {
    //     this.setVelocity(x, y);
    // }

    setMapPos(x,y){
        let bgscale=this.game.current_bg.scale;
        let actualPosx=this.mapPosx*bgscale + this.game.gameWidth/2 - x*bgscale;
        let actualPosy=this.mapPosy*bgscale + this.game.gameHeight/2 - y*bgscale;
        this.setPosition(actualPosx,actualPosy);
    }
}