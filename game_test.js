const config = {
  type: Phaser.AUTO,
  width: 1500,
  height: 700,
  backgroundColor: "#25131a",
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tileset", "asset/map_asset/Dungeon_Tileset.png"); // Tileset image
  this.load.tilemapTiledJSON("map", "asset/map_asset/map1.tmj");     // Tiled map (.tmj)
  this.load.spritesheet("fighter", "asset/fighter_walk_idle.png", {
    frameWidth: 128.25,
    frameHeight: 130,
  });
}

function create() {
  const map = this.make.tilemap({ key: "map" });

  // Match the exact name of your tileset in Tiled
  const tileset = map.addTilesetImage("Dungeon1", "tileset");

  // Create map layers
  const layer1 = map.createLayer("Floor", tileset, 0, 0);
  const layer2 = map.createLayer("Wall", tileset, 0, 0);
  const layer3 = map.createLayer("Decoration", tileset, 0, 0);

  this.layers = { layer1, layer2, layer3 };

  // Create the player
  this.player = this.physics.add.sprite(370, 250, "fighter");
  this.player.setScale(0.15); // Adjust player size

  // Set a smaller hitbox for the player
  const hitboxWidth = 30;  // Adjust width of the hitbox
  const hitboxHeight = 80; // Adjust height of the hitbox
  const offsetX = 60;      // Horizontal offset
  const offsetY = 50;      // Vertical offset
  this.player.body.setSize(hitboxWidth, hitboxHeight).setOffset(offsetX, offsetY);

  // Determine collidable tiles from tile properties
  const collidableTiles = [];
  const allProperties = map.tilesets[0].tileProperties;
  const firstGid = map.tilesets[0].firstgid;

  for (let key in allProperties) {
    if (allProperties[key].passable === false) {
      collidableTiles.push(firstGid + Number(key));
    }
  }

  // Set collision for wall layer
  layer2.setCollision(collidableTiles);
  this.physics.add.collider(this.player, layer2);

  // Debug view (optional)
  layer2.renderDebug(this.add.graphics(), {
    tileColor: null,
    collidingTileColor: new Phaser.Display.Color(255, 0, 0, 100),
    faceColor: new Phaser.Display.Color(0, 255, 0, 255),
  });

  // Use camera zoom instead of scale
  const zoomFactor = 7;
  this.cameras.main.setZoom(zoomFactor);
  this.cameras.main.startFollow(this.player);
  this.cameras.main.setBounds(zoomFactor, 100, map.widthInPixels, map.heightInPixels);

  // Controls
  this.cursors = this.input.keyboard.createCursorKeys();

  // Create a graphics object for the player's bounding box
  this.playerBounds = this.add.graphics();
  this.playerBounds.lineStyle(2, 0xff0000, 1); // Red outline for the bounding box
}

function update() {
  const speed = 100;
  const cursors = this.cursors;
  const player = this.player;

  player.setVelocity(0);

  if (cursors.left.isDown) {
    player.setVelocityX(-speed);
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
  }

  if (cursors.up.isDown) {
    player.setVelocityY(-speed);
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
  }

  // Update the player's bounding box
  // this.playerBounds.clear();
  // this.playerBounds.lineStyle(2, 0xff0000, 1); // Red outline for the bounding box
  // this.playerBounds.strokeRect(
  //   this.player.getBounds().x,
  //   this.player.getBounds().y,
  //   this.player.getBounds().width,
  //   this.player.getBounds().height
  // );

}