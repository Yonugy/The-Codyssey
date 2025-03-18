export class Backdrop extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x, y, name, scale) {
        super(game, x, y, name);
        game.add.existing(this);
        game.physics.add.existing(this);
        this.scale = scale;
        this.setScale(scale);
        this.game=game;
        this.name=name;
        this.setOrigin(0, 0);
    }

    move(x, y) {
        this.setVelocity(x, y);
    }

    setMapPos(x,y){
        let bgscale=this.game.current_bg.scale;
        let relativex = this.game.gameWidth/2 - x*bgscale;
        let relativey = this.game.gameHeight/2 - y*bgscale;
        this.setPosition(relativex,relativey);
    }
}