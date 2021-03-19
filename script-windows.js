const Assets = require('./Assets')

const handleSetupOptions = async () => {
    return new Promise(resolve => {
        const fetch = require('node-fetch')

        fetch(`http://51.83.68.160:3002/config/${Assets.account}`).then(async response => {
            const json = await response.json()

            // Setup Discord RPC

            if (json.rpc) {
                const RPC = require('discord-rpc')
                const rpc = new RPC.Client({
                    transport: 'ipc'
                })

                rpc.on('ready', () => {
                    rpc.setActivity({
                        details: json.rpc.details,
                        state: json.rpc.state,
                        startTimestamp: new Date(),
                        largeImageKey: json.rpc.nameLargeImage,
                        largeImageText: json.rpc.textLargeImage,
                        smallImageKey: json.rpc.nameSmallImage,
                        smallImageText: json.rpc.textSmallImage
                    })
                })

                rpc.login({
                    clientId: json.rpc.clientID
                })
            }

            // Setup stats

            if (json.stats) {
                fetch(`http://51.83.68.160:3002/update/${Assets.account}/visitors/${new Date().getTime()}`).then(async response => {
                    const json = await response.json()

                    if (json.message) {
                        console.error(json.message)
                    } else {
                        console.log('visitors updated')
                    }

                    resolve(true)
                }).catch(error => console.error('STATS ERROR : ', error))
            } else {
                resolve(true)
            }
        }).catch(() => resolve(true))
    })
}

handleSetupOptions().then(() => console.log('options updated'))
                    .catch(error => console.error(error))

const handleInitStyle = async () => {
    const Assets = require('./Assets')

    const localStorage = window.localStorage

    const style = localStorage.getItem('style')

    document.title = Assets.title

    // Init style

    if (style) {
        const element = document.createElement('style')
        
        element.innerHTML = style

        document.body.appendChild(element)
    }

    return new Promise(resolve => {
        const fetch = require('node-fetch')

        // Init style

        fetch(`http://51.83.68.160:3002/config/${Assets.account}`).then(async response => {
            const jsonConfig = await response.json()

            if (jsonConfig.datas.theme) {
                fetch(`http://51.83.68.160:3002/style/${jsonConfig.datas.theme}`).then(async response => {
                    const json = await response.json()

                    const initHTML = async () => {
                        return new Promise(resolve => {
                            document.body.innerHTML = jsonConfig.datas.html_premium ? jsonConfig.datas.html_premium : json.code_html_premium
                            resolve(true)
                        })
                    }

                    initHTML().then(() => {
                        /*
                        
                            Options
                        
                        */

                        // Setup Networks

                        const containerNetworks = document.createElement('div')

                        if (jsonConfig.datas.networks) {
                            // Create buttons

                            const style = document.createElement('style')

                            const instagram = document.createElement('img')
                            const twitter = document.createElement('img')
                            const discord = document.createElement('img')

                            containerNetworks.classList.add('networks-container')

                            style.innerHTML = '.networks-container{position:absolute;display:flex;align-items:center;flex-direction:row;margin:10px}.networks-element{filter:drop-shadow(0 0 10px rgba(255,255,255,.35));margin:0 5px;width:32px!important}.networks-element:hover{cursor:pointer}'

                            const shell = require('electron').shell

                            instagram.src = 'https://cdn.discordapp.com/attachments/793382333339271178/811587236633640990/instagram.png'
                            instagram.onclick = () => shell.openExternal(`https://instagram.com/${jsonConfig.datas.networks.value_instagram}`)
                            instagram.classList.add('networks-element')
                            instagram.alt = 'Instagram icon'
                            instagram.draggable = false

                            twitter.src = 'https://cdn.discordapp.com/attachments/793382333339271178/811578519137550346/2021_Twitter_logo_-_blue.png'
                            twitter.onclick = () => shell.openExternal(`https://twitter.com/${jsonConfig.datas.networks.value_twitter}`)
                            twitter.classList.add('networks-element')
                            twitter.alt = 'Twitter icon'
                            twitter.draggable = false

                            discord.src = 'https://cdn.discordapp.com/attachments/793382333339271178/811586188438798377/Discord-Logo-Color.png'
                            discord.onclick = () => shell.openExternal(`${jsonConfig.datas.networks.value_discord}`)
                            discord.classList.add('networks-element')
                            discord.alt = 'Discord icon'
                            discord.draggable = false

                            if (jsonConfig.datas.networks.value_instagram && jsonConfig.datas.networks.value_instagram !== '') containerNetworks.appendChild(instagram)
                            if (jsonConfig.datas.networks.value_twitter && jsonConfig.datas.networks.value_twitter !== '') containerNetworks.appendChild(twitter)
                            if (jsonConfig.datas.networks.value_discord && jsonConfig.datas.networks.value_discord !== '') containerNetworks.appendChild(discord)

                            const numberOfChildren = containerNetworks.getElementsByTagName('*').length

                            switch (jsonConfig.datas.networks.coord) {
                                case 1:
                                    switch (numberOfChildren) {
                                        case 1:
                                            containerNetworks.style.transform = 'translateX(820px)'
                                        break

                                        case 2:
                                            containerNetworks.style.transform = 'translateX(780px)'
                                        break

                                        case 3:
                                            containerNetworks.style.transform = 'translateX(735px)'
                                        break
                                    
                                        default:
                                        break
                                    }
                                break

                                case 2:
                                    containerNetworks.style.transform = 'translateY(495px)'
                                break

                                case 3:
                                    switch (numberOfChildren) {
                                        case 1:
                                            containerNetworks.style.transform = 'translateX(820px) translateY(495px)'
                                        break

                                        case 2:
                                            containerNetworks.style.transform = 'translateX(780px) translateY(495px)'
                                        break

                                        case 3:
                                            containerNetworks.style.transform = 'translateX(735px) translateY(495px)'
                                        break
                                    
                                        default:
                                        break
                                    }
                                break
                            
                                default:
                                break
                            }

                            document.body.append(containerNetworks, style)

                            console.log('networks updated')
                        }

                        // Setup settings

                        if (jsonConfig.datas.settings) {
                            const container = document.createElement('div')
                            const style = document.createElement('style')

                            const element = document.createElement('img')

                            container.classList.add('settings-container')

                            switch (jsonConfig.datas.settings.coord) {
                                case 0:
                                    if (containerNetworks && !(containerNetworks.style.transform.includes('translateX') && containerNetworks.style.transform.includes('translateY'))) container.style.transform = 'translateY(40px)'
                                break

                                case 1:
                                    if (containerNetworks && containerNetworks.style.transform.includes('translateX') && (!containerNetworks.style.transform.includes('translateY'))) {
                                        container.style.transform = 'translateX(820px) translateY(40px)'
                                    } else {
                                        container.style.transform = 'translateX(820px)'
                                    }
                                break

                                case 2:
                                    if (containerNetworks && (!containerNetworks.style.transform.includes('translateX')) && containerNetworks.style.transform.includes('translateY')) {
                                        container.style.transform = 'translateY(455px)'
                                    } else {
                                        container.style.transform = 'translateY(495px)'
                                    }
                                break

                                case 3:
                                    if (containerNetworks && containerNetworks.style.transform.includes('translateX') && containerNetworks.style.transform.includes('translateY')) {
                                        container.style.transform = 'translateX(820px) translateY(455px)'
                                    } else {
                                        container.style.transform = 'translateX(820px) translateY(495px)'
                                    }
                                break
                            
                                default:
                                break
                            }

                            style.innerHTML = '.settings-container{position:absolute;margin:10px}img.settings-element{filter:drop-shadow(0 0 10px rgba(255,255,255,.35));z-index:2;margin:0 5px;width:32px!important}img.settings-element:hover{cursor:pointer}'

                            const shell = require('electron').shell

                            element.src = 'https://cdn.discordapp.com/attachments/793382333339271178/814144636297281579/mechanical-gears--2.png'
                            element.onclick = () => {
                                const remote = require('electron').remote
                                const BrowserWindow = remote.BrowserWindow
                                const window = new BrowserWindow({
                                    width: 600,
                                    height: 300,
                                    resizable: false,
                                    webPreferences: {
                                        nodeIntegration: true
                                    }
                                })
                              
                                window.loadFile('./settings.html')
                            }
                            element.classList.add('settings-element')
                            element.alt = 'Settings icon'
                            element.draggable = false

                            container.appendChild(element)

                            document.body.append(container, style)
                        }


                        /*
                        
                            Launcher
                        
                        */

                        if (localStorage.getItem('account_premium')) {
                            const account = localStorage.getItem('account_premium').split(';')
                
                            const username = document.getElementById('username')
                            const password = document.getElementById('password')
                            const save = document.getElementById('save')
                
                            if (account[0] !== 'undefined') {
                                username.value = account[0]
                                password.value = account[1]
                
                                save.checked = true
                            } else {
                                username.value = ''
                                password.value = ''
                
                                save.checked = false
                            }
                        }
                        
                        if (style) {
                            if (style !== json.code) {
                                localStorage.setItem('style', json.code)

                                const element = document.createElement('style')
            
                                element.innerHTML = json.code
        
                                const ref = document.querySelector('script')
        
                                ref.parentNode.insertBefore(element, ref)
                            } else {
                                const element = document.createElement('style')
            
                                element.innerHTML = style

                                const ref = document.querySelector('script')

                                ref.parentNode.insertBefore(element, ref)
                            }
                        } else {
                            localStorage.setItem('style', json.code)

                            const element = document.createElement('style')
        
                            element.innerHTML = json.code

                            const ref = document.querySelector('script')

                            ref.parentNode.insertBefore(element, ref)
                        }
            
                        // Init assets
                        
                        document.getElementById('title').innerHTML = jsonConfig.datas.name
            
                        document.getElementById('large_icon').src = jsonConfig.datas.large_icon
                        document.getElementById('icon').src = jsonConfig.datas.icon

                        resolve(jsonConfig)
                    })
                })
            } else {
                // User does not have launchers
                document.body.innerHTML = `<header><div><h2>Oups !</h2><p>On dirait que l\'organisation ${Assets.account} n\'a plus de launchers de configuré</p><a href=https://launcherauto.com>Configurer son launcher sur LauncherAuto</a></div></header><style>@font-face{font-family:Montserrat-SemiBold;src:url(https://cdn.discordapp.com/attachments/793382333339271178/801398406912016394/Montserrat-SemiBold.otf)}@font-face{font-family:Montserrat-Medium;src:url(https://cdn.discordapp.com/attachments/793382333339271178/801398331179532348/Montserrat-Medium.otf)}@font-face{font-family:Montserrat-Regular;src:url(https://cdn.discordapp.com/attachments/793382333339271178/801398419783942214/Montserrat-Regular.otf)}header{display:grid;place-items:center;text-align:center;width:100vw;height:100vh}h2{font-family:Montserrat-SemiBold;font-size:45px;color:#0779e3;margin:10px 0}p{font-family:Montserrat-Medium;font-style:italic;font-size:25px;color:#00b4f5;margin:0 0 10px 0}a{font-family:Montserrat-Regular;color:rgba(0,0,0,.8);text-decoration:none;margin:0}a:hover{text-decoration:underline}</style>`
            }
        })
    })
}

handleInitStyle().then(async data => {
    const localStorage = window.localStorage

    const handleClick = async () => {
        // Launch game

        console.log('clicked')

        const infos = document.getElementById('infos')

        const username = document.getElementById('username').value
        const password = document.getElementById('password').value
        const save = document.getElementById('save')

        infos.innerHTML = 'Veuillez patienter...'

        if (username !== '' && password !== '') {
            infos.innerHTML = 'Donnés en cours de traitement...'

            localStorage.setItem('account_premium', `${save.checked ? `${username};${password}` : undefined}`)

            console.log('launching')

            // Check if user has stats's option

            fetch(`http://51.83.68.160:3002/config/${Assets.account}`).then(async response => {
                const json = await response.json()

                // Setup stats

                if (json.stats) {
                    fetch(`http://51.83.68.160:3002/update/${Assets.account}/launches/${new Date().getTime()}`).then(async response => {
                        const json = await response.json()

                        if (json.message) {
                            console.error(json.message)
                        } else {
                            console.log('launches updated')
                        }
                    }).catch(error => console.error('STATS ERROR UPDATE : ', error))
                }
            }).catch(error => console.error('CONFIG ERROR : ', error))

            // Launch game

            const { Client, Authenticator } = require('minecraft-launcher-core')

            const showMCLCInformations = (launcher, options) => {
                // Show loading informations

                infos.innerHTML = 'Lancement en cours...'
        
                console.log('launch', options)
                
                launcher.on('debug', e => console.log(`debug : `, e))
                launcher.on('data', e => console.log(`data : `, e))
                launcher.on('arguments', e => console.log(`arguments : `, e))
                launcher.on('close', e => console.log(`close : `, e))
                launcher.on('download', e => console.log(`download : `, e))
                launcher.on('package-extract', e => console.log(`package-extract : `, e))
                launcher.on('download-status', e => {
                    console.log(`download-status : `, e)

                    if (e.type === 'client-package') {
                        infos.innerHTML = `Téléchargement du modpack (${e.current}/${e.total})`
                    } else if (e.type === 'assets') {
                        infos.innerHTML = `Téléchargement des assets (${e.current}/${e.total})`
                    } else if (e.type === 'class') {
                        infos.innerHTML = `Téléchargement des classes (${e.current}/${e.total})`
                    }
                })
                launcher.on('progress', e => {
                    if (e.type === 'assets' || e.type === 'assets-copy') {
                        if (e.task === 0) {
                            infos.innerHTML = 'Lancement du jeu...'
                        } else {
                            infos.innerHTML = `Téléchargement des assets (${e.task}/${e.total})`
                        }
                    } else if (e.type === 'natives') {
                        infos.innerHTML = `Téléchargement des natives (${e.task}/${e.total})`;
                    } else if (e.type === 'forge') {
                        infos.innerHTML = `Mise en place de forge (${e.task}/${e.total})`;
                    } else if (e.type === 'client-package') {
                        infos.innerHTML = `Téléchargement du modpack (${e.task}/${e.total})`;
                    } else if (e.type === 'librairies') {
                        infos.innerHTML = `Vérification des librairies (${e.task}/${e.total})`;
                    } else if (e.type === 'classes') {
                        infos.innerHTML = `Compilation des classes (${e.task}/${e.total})`;
                    }

                    console.log(`progression : ${e.type} ${e.task} ${e.total}`)
                })
            }

            const handleLaunch = response => {
                const Assets = require('./Assets')
                const launcher = new Client()

                if (data.datas.server && data.datas.server.host !== '') {
                    const options = {
                        clientPackage: data.datas.client,
                        forge: `${__dirname}/tmp/assets/files/forge/forge-${data.datas.version}.jar`,
                        authorization: {
                            access_token: response.access_token,
                            client_token: response.client_token,
                            uuid: response.uuid,
                            name: response.name,
                            user_properties: response.user_properties
                        },
                        root: `${__dirname}/tmp/minecraft-${data.datas.date}`,
                        version: {
                            number: data.datas.version,
                            type: `${Assets.is_release_version ? 'release' : 'snapshot'}`
                        },
                        memory: {
                            min: `${localStorage.getItem('min_ram_value') ? localStorage.getItem('min_ram_value') : data.datas.max_ram}G`,
                            max: `${localStorage.getItem('max_ram_value') ? localStorage.getItem('max_ram_value') : data.datas.max_ram}G`
                        },
                        server: {
                            host: data.datas.server.host
                        }
                    }
    
                    launcher.launch(options)
                    showMCLCInformations(launcher, options)
                } else {
                    const options = {
                        clientPackage: data.datas.client,
                        forge: `${__dirname}/tmp/assets/files/forge/forge-${data.datas.version}.jar`,
                        authorization: {
                            access_token: response.access_token,
                            client_token: response.client_token,
                            uuid: response.uuid,
                            name: response.name,
                            user_properties: response.user_properties
                        },
                        root: `${__dirname}/tmp/minecraft-${data.datas.date}`,
                        version: {
                            number: data.datas.version,
                            type: `${Assets.is_release_version ? 'release' : 'snapshot'}`
                        },
                        memory: {
                            min: `${localStorage.getItem('min_ram_value') ? localStorage.getItem('min_ram_value') : data.datas.max_ram}G`,
                            max: `${localStorage.getItem('max_ram_value') ? localStorage.getItem('max_ram_value') : data.datas.max_ram}G`
                        }
                    }
    
                    launcher.launch(options)
                    showMCLCInformations(launcher, options)
                }
            }

            // Check if admin has Azuriom option

            if (data.datas.azuriom) {
                const AzuriomAuth = require('azuriom-auth')

                const authenticator = new AzuriomAuth.Authenticator(data.datas.azuriom.url)

                try {
                    const user = await authenticator.auth(username, password)

                    // Launch with Azuriom's username

                    Authenticator.getAuth(user.username).then(response => {
                        const infos = document.getElementById('infos')
        
                        infos.innerHTML = `Bonjour ${user.username}`
        
                        handleLaunch(response)
                    }).catch(event => {
                        const infos = document.getElementById('infos')
        
                        const error = new Error(event)
        
                        if (error.message.includes('Error: Validation error: Forbidden')) {
                            infos.innerHTML = 'Vos identifiants sont incorrects'
                        } else {
                            infos.innerHTML = event
                        }
                    })
                } catch (e) {
                    console.log('error : ', e)
                    
                    if (e.response) {
                        switch (e.response.data.message) {
                            case 'Auth API is not enabled':
                                infos.innerHTML = `Connexion impossible vers l\'API du site web`
                            break
                        
                            default:
                                infos.innerHTML = 'Erreur de connexion vers le site web'
                            break
                        }
                    } else {
                        infos.innerHTML = new Error(e).message
                    }
                }
            } else {
                Authenticator.getAuth(username, password).then(response => {
                    const infos = document.getElementById('infos')
    
                    infos.innerHTML = `Bonjour ${response.name}`
    
                    handleLaunch(response)
                }).catch(event => {
                    const infos = document.getElementById('infos')
    
                    const error = new Error(event)
    
                    if (error.message.includes('Error: Validation error: Forbidden')) {
                        infos.innerHTML = 'Vos identifiants sont incorrects'
                    } else {
                        infos.innerHTML = event
                    }
                })
            }
        } else {
            infos.innerHTML = 'Entrez vos identifiants'
        }
    }

    document.querySelector('button').onclick = () => handleClick()

    document.onkeypress = e => {
        const infos = document.getElementById('infos')
        
        infos.innerHTML = ''

        if (e.keyCode === 13) {
            handleClick()
        }
    }
})