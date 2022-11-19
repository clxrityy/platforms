class Sprite {
    // Pass constructor methods in an object so that they're labeled & can be in any order
    constructor({ position, imageSrc, frameRate = 1, frameBuffer = 3, scale = 1 }) {
        this.position = position
        this.scale = scale
        this.loaded = false
        this.image = new Image()
        // Set the size of the sprite to be the size of the image
        // Has to be within the 'onload()' function because an image takes time to load I guess. Probably want to make sure the image is fully loaded before determining parameters for it. Whatever.
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate) * this.scale // Multiply by scale so the image can be scaled (view example of how it's scaled in Player.js)
            this.height = this.image.height * this.scale
            this.loaded = true
        }
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer // Slow down speed of frame movement
        this.elapsedFrames = 0 // How many frames have we gone through?
    }

    draw() {
        // If no image specified, then no errors
        if (!this.image) return

        // Crop the image
        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate, // Frame rate = how many frames within the image
            height: this.image.height,
        }

        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )
    }

    update() {
        this.draw()
        this.updateFrames()
    }

    // Loop through frames to create the visual of movement
    updateFrames() {
        this.elapsedFrames++
        // elapsedFrames & frameBuffer make the movement through the frames nicer. I don't know how to explain the logic soz
        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++
            } else {
                this.currentFrame = 0
            }
        }
    }
}