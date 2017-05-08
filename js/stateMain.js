var StateMain = {

    preload: function () {
        
        var mapPath = "maps/map"+level+".json"
        
        game.load.spritesheet("robot", "images/main/robot.png", 80,111,28);
        game.load.image("tiles","images/tiles.png");
        game.load.tilemap("map1", mapPath,null,Phaser.Tilemap.TILED_JSON);
        
        game.load.spritesheet("arrow", "images/arrowButtons.png",60,60,4);
        game.load.spritesheet("monster", "images/main/monsters.png", 50, 50, 2);
    },

    create: function () {
        
        this.bombCount = [4,10];
        this.need = this.bombCount[level-1];
        this.collected = 0;
        
        this.robotSize=.5;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //load map
        this.map = game.add.tilemap("map1");
        this.map.addTilesetImage("tiles");

        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld(); // 
        this.map.setCollisionBetween(0, 24); // keeping robot inbound

        //load buttons for mobile devices *******************
        this.upArrow=game.add.sprite(0,0,"arrow");
        this.downArrow=game.add.sprite(0,50,"arrow");
        this.leftArrow=game.add.sprite(-50,25,"arrow");
        this.rightArrow=game.add.sprite(50,25,"arrow");
        
        this.upArrow.inputEnabled = true;
        this.downArrow.inputEnabled = true;
        this.leftArrow.inputEnabled = true;
        this.rightArrow.inputEnabled = true;
        
        this.upArrow.events.onInputDown.add(this.doJump,this);
        this.downArrow.events.onInputDown.add(this.doStop,this);
        this.leftArrow.events.onInputDown.add(this.goLeft,this);
        this.rightArrow.events.onInputDown.add(this.goRight,this);
        
        this.upArrow.frame = 0;
        this.downArrow.frame = 1;
        this.leftArrow.frame = 2;
        this.rightArrow.frame = 3;
        
        this.upArrow.anchor.set(0.5, 0.5);
        this.downArrow.anchor.set(0.5, 0.5);
        this.leftArrow.anchor.set(0.5, 0.5);
        this.rightArrow.anchor.set(0.5, 0.5);
        
        this.buttonGroup=game.add.group();
        this.buttonGroup.add(this.upArrow);
        this.buttonGroup.add(this.downArrow);
        this.buttonGroup.add(this.leftArrow);
        this.buttonGroup.add(this.rightArrow);
        
        this.buttonGroup.fixedToCamera = true;
        this.buttonGroup.cameraOffset.setTo(game.width - this.buttonGroup.width/2, game.height-this.buttonGroup.height);
        
        
        this.robot = game.add.sprite(150,150,"robot");
        this.robot.animations.add("idle", [0,1,2,3,4,5,6,7,8,9],12,true);
        this.robot.animations.add("walk", [10,11,12,13,14,15,16,17],12,true);
        this.robot.animations.add("jump", [18,19,20,21,22,23,24,25],12,false);
        
        this.robot.scale.x = this.robotSize;
        this.robot.scale.y = this.robotSize;


        this.robot.animations.play("idle");
        this.robot.anchor.set(.5, .5);
        
        this.monsterGroup = game.add.group();
        this.monsterGroup.createMultiple(10,"monster");
        
        game.physics.arcade.enable([this.robot, this.monsterGroup]);
        this.robot.body.gravity.y = 100;
        this.robot.body.bounce.set(0.25);
        this.robot.body.collideWorldBounds = true;

        game.camera.follow(this.robot);
        cursors = game.input.keyboard.createCursorKeys();
        this.map.setTileIndexCallback(25,this.gotBomb, this);
        
        this.makeMonsters();
        
        game.world.bringToTop(this.buttonGroup);
    },
    
    makeMonsters:function(){
        for(var i=0; i<10; i++){
            var monster = this.monsterGroup.getFirstDead();
            var xx = game.rnd.integerInRange(0, game.world.width);
            monster.reset(xx, 50);
            monster.enabled = true;
            monster.body.velocity.x = -100;
            monster.body.gravity.y = 100;
            monster.body.collideWorldBounds = true;
            monster.name = "monster";
            
            monster.animations.add("move", [0,1],12,true);
            monster.animations.play("move");
        }
    },

    //Functions ********//create Functions **************//create Functions *****************************
    gotBomb: function(sprite,tile){
        if(sprite.name == "monster"){
            return;    
        }
        this.map.removeTile(tile.x,tile.y,this.layer)
        this.collected ++;
        console.log("bombs collected: ",this.collected);
        if(this.collected == this.need){
            level++;
            game.state.start("StateMain");
        }
    },
    reverseMonster: function(monster,layer){
        if(monster.body.blocked.left ==true){
            monster.body.velocity.x = 100;
        }
        if(monster.body.blocked.right ==true){
            monster.body.velocity.x = -100;
        }
    },
    hitMonster: function(player,monster){
        if(player.y < monster.y){
            monster.kill();
        }
        else {
            console.log("game over");
        }
    },
    
    
    update: function () {
        game.physics.arcade.collide(this.robot, this.layer);
        game.physics.arcade.collide(this.monsterGroup, this.layer);
        game.physics.arcade.collide(this.monsterGroup, this.layer,null,this.reverseMonster);
        game.physics.arcade.collide(this.robot, this.monsterGroup,null,this.hitMonster);
        
        
        if(this.robot.body.onFloor()){        
            if(Math.abs(this.robot.body.velocity.x)>100){
                this.robot.animations.play("walk");
            }
            else{
                this.robot.animations.play("idle");
            }
        }
        
        //which way do i face
        if(this.robot.body.velocity.x > 0){
            this.robot.scale.x = this.robotSize; // facing right
        }
        else{
            this.robot.scale.x = -this.robotSize;
        }
        
        
        //which way do i go
        if(cursors.left.isDown){
//            this.robot.body.velocity.x=-250;
            this.goLeft();
        }
        
        if(cursors.right.isDown){
            this.goRight();
        }
        //Jumping 
        if(cursors.up.isDown){
            this.doJump();

        }
        
        //Stopping
        if(cursors.down.isDown){
            this.doStop();
        }
        
    },
    
    render: function(){
        game.debug.bodyInfo(this.robot, 20, 20);
    },
    
    goLeft: function(){
        this.robot.body.velocity.x=-250;
    },
    
    goRight: function(){
        this.robot.body.velocity.x=250;
    },
    doJump: function(){
        if(this.robot.body.onFloor()){
        this.robot.body.velocity.y = -Math.abs(this.robot.body.velocity.x) -150; // negative # allows robot to jump left.
        this.robot.animations.play("jump");
        }
    },
    doStop: function(){
        this.robot.body.velocity.x = 0;
        this.robot.body.velocity.y = 0;
    },

}













