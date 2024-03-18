const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Create the D20 geometry
const geometry = new THREE.IcosahedronGeometry(1, 0)

// Create the material with a texture loader for the dice faces
const textureLoader = new THREE.TextureLoader()
const material = new THREE.MeshBasicMaterial({
	map: textureLoader.load("./dice_texture.png"),
})

// Create the D20 mesh
const dice = new THREE.Mesh(geometry, material)
scene.add(dice)

// Position the camera and dice
camera.position.z = 5
dice.position.set(0, 0, 0)

// Set up variables for animation and dice state
let isRolling = false
let currentRotation = 0
let targetRotation = 0
let currentFace = 1

// Function to roll the dice
function rollDice() {
	if (!isRolling) {
		isRolling = true
		targetRotation = Math.random() * Math.PI * 2 // Random rotation angle
		currentFace = Math.floor(Math.random() * 20) + 1 // Random face number
	}
}

// Event listener for clicking on the dice
renderer.domElement.addEventListener("click", rollDice)

// Animation loop
function animate() {
	requestAnimationFrame(animate)

	if (isRolling) {
		currentRotation += (targetRotation - currentRotation) * 0.1 // Smoothly rotate towards target
		dice.rotation.x = currentRotation
		dice.rotation.y = currentRotation

		if (Math.abs(targetRotation - currentRotation) < 0.01) {
			isRolling = false
			dice.rotation.x = targetRotation
			dice.rotation.y = targetRotation

			// Update the dice face texture based on currentFace
			const faceIndex = currentFace - 1
			const faceUV = {
				x: (faceIndex % 4) / 4,
				y: Math.floor(faceIndex / 4) / 5,
			}
			material.map.offset.set(faceUV.x, faceUV.y)
			material.map.needsUpdate = true
		}
	}

	renderer.render(scene, camera)
}

animate()
