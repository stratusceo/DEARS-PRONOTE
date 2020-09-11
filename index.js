const { app, BrowserWindow } = require('electron')

const init = () => {
    const width = 850
    const heigth = 550

    const window = new BrowserWindow({
        width: width,
        height: heigth,
        minWidth: width,
        minHeight: heigth,
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    window.loadFile('./index.html')
}

app.whenReady().then(init)