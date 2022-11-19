function collision({
    object1,
    object2
}) {
    return (
        // If value of the bottom of the player greater than or equal to the top of collision block
        object1.position.y + object1.height >= object2.position.y &&
        // AND if top of the player less than bottom of collision block
        object1.position.y <= object2.position.y + object2.height &&
        // Left side of the player & right side of collision block
        object1.position.x <= object2.position.x + object2.width &&
        // Right side of the player & left side of collision block
        object1.position.x + object1.width >= object2.position.x
    )
}

function platformCollision({
    object1,
    object2
}) {
    return (
        // If value of the bottom of the player greater than or equal to the top of collision block
        object1.position.y + object1.height >= object2.position.y &&
        // AND if top of the player less than bottom of collision block
        object1.position.y + object1.height <= object2.position.y + object2.height &&
        // Left side of the player & right side of collision block
        object1.position.x <= object2.position.x + object2.width &&
        // Right side of the player & left side of collision block
        object1.position.x + object1.width >= object2.position.x
    )
}