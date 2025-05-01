export class Npc extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x, y, tag, name, scale, position_id=0) {
        super(game, 0, 0, tag);
        game.add.existing(this);
        game.physics.add.existing(this);
        let bgscale=game.current_bg.scale;
        this.setScale(scale*bgscale);
        this.game = game;
        this.mapPosx=x;
        this.mapPosy=y;
        // this.setMapPos(x,y);
        this.tag=tag;
        this.name=name;
        this.position_id=position_id;
        
        let actualPosx=this.mapPosx*bgscale;
        let actualPosy=this.mapPosy*bgscale;
        this.setPosition(actualPosx,actualPosy);
    }

    talk(chats) {
        this.dialog1 = new Dialog(this.game, chats);
        this.dialog1.showDialogs();
    }

    setMapPos(x,y){
        // let bgscale=this.game.current_bg.scale;
        // let actualPosx=this.mapPosx*bgscale + this.game.gameWidth/2 - x*bgscale;
        // let actualPosy=this.mapPosy*bgscale + this.game.gameHeight/2 - y*bgscale;
        // this.setPosition(actualPosx,actualPosy);

        let bgscale=this.game.current_bg.scale;
        let actualPosx=this.mapPosx*bgscale;
        let actualPosy=this.mapPosy*bgscale;
        this.setPosition(actualPosx,actualPosy);
    }
}