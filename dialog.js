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
            //choice: option text; value: respond text
            for (let [choice, value] of Object.entries(choices)){
                this.option = game.add.text(60, game.gameHeight - (90-35*i), `Option ${i+1}: ${choice}`, {
                    font: '20px Arial',
                    fill: '#ffffff'
                }).setInteractive();

                this.optionBoxes.push(this.option);

                this.option.on('pointerdown', () => {
                    this.destroyDialog();
                    if (choice=="Give Shit"){
                        if (this.game.inventory.includes("Shit")){
                            this.updateDialog(value,'');
                            this.game.inventory = this.game.inventory.filter(item => item !== 'Shit'); //delete all Shit
                            this.game.quest["Give toilet shit"]=1;
                            this.game.npcStatus['bin']=2;
                        }else{
                            this.updateDialog("You don't have shit to give.",'');
                        }
                    }else{
                        this.game.inventory.push(choice);
                        this.updateDialog(value,'')
                    }

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