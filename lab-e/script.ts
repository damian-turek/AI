let mainStyle = 'style1'
const styles: Record<string, string> = {
    style1: 'dist/style1.css',
    style2: 'dist/style2.css',
    style3: 'dist/style3.css'
}

const setStyle = (style: string) => {
    const linkElement = document.createElement('link')
    mainStyle = style

    linkElement.href = styles[mainStyle]
    linkElement.rel = 'stylesheet'

    const link = document.getElementById('styleSheet')
    if (link) link.remove()

    document.head.appendChild(linkElement)
}

const createStyleButtons = (): void => {
    const buttonContainer = document.getElementById('styleButtons')!

    for (const [style] of Object.entries(styles)) {
        const button = document.createElement('button')

        button.textContent = `Use ${style}`
        button.classList.add('style-button')
        button.onclick = () => setStyle(style)
        buttonContainer.appendChild(button)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createStyleButtons()
})
