export class Dialog{
    constructor(game,content){
        this.game=game;
        this.content=content;
        this.captions=Object.keys(content);
    }

    updateDialog(question, choices){
        this.optionBoxes=[]

        let game=this.game;
        this.graphics = game.add.graphics();
        this.graphics.fillStyle(0x000000, 0.7);
        this.graphics.fillRoundedRect(30, game.gameHeight - 150, game.gameWidth - 100, 140, 20);
        this.graphics.setInteractive(
            new Phaser.Geom.Rectangle(30, game.gameHeight - 150, game.gameWidth - 100, 140),
            Phaser.Geom.Rectangle.Contains
        );

        this.questionBox = game.add.text(60, game.gameHeight - 130, question, {
            font: '24px Arial',
            fill: '#ffffff',
            wordWrap: { width: game.gameWidth - 120 }
        });

        if (choices!=""){
            let i=0;
            for (let [choice, value] of Object.entries(choices)){
                this.option = game.add.text(60, game.gameHeight - (90-35*i), `Option ${i+1}: ${choice}`, {
                    font: '20px Arial',
                    fill: '#ffffff'
                }).setInteractive();

                this.optionBoxes.push(this.option);

                this.option.on('pointerdown', () => {
                    this.game.inventory.push(choice);
                    this.destroyDialog();
                    this.updateDialog(value,'')
                });

                i++;
            }
        }else{
            this.graphics.on('pointerdown', () => {
                this.destroyDialog();
                this.count++;
                if (this.count<this.captions.length){
                    let question=this.captions[this.count];
                    this.updateDialog(question, this.content[question]);
                }else{
                    game.collisionHappened=false;
                    console.log(this.game.inventory);
                }
            });
        }
    }

    showDialogs(){
        let game = this.game;
        this.count=0;
        let question=this.captions[this.count];
        this.updateDialog(question, this.content[question]);
    }

    destroyDialog() {
        this.graphics.destroy();
        this.questionBox.destroy();
        this.optionBoxes.forEach(box => box.destroy());
        this.optionBoxes = [];
    }
}