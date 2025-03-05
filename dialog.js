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

        console.log(choices.choice);

        if (choices.choice){
            let i=0;
            //choice: option text; value: respond text
            for (let [choice, value] of Object.entries(choices.choice)){
                this.option = game.add.text(60, game.gameHeight - (90-35*i), `Option ${i+1}: ${choice}`, {
                    font: '20px Arial',
                    fill: '#ffffff'
                }).setInteractive();

                this.optionBoxes.push(this.option);

                this.option.on('pointerdown', () => {
                    this.destroyDialog();

                    if (value.item){
                        if (value.mode=="take"){
                            this.game.inventory.push(value.item);
                            this.updateDialog(value.respond,'');
                        }else if (value.mode=="give"){
                            if (this.game.inventory.includes(value.item)){
                                this.game.inventory = this.game.inventory.filter(item => item !== value.item); //delete all Shit
                                this.game.fulfill.push(value.fulfill);
                                this.updateDialog(value.yrespond,'');
                            }else{
                                this.updateDialog(value.nrespond,'');
                            }
                        }else{
                            console.log("Invalid mode")
                        }
                    }else{
                        this.updateDialog(value.respond,'');
                    }
                });

                i++;
            }
        }else{
            this.graphics.on('pointerdown', () => {
                if (choices.fulfill){
                    let activeQuest = this.game.activeQuest;
                    let activeSubQuest = this.game.activeSubQuest;
                    this.game.fulfill.push(choices.fulfill);
                    let criteria = this.game.quest[activeQuest].subquest[activeSubQuest].criteria;
                    // update next quest to change activeQuest and/or activeSubQuest
                    if (criteria.every(item => this.game.fulfill.includes(item))) { //done subquest
                        let nextsubquest = this.game.quest[activeQuest].subquest[activeSubQuest].nextsubquest;
                        if (nextsubquest){
                            if (nextsubquest==""){
                                this.activeQuest = this.quest[activeQuest].nextquest;
                                this.activeSubQuest = this.quest[this.activeQuest].startquest;
                            }else{
                                this.game.activeSubQuest=nextsubquest;
                            }
                        }

                    }
                }

                this.destroyDialog();
                this.count++;
                if (this.count<this.captions.length){
                    let question=this.captions[this.count];
                    this.updateDialog(question, this.content[question]);
                }else{
                    game.collisionHappened=false;
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