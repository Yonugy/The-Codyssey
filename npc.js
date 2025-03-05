export class Npc extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, name, scale) {
        super(scene, x, y, name);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(scale);
        this.name=name;
    }

    talk(chats) {
        this.dialog1 = new Dialog(this.scene, chats);
        this.dialog1.showDialogs();
    }

    move(x, y) {
        this.setVelocity(x, y);
    }
}