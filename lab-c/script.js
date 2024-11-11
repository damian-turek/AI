
const userMap = L.map('mapBox').setView([51.505, -0.09], 13)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(userMap)

document.querySelector('#centerBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                userMap.setView([latitude, longitude], 13)
            },
            (error) => {
                console.error("Location retrieval error:", error)
                alert("Could not retrieve your location.")
            }
        )
    } else {
        alert("Geolocation is not supported in this browser.")
    }
})

function generatePuzzlePieces(canvas) {
    const rows = 4, cols = 4
    const puzzleArea = document.querySelector('#puzzleBox')
    const pieces = []
    const pieceWidth = canvas.width / cols
    const pieceHeight = canvas.height / rows

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const newCanvas = document.createElement('canvas')
            newCanvas.width = pieceWidth
            newCanvas.height = pieceHeight
            const ctx = newCanvas.getContext('2d')

            ctx.drawImage(canvas, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight)

            pieces.push({
                canvas: newCanvas,
                index: row * cols + col
            })
        }
    }

    shufflePieces(pieces)

    puzzleArea.innerHTML = ''
    pieces.forEach(piece => {
        const imageElement = document.createElement('img')
        imageElement.src = piece.canvas.toDataURL()
        imageElement.classList.add('puzzle-piece')
        imageElement.draggable = true
        imageElement.dataset.index = piece.index
        imageElement.addEventListener('dragstart', () => {
            imageElement.classList.add('dragging')
        })
        imageElement.addEventListener('dragend', () => {
            imageElement.classList.remove('dragging')
        })
        puzzleArea.appendChild(imageElement)
    })
}

function shufflePieces(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
    }
}

document.querySelector('#captureBtn').addEventListener('click', () => {
    document.querySelector('#solutionBox').innerHTML = ''
    userMap.invalidateSize()
    setTimeout(() => {
        leafletImage(userMap, function(error, canvas) {
            if (error) {
                console.error("Error capturing map:", error)
                return
            }
            const imageContainer = document.querySelector('#imageBox')
            imageContainer.innerHTML = ''
            imageContainer.appendChild(canvas)
            canvas.style.width = '100%'
            canvas.style.height = '100%'

            generatePuzzlePieces(canvas)
        })
    }, 200)
})

const solutionArea = document.querySelector('#solutionBox')

solutionArea.addEventListener('dragover', (event) => {
    event.preventDefault()
})

solutionArea.addEventListener('drop', (event) => {
    event.preventDefault()
    const draggedPiece = document.querySelector('.dragging')
    if (draggedPiece) {
        const pieceClone = draggedPiece.cloneNode(true)
        pieceClone.style.width = '100%'
        pieceClone.style.height = 'auto'
        pieceClone.classList.remove('dragging')

        const rect = solutionArea.getBoundingClientRect()
        const posX = event.clientX - rect.left
        const posY = event.clientY - rect.top

        const colIndex = Math.floor(posX / (solutionArea.clientWidth / 4))
        const rowIndex = Math.floor(posY / (solutionArea.clientHeight / 4))

        const existingPiece = solutionArea.querySelector(`img[data-row="${rowIndex}"][data-col="${colIndex}"]`)
        if (existingPiece) {
            existingPiece.style.opacity = 0
            existingPiece.remove()
        }

        pieceClone.dataset.row = rowIndex
        pieceClone.dataset.col = colIndex
        pieceClone.style.gridRowStart = rowIndex + 1
        pieceClone.style.gridColumnStart = colIndex + 1

        solutionArea.appendChild(pieceClone)
        draggedPiece.remove()

        checkPuzzleCompletion()
    }
})

function checkPuzzleCompletion() {
    const puzzlePieces = solutionArea.querySelectorAll('img')
    let isComplete = true

    puzzlePieces.forEach(piece => {
        const row = parseInt(piece.dataset.row)
        const col = parseInt(piece.dataset.col)
        const index = parseInt(piece.dataset.index)

        const expectedIndex = row * 4 + col
        if (index !== expectedIndex) {
            isComplete = false
        }
    })

    if (isComplete && puzzlePieces.length === 16) {
        console.log("Congratulations! Puzzle completed.")
        if (Notification.permission === "granted") {
            new Notification("Congratulations! Puzzle completed!")
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Congratulations! Puzzle completed!")
                }
            })
        }
    }
}
