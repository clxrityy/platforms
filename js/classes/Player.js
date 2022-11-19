// Extend the player class to Sprite class since we utilize image sources within Sprite.js
class Player extends Sprite {
    constructor({ position, collisionBlocks, platformCollisionBlocks, imageSrc, frameRate, scale = 0.5, animations }) {
        super({
            imageSrc,
            frameRate,
            scale,
        })
        this.position = position
        // Velocity for gravity to take effect 
        this.velocity = {
            x: 0,
            y: 1
        }
        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
        this.hitbox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 10,
            height: 10,
        }
        this.animations = animations
        this.lastDirection = 'right' // Default pictures are facing right. Use this method to switch where the player is facing with movement in index.js

        for (let key in this.animations) {
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }

        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
    }
    // Switch the images based on movement
    switchSprite(key) {
        if (this.image === this.animations[key].image || !this.loaded) {
            return
        }
        this.currentFrame = 0 // So that the frame you're on when switching starts over
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    updateCamerabox() {
        this.camerabox = {
            position: {
                x: this.position.x - 50,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
    }

    checkForHorizontalCanvasCollision() {
        if (
            this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
            this.hitbox.position.x + this.velocity.x <= 0
        ) {
            this.velocity.x = 0
        }
    }

    shouldPanCameraToTheLeft({ canvas, camera }) {
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width

        const scaledDownCanvasWidth = canvas.width / 4

        if (cameraboxRightSide >= 576) return

        if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraToTheRight({ canvas, camera }) {
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraDown({ canvas, camera }) {
        if (this.camerabox.position.y + this.velocity.y <= 0) return

        if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanCameraUp({ canvas, camera }) {
        if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return

        const scaledCanvasHeight = canvas.height / 4

        if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
            camera.position.y -= this.velocity.y
        }
    }

    update() {
        this.updateFrames()
        this.updateHitbox()

        this.updateCamerabox()

        // Drawing out the camera box
        // c.fillStyle = 'rgba(0, 0, 255, 0.2)'
        // c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)

        // This part of the code will be removed, but I kept it included because it's where I could see the full fledge size of the player image (it was big)
        // c.fillStyle = 'rgba(0, 255, 0, 0.5)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // // Hitbox
        // c.fillStyle = 'rgba(255, 0, 0, 0.5)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)


        this.draw()
        // Movement
        // Adjust velocity for movement
        this.position.x += this.velocity.x
        // Update hitbox before collision detection
        this.updateHitbox()
        // Horizontal collision needs to be above the gravity function (Isaac Newton actually said this)
        this.checkForHorizontalCollisions()
        this.applyGravity()
        // Update hitbox before collision detection
        this.updateHitbox()
        // Collision detection
        this.checkForVerticalCollisions()

    }

    // The hitbox for the player
    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26,
            },
            width: 14,
            height: 27
        }
    }


    // Horizontal collisions placed ABOVE the gravity function (because screw gravity, we're just moving left & right)
    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // Collision detection
            // (Find collision function in './js/utils.js')
            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {

                // If player moving to the right
                if (this.velocity.x > 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.wdth

                    // Set the player position so player can't move right past collision
                    // Consider the '0.01' as a buffer
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
                // If player moving to the left
                if (this.velocity.x < 0) {
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x

                    // Set the player position so player can't move left past collision
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }


    // Gravity
    applyGravity() {
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            // Collision detection
            // (Find collision function in './js/utils.js')
            if (
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
            ) {

                // If the player is falling
                if (this.velocity.y > 0) {
                    this.velocity.y = 0

                    // This is like, the relative space between the image & the hitbox
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    // Set position to top of collision block (minus offset) (also minus 0.01 so it's REALLY not colliding <3)
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }
                // If moving upward
                if (this.velocity.y < 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    // Change position to bottom of collision block
                    // Notice how changing the -'s to +'s
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    break
                }
            }
        }

        // PLATFORM collision blocks
        for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
            const platformCollisionBlock = this.platformCollisionBlocks[i]

            // Collision detection
            // (Find platformCollision function in './js/utils.js')
            if (
                platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlock,
                })
            ) {


                if (this.velocity.y > 0) {
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = platformCollisionBlock.position.y - offset - 0.01
                    break
                }
            }
        }
    }

}