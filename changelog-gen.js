function getChangeLog () {
    const nexusDevs = [
        'GedasTheEvil',
        'uikolas',
        'Gediminas Skucas',
        'spaduraru',
        'Evas11',
        'lukas0127',
        'rotariuBogdan',
        'sylviu21',
        'N3m1s',
        'tbarauskas',
        'fetmo',
        'mntsss',
        'Mantas Muliarčikas',
        'nxsbuddenbrock',
        'Freeminderus',
        's-haeusler',
        'DDero',
        'znavickas',
        'RolandasZ',
        'Silviu Paduraru',
    ]

    const prymDevs = [
        'Volker',
    ]

    const nodeList = document.querySelectorAll(`.js-details-container > .d-flex`)

    const isNexusDev = author =>  nexusDevs.indexOf(author) !== -1
    const isPrymDev = author =>  prymDevs.indexOf(author) !== -1
    const isFrontasticDev = author => !isNexusDev(author) && !isPrymDev(author)

    const getAuthor = element => {
        const author = element.querySelector(`.commit-author`)

        if (!author) {
            return 'Unknown'
        }

        return author.innerText.trim()
    }

    const getMessage = element => {
        const message = element.querySelector(`.commit-message.pr-1.flex-auto`)

        if (!message) {
            return ''
        }

        return message.innerText.trim()
    }

    const doesNotHave = (text, phrase) => text.toLowerCase().search(phrase) === -1

    const authorFilter = call => element => call(getAuthor(element))

    const makeList = (filterBy) => {
        return Array.prototype.map.call(nodeList, e => e)
            .filter(authorFilter(filterBy))
    }

    const nexusList = makeList(isNexusDev)
    const prymList = makeList(isPrymDev)
    const frontasticList = makeList(isFrontasticDev)

    const formatNodeList = list => {
        const data = list.map(getMessage)
            .filter(t => t.length > 0)
            .filter(t => doesNotHave(t, 'merge pull request'))
            .filter(t => doesNotHave(t, 'merge branch'))
            .filter(t => doesNotHave(t, 'merge remote'))
            .filter(t => doesNotHave(t, 'built assets for release'))
            .filter(t => doesNotHave(t, 'built release'))
            .filter(t => doesNotHave(t, 'fixed merge conflicts'))
            .filter(t => doesNotHave(t, 'accidentaly commited file'))
            .sort((a, b) => a.localeCompare(b))
            .map(t => `* ${t}`)

        return [...new Set(data)].reduce((a, b) => `${a}\n${b}`, '')
    }

    const log = (title, rawList) => {
        const list = formatNodeList(rawList)

        if (!(list && list.length)) {
            return ''
        }

        return `\n\n==== ${title} ====\n` + list
    }

    const mainHeader = () => {
        const lc = window.location.href.split('/')
        const releaseName = lc[lc.length - 1].replace('...', ' => ')

        return `Front-end Release ${releaseName}`
    }

    return mainHeader()
        + log('NEXUS', nexusList)
        + log('PRYM', prymList)
        + log('Frontastic', frontasticList)
}

getChangeLog()
