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

    setMapPos(x,y){
        let bgscale=this.game.current_bg.scale;
        let relativex = this.game.gameWidth/2 - x*bgscale;
        let relativey = this.game.gameHeight/2 - y*bgscale;
        this.setPosition(relativex,relativey);
    }

    getMapPos(){
        let bgscale=this.game.current_bg.scale;
        let actualPosx = (this.game.gameWidth / 2 - this.x) / bgscale;
        let actualPosy = (this.game.gameHeight / 2 - this.y) / bgscale;
        return {x: actualPosx, y: actualPosy};
    }
}