const { app, BrowserWindow } = require('electron')

const init = () => {
    const width = 880
    const heigth = 580

    const window = new BrowserWindow({
        width: width,
        height: heigth,
        minWidth: width,
        minHeight: heigth,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            nativeWindowOpen: true
        }
    })

    window.removeMenu()

    window.loadFile('./index.html')
}

app.whenReady().then(init)