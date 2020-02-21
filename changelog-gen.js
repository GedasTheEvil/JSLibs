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
        'Tadas Barauskas',
        'fetmo',
        'mntsss',
        'Mantas Muliarčikas',
        'nxsbuddenbrock',
        'Freeminderus',
        'DDero',
        'znavickas',
        'RolandasZ',
        'Silviu Paduraru',
    ]

    const prymDevs = [
        'Volker',
        'Christoph Zengerling',
        's-haeusler',
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
    
    const excludeString = stringToExclude => { return t => doesNotHave(t, stringToExclude) }

    const formatNodeList = list => {
        const data = list.map(getMessage)
            .filter(t => t.length > 0)
            .filter(excludeString('merge pull request'))
            .filter(excludeString('merge branch'))
            .filter(excludeString('merge remote'))
            .filter(excludeString('built assets for release'))
            .filter(excludeString('built release'))
            .filter(excludeString('fixed merge conflicts'))
            .filter(excludeString('accidentaly commited file'))
            .filter(excludeString('undo project file'))
            .filter(excludeString('eslint fix'))
            .filter(excludeString('eslint changes'))
            .filter(excludeString('fix eslint'))
            .filter(excludeString('requested changes'))
            .filter(excludeString('fixing a typo'))
            .filter(excludeString('triggering a build'))
            .filter(excludeString('as suggested in cr'))
            .filter(excludeString('as suggested in pr'))
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
