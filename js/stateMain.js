var StateMain = {

    preload: function () {
        game.load.spritesheet("robot", "images/main/robot.png", 80,111,28);
        game.load.image("tiles","images/tiles.png");
        game.load.tilemap("map1", "maps/map1.json",null,Phaser.Tilemap.TILED_JSON);

    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //load map
        this.map = game.add.tilemap("map1");
        this.map.addTilesetImage("tiles");

        this.layer = this.map.createLayer("Tile Layer 1");
        this.layer.resizeWorld(); // 
        this.map.setCollisionBetween(0, 24); // keeping robot inbound


        this.robot = game.add.sprite(150,150,"robot");
        this.robot.animations.add("idle", [0,1,2,3,4,5,6,7,8,9],12,true);
        this.robot.animations.add("walk", [10,11,12,13,14,15,16,17],12,true);
        this.robot.animations.add("jump", [18,19,20,21,22,23,24,25],12,false);


        this.robot.animations.play("idle");
        this.robot.anchor.set(.5, .5);
        game.physics.arcade.enable(this.robot);
        this.robot.body.gravity.y = 100;
        this.robot.body.bounce.set(.25);
        this.robot.body.collideWorldBound = true;

        game.camera.follow(this.robot);
        cursors = game.input.keyboard.createCursorKeys();
    },

    update: function () {
        game.physics.arcade.collide(this.robot, this.layer);
        
        if(Math.abs(this.robot.body.velocity.x)>100){
            this.robot.animations.play("walk");
        }
        else{
            this.robot.animations.play("idle");
        }
        
        //which way do i face
        if(this.robot.body.velocity.x > 0){
            this.robot.scale.x = 1; // facing right
        }
        else{
            this.robot.scale.x = -1;
        }
        
        
        //which way do i go
        if(cursors.left.isDown){
            this.robot.body.velocity.x=-250
        }
        
                if(cursors.right.isDown){
            this.robot.body.velocity.x=250
        }

    }

}