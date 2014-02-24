// The Grid component allows an element to be Located
// on a grid of tiles
Crafty.c('Grid', {
  init: function () {
    this.attr({
      w: Game.map_grid.tile.width,
      h: Game.map_grid.tile.height
    })
  },

  // Locate this entity at the given position on the grid
  at: function (x, y) {
    if (x === undefined && y === undefined) {
      return { x: this.x / Game.map_grid.tile.width, y: this.y / Game.map_grid.tile.height };
    } else {
      this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
      return this;
    }
  }
});

// An "Actor" is an entity that is drawn in 2D on canvas
// via our logical coordinate grid
Crafty.c('Actor', {
  init: function () {
    this.requires('2D, Canvas, Grid');
  }
});

// A Block is just an Actor with a certain sprite
Crafty.c('Block', {
  init: function () {
    this.requires('Actor, Solid, Color')
        .color('#638e22');
  }
});

Crafty.c('Apple', {
  init: function () {
    this.requires('Actor, Color')
        .color('#ff0000');
  },

  collect: function () {
    this.destroy();
  }
});

Crafty.c('Snake', {
  init: function () {
    this.attributes = {xDirection: 0, yDirection: 0, size: 3};

    this.requires('Actor, Keyboard, Collision, Color')
        .bind('EnterFrame', function (data) {
          this.x += this.attributes.xDirection;
          this.y += this.attributes.yDirection;
        })
        .bind('KeyDown', this.handleInput)
        .onHit('Apple', this.grow)
        .color('#e1811d')
        .stopOnSolids();
  },

  handleInput: function (e) {
    if (e.key === Crafty.keys.DOWN_ARROW) {
      this.attributes.yDirection = 16;
      this.attributes.xDirection = 0;
    } else if (e.key === Crafty.keys.UP_ARROW) {
      this.attributes.yDirection = -16;
      this.attributes.xDirection = 0;
    } else if (e.key === Crafty.keys.LEFT_ARROW) {
      this.attributes.yDirection = 0;
      this.attributes.xDirection = -16;
    } else if (e.key === Crafty.keys.RIGHT_ARROW) {
      this.attributes.yDirection = 0;
      this.attributes.xDirection = 16;
    }
  },

  grow: function (entities) {
    this.attributes.size++;
    entities[0].obj.collect();
  },

  // Registers a stop-movement function to be called when
  // this entity hits an entity with the "Solid" component
  stopOnSolids: function () {
    this.onHit('Solid', this.stopMovement);

    return this;
  },

  // Stops the movement
  stopMovement: function () {
    this.x -= this.attributes.xDirection
    this.y -= this.attributes.yDirection;

    this.attributes.yDirection = 0;
    this.attributes.xDirection = 0;
  }
});
