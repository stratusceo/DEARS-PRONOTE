const localStorage = window.localStorage
const Assets = require('./Assets')

const infos = document.getElementById('infos')


const init = () => {
    // Setup title

    fetch(`http://51.83.68.160:3002/config/${Assets.account}`).then(async response => {
        const json = await response.json()
        document.title = `${json.datas.name} - Préférences`
    })

    // Setup RAM value

    if (localStorage.getItem('min_ram_value')) document.getElementById('min_ram_value').value = localStorage.getItem('min_ram_value')
    if (localStorage.getItem('max_ram_value')) document.getElementById('max_ram_value').value = localStorage.getItem('max_ram_value')

    // Setup handle click events

    document.querySelector('.submit').onclick = () => handleClick()

    document.onchange = () => infos.innerHTML = ''

    document.onkeypress = e => {
        infos.innerHTML = ''

        if (e.keyCode === 13) {
            handleClick()
        }
    }
}

const handleClick = () => {
    const min_ram = document.getElementById('min_ram_value').value
    const max_ram = document.getElementById('max_ram_value').value
    
    localStorage.setItem('min_ram_value', min_ram)
    localStorage.setItem('max_ram_value', max_ram)

    infos.innerHTML = 'Données sauvegardées'
}

init()