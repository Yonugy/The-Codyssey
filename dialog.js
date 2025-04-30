export class Dialog{
    constructor(game,content){
        this.game=game;
        this.content=content;
        this.captions=Object.keys(content);
        // this.uiCamera = this.game.cameras.add(0, 0, game.gameWidth, game.gameHeight).setScroll(0, 0).setZoom(1).setName('uiCamera');
        this.dialogContainer = this.game.add.container(30, game.gameHeight - 150).setScrollFactor(0).setDepth(1000); // High depth to ensure it's on top
    }

    updateDialog(dialogue_id){
        this.fulfill=this.game.registry.get("fulfill");
        this.inventory=this.game.registry.get("inventory");
        this.optionBoxes=[]

        let game=this.game;
        let zoomFactor=game.zoomFactor;
        let cam = game.cameras.main;
        console.log(cam.scrollX, cam.scrollY);
        // // console.log(this.game.current_bg.x, this.game.current_bg.y);
        // // let dialogX = cam.scrollX + 30 / zoomFactor;
        // // let dialogY = cam.scrollY + (cam.height - 150) / zoomFactor;
        let dialogX = cam.scrollX+(30);
        let dialogY = cam.scrollY+(game.gameHeight - 150);
        let dialogWidth = (game.gameWidth - 100);
        let dialogHeight = 140;
        this.graphics = game.add.graphics();
        this.graphics.fillStyle(0x000000, 0.7);
        this.graphics.fillRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, 20);
        this.graphics.setInteractive(
            new Phaser.Geom.Rectangle(dialogX, dialogY, dialogWidth, dialogHeight),
            Phaser.Geom.Rectangle.Contains
        );

        // this.graphics.fillRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, 20 / zoomFactor);
        // this.graphics.setInteractive(
        //     new Phaser.Geom.Rectangle(dialogX, dialogY, dialogWidth, dialogHeight),
        //     Phaser.Geom.Rectangle.Contains
        // );
        
        // // this.graphics.setScale(1/zoomFactor);
        // this.graphics.setScrollFactor(0);
        // // this.graphics.setPosition(dialogX, dialogY);
        // console.log(this.graphics);

        // let dialogX = 0; // Relative to the container
        // let dialogY = 0; // Relative to the container
        // let dialogWidth = game.gameWidth - 60;
        // let dialogHeight = 140;
        // let borderRadius = 20;

        // this.dialogContainer.removeAll(true);

        // this.graphics = game.add.graphics();
        // this.graphics.fillStyle(0x000000, 0.7);
        // this.graphics.fillRoundedRect(dialogX, dialogY, dialogWidth, dialogHeight, borderRadius);
        // this.dialogContainer.add(this.graphics);

        // this.questionBox = game.add.text(30, 20, question, { // relative inside container
        //     font: '24px Arial',
        //     fill: '#ffffff',
        //     wordWrap: { width: dialogWidth - 60 }
        // });

        let question = game.dialogue.find(dialogue => dialogue.dialogue_id === dialogue_id);
        console.log(question);
        this.questionBox = game.add.text(60, game.gameHeight - 130, question, {
            font: '24px Arial',
            fill: '#ffffff',
            wordWrap: { width: game.gameWidth - 120 }
        });
        this.questionBox.setScrollFactor(0);
        // this.dialogContainer.add(this.questionBox);

        let choices = game.choice.filter(choice => choice.dialogue_id === dialogue_id);
        if (choices){
            let i=0;
            //choice: option text; value: respond text
            for (let option of choices){
                let choice = option.text;
                let optionX = 60 + cam.scrollX;
                let optionY = game.gameHeight - (90-35*i) + cam.scrollY;
                this.option = game.add.text(optionX, optionY, `Option ${i+1}: ${choice}`, {
                    font: '20px Arial',
                    fill: '#ffffff'
                }).setInteractive();
                // this.option.setScrollFactor(0);
                // this.dialogContainer.add(option);

                this.optionBoxes.push(this.option);

                this.option.on('pointerdown', () => {
                    this.destroyDialog();

                    if (option.package_id){
                        this.updateInventory(option.package_id);
                        
                        
                        // if (value.mode=="take"){
                        //     this.inventory.push(value.item);
                        //     this.game.registry.set("inventory", this.inventory);
                        //     this.updateDialog(value.respond,'');
                        // }else if (value.mode=="give"){
                        //     if (this.inventory.includes(value.item)){
                        //         this.inventory = this.inventory.filter(item => item !== value.item); //delete all Shit
                        //         this.fulfill.push(value.fulfill);
                        //         this.game.registry.set("fulfill", this.fulfill);
                        //         this.checkCriteria();
                        //         this.updateDialog(value.yrespond,'');
                        //     }else{
                        //         this.updateDialog(value.nrespond,'');
                        //     }
                        // }else{
                        //     console.log("Invalid mode")
                        // }
                    }else{
                        this.updateDialog(value.respond,'');
                    }
                });

                i++;
            }
        }else{
            if (choices.animation){
                let npc = this.game.touching.npc;
                this.game.npc[npc.tag].play(choices.animation);
            }
            this.graphics.setInteractive(new Phaser.Geom.Rectangle(dialogX, dialogY, dialogWidth, dialogHeight), Phaser.Geom.Rectangle.Contains);

            this.graphics.on('pointerdown', () => {
                if (choices.fulfill){
                    this.fulfill.push(choices.fulfill);
                    this.game.registry.set("fulfill", this.fulfill);
                    console.log(this.game.registry.get("fulfill"));
                    this.checkCriteria();
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
        // this.uiCamera.add(this.dialogContainer);
    }

    updateInventory(package_id){
        let package_detail = game.packageDetail.filter(packageDetail => packageDetail.package_id === package_id);
        console.log(this.inventory);

        for (let item of package_detail) {
          fetch("https://codyssey-mongodb.vercel.app/inventory", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              player_id: this.game.player_id,
              item_id: item.item_id,
              amount: item.amount,
            }),
          });
        }
    }

    checkCriteria(){
        let activeQuest = this.game.registry.get("activeQuest");
        let activeSubQuest = this.game.registry.get("activeSubQuest");
        let criteria = this.game.quest[activeQuest].subquest[activeSubQuest].criteria;
        console.log(criteria);
        console.log(this.fulfill);
        // update next quest to change activeQuest and/or activeSubQuest
        if (criteria.every(item => this.fulfill.includes(item))) { //done subquest
            let nextsubquest = this.game.quest[activeQuest].subquest[activeSubQuest].nextsubquest;
            console.log(nextsubquest);
            if (nextsubquest){
                // this.game.activeSubQuest=nextsubquest;
                this.game.registry.set("activeSubQuest", nextsubquest);
            }else{
                // this.game.activeQuest = this.game.quest[activeQuest].nextquest;
                // this.game.activeSubQuest = this.game.quest[this.game.activeQuest].startquest;
                this.game.registry.set("activeQuest", this.game.quest[activeQuest].nextquest);
                activeQuest = this.game.registry.get("activeQuest");
                this.game.registry.set("activeSubQuest", this.game.quest[activeQuest].startquest);
            }
            // console.log(this.game.activeQuest);
            // console.log(this.game.activeSubQuest);
            console.log(this.game.registry.get("activeQuest"));
            console.log(this.game.registry.get("activeSubQuest"));
        }
}

    showDialogs(){
        this.count=0;
        let current_dialogue = this.content[this.count];
        // let question=this.captions[this.count];
        // this.updateDialog(question, this.content[question]);
        this.updateDialog(current_dialogue.dialogue_id);
    }

    // destroyDialog() {
    //     this.graphics.destroy();
    //     this.questionBox.destroy();
    //     this.optionBoxes.forEach(box => box.destroy());
    //     this.optionBoxes = [];
    // }

    destroyDialog() {
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }
        if (this.questionBox) {
            this.questionBox.destroy();
            this.questionBox = null;
        }
        this.optionBoxes.forEach(box => box.destroy());
        this.optionBoxes = [];
        // if (this.dialogContainer.exists) {
        //     this.dialogContainer.removeAll(true);
        //     // this.uiCamera.remove(this.dialogContainer);
        //     // this.dialogContainer.destroy();
        //     // this.dialogContainer = this.game.add.container(30, this.game.config.height - 150).setScrollFactor(0).setDepth(1000);
        // }
    }
}