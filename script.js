for (let element of document.getElementsByClassName('submit')) {
    element.onclick = async () => {
        const logger = require('electron').remote.require('./logger')

        const infos = document.getElementById('infos')

        const establishment = document.getElementById('establishment').value
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        if (establishment !== '' && username !== '' && password !== '') {
            infos.innerHTML = 'Chargement...'

            const pronote = require('pronote-api')

            try {
                const session = await pronote.login(establishment, username, password)
                const timeable = await session.timetable()

                logger.log(timeable)

                const home = document.getElementById('home')
                const panel = document.getElementById('panel')

                panel.style.width = '100vw'
                panel.style.height = '100vh'

                const student = document.createElement('div')

                const studentText = document.createElement('div')
                const studentImage = document.createElement('div')

                const name = document.createElement('h2')
                const classmate = document.createElement('h3')
                const image = document.createElement('img')

                name.innerHTML = session.user.name
                classmate.innerHTML = `${session.user.studentClass.name} - ${session.params.schoolYear}`
                
                image.src = session.user.avatar

                studentText.append(name, classmate)
                studentText.id = 'studentText'

                studentImage.append(image)
                studentImage.id = 'studentImage'

                student.append(studentText, studentImage)
                student.id = 'student'
                
                const today = document.createElement('div')
                const lessons = document.createElement('div')

                const date = document.createElement('h1')

                if (timeable.length !== 0) {
                    for (let i = 0; i < timeable.length; i++) {
                        const element = timeable[i]
    
                        const day = new Date(element.from).getDate()
                        const month = new Date(element.from).getMonth()
    
                        date.innerHTML = `${day < 10 ? `0${day}` : day} ${month === 0 ? 'Janvier' : month === 1 ? 'Février' : month === 2 ? 'Mars' : month === 3 ? 'Avril' : month === 4 ? 'Mai' : month === 5 ? 'Juin' : month === 6 ? 'Juillet' : month === 7 ? 'Août' : month === 8 ? 'Septembre' : month === 9 ? 'Octobre' : month === 10 ? 'Novembre' : month === 11 ? 'Décembre' : 'Erreur'}`
    
                        if (!element.isCancelled) {
                            const div = document.createElement('div')
                            const title = document.createElement('h1')
                            const subtitle = document.createElement('h2')
                            const info = document.createElement('p')
    
                            const dateFrom = new Date(element.from)
                            const dateTo = new Date(element.to)
    
                            title.innerHTML = element.teacher
                            subtitle.innerHTML = `${element.teacher} - ${element.room !== null ? element.room : '?'}`
    
                            if (element.isAway) {
                                info.innerHTML = 'Absent'
                            } else {
                                info.innerHTML = `${dateFrom.getHours() < 10 ? `0${dateFrom.getHours()}` : dateFrom.getHours()}h${dateFrom.getMinutes() < 10 ? `0${dateFrom.getMinutes()}` : dateFrom.getMinutes()} à ${dateTo.getHours() < 10 ? `0${dateTo.getHours()}` : dateTo.getHours()}h${dateTo.getMinutes() < 10 ? `0${dateTo.getMinutes()}` : dateTo.getMinutes()}`
                            }
    
                            div.style.background = `${element.isCancelled ? `red` : element.color}`
                            div.append(title, subtitle, info)
                            div.id = 'lesson'
    
                            lessons.append(div)
                        }
                    }
                } else {
                    date.innerHTML = 'Aucun cours'
                }

                lessons.id = 'lessons'

                today.append(date, lessons)
                today.id = 'today'

                const details = document.createElement('div')
                const space = document.createElement('h6')
                const version = document.createElement('h6')

                space.innerHTML = session.params.title
                version.innerHTML = session.params.version

                details.append(space, version)
                details.id = 'details'

                home.remove()
                panel.append(student, today, details)
            } catch (error) {
                if (error.code === pronote.errors.WRONG_CREDENTIALS.code) {
                    infos.innerHTML = 'Identifiants incorrects'
                } else {
                    infos.innerHTML = 'Une erreur est survenue'
                }
            }
        } else {
            infos.innerHTML = 'Veuillez entrer vos identifiants'
        }
    }
}

document.addEventListener('keypress', () => {
    const infos = document.getElementById('infos')
    infos.innerHTML = ''
})