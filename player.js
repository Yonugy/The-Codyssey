export class Player{
    constructor(game,x,y,name,scale){
        this.game=game;
        this.posx=x;
        this.posy=y;
        this.img=img;
        this.scale=scale;
        this.spawn(x,y,name,scale);
    }

    spawn(x,y,img,scale){
        this.player=this.game.physics.add.image(x, y, img);
        this.player.setScale(scale);
    }

    get(){
        return this.player;
    }

    talk(){
        
    }
}