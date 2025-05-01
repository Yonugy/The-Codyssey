export class Door extends Phaser.Physics.Arcade.Sprite {
    constructor(game, x1, y1, x2, y2, color, label, target="", alpha = 0) {
        let bgscale=game.current_bg.scale;
        let width = (x2 - x1)*bgscale;
        let height = (y2 - y1)*bgscale;

        // Create a rectangle texture
        let graphics = game.add.graphics();
        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, width, height);
        graphics.generateTexture("houseTexture", width, height);
        graphics.destroy();

        //position here doesnt matter since setMapPos() will change
        super(game, x1, y1, "houseTexture");

        game.add.existing(this);
        game.physics.add.existing(this);

        this.game=game;
        this.label=label; //"label" of indoor (Beh's House / Exit)
        this.target=target; //"to" of a door  (   house1   / ""  )
        this.mapPosx=(x1+x2)/2;
        this.mapPosy=(y1+y2)/2;

        this.setAlpha(alpha);
        this.setImmovable(true); // House doesn't move when colliding

        let actualPosx=this.mapPosx*bgscale;
        let actualPosy=this.mapPosy*bgscale;
        this.setPosition(actualPosx,actualPosy);
        // this.setPosition(this.mapPosx,this.mapPosy);
        // console.log(this.x,this.y);
        // console.log(this.game.player.x,this.game.player.y);
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

    enter(){
        
    }
}
