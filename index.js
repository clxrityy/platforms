const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

// Scaled canvas so the image is at the bottom
const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4
}

const floorCollisions2D = []
// For every 36 tiles (length of map), create new sub array
// Should be 27 rows of data that are 36 tiles wide
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
// Loop through collision array to render collision blocks
floorCollisions2D.forEach((row, y) => {
    // 'y' referenced above is the row index (y axis)
    row.forEach((symbol, x) => {
        // 'x' referenced above is the column index (x axis)
        if (symbol === 202) {
            // '202' is the data value for a collision block (reference: './js/data/collisions.js')
            collisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16, // '16' is the size of the collision block (reference: './js/classes/CollisionBlock.js')
                }
            }))
        }
    })
});

// Platform collisions
// Same functionality as floor collisions
const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
// Loop through collision array to render collision blocks
platformCollisions2D.forEach((row, y) => {
    // 'y' referenced above is the row index (y axis)
    row.forEach((symbol, x) => {
        // 'x' referenced above is the column index (x axis)
        if (symbol === 202) {
            // '202' is the data value for a collision block (reference: './js/data/collisions.js')
            platformCollisionBlocks.push(new CollisionBlock({
                position: {
                    x: x * 16,
                    y: y * 16, // '16' is the size of the collision block (reference: './js/classes/CollisionBlock.js')
                },
                height: 4
            }))
        }
    })
});


const gravity = 0.1

const player = new Player({
    position: {
        x: 100,
        y: 300,
    },
    // Pass in collision blocks
    // Same thing as 'collisionBlocks: collisionBlocks,'
    collisionBlocks,
    platformCollisionBlocks,
    imageSrc: './images/warrior/Idle.png',
    frameRate: 8,
    // The different images for the player
    animations: {
        Idle: {
            imageSrc: './images/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        Run: {
            imageSrc: './images/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        Jump: {
            imageSrc: './images/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        Fall: {
            imageSrc: './images/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        FallLeft: {
            imageSrc: './images/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
        RunLeft: {
            imageSrc: './images/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5,
        },
        IdleLeft: {
            imageSrc: './images/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3,
        },
        JumpLeft: {
            imageSrc: './images/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3,
        },
    }
})

const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}


// Infinite animation loop
function animate() {
    window.requestAnimationFrame(animate)
    // Put draw & update functions within infinite animation
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    // Scale the background (4x) call 'c.save()'&' c.restore()' so background isn't scaled infinitely
    c.save()
    c.scale(4, 4)
    // // Translate to the bottom
    c.translate(camera.position.x, camera.position.y)
    // Add background first
    background.update()
    // Render collision blocks (Needs to be within the scale functionality so it renders like the map)
    // collisionBlocks.forEach((collisionBlock) => {
    //     collisionBlock.update()
    // })
    // // Platform blocks
    // platformCollisionBlocks.forEach((block) => {
    //     block.update()
    // })

    player.checkForHorizontalCanvasCollision()
    player.update()

    // Keep x velocity at 0 for every frame
    player.velocity.x = 0
    // Movement
    // Right
    if (keys.d.pressed) {
        // Swap sprite
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({ canvas, camera })
        // Left
    } else if (keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({ camera, canvas })
    } else if (player.velocity.y === 0) {

        if (player.lastDirection === 'right') {
            player.switchSprite('Idle')
        } else {
            player.switchSprite('IdleLeft')
        }
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraDown({ camera, canvas })
        if (player.lastDirection === 'right') {
            player.switchSprite('Jump')
        } else {
            player.switchSprite('JumpLeft')
        }
    } else if (player.velocity.y > 0) {
        player.shouldPanCameraUp({ camera, canvas })
        if (player.lastDirection === 'right') {
            player.switchSprite('Fall')
        }
        else {
            player.switchSprite('FallLeft')
        }
    }

    c.restore()
}

// Calculate keys are clicked for movement (stop players from just constantly moving)
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    w: {
        pressed: false
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './images/background.png',
})

animate()

// Track keys pressed for movement
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Right
        case 'd':
            keys.d.pressed = true
            break
        // Left
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = -4
            break
    }
})
// Track when stop pressing keys
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        // Right
        case 'd':
            keys.d.pressed = false
            break
        // Left
        case 'a':
            keys.a.pressed = false
            break
    }
})