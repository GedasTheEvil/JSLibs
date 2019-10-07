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
    ]

    const nodeList = document.querySelectorAll(`.js-details-container > .d-flex`)

    const isNexusDev = author =>  nexusDevs.indexOf(author) !== -1
    const isFrontasticDev = author => !isNexusDev(author)

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

    const nexusList = Array.prototype.map.call(nodeList, e => e)
        .filter(authorFilter(isNexusDev))

    const frontasticList = Array.prototype.map.call(nodeList, e => e)
        .filter(authorFilter(isFrontasticDev))

    const formatNodeList = list => {
        return list.map(getMessage)
            .filter(t => t.length > 0)
            .filter(t => doesNotHave(t, 'merge pull request'))
            .filter(t => doesNotHave(t, 'merge branch'))
            .filter(t => doesNotHave(t, 'merge remote'))
            .filter(t => doesNotHave(t, 'built assets for release'))
            .filter(t => doesNotHave(t, 'built release'))
            .map(t => `* ${t}`)
            .reduce((a, b) => `${a}\n${b}`, '')
    }

    const log = (title, list) => {
        if (!(list && list.length)) {
            return ''
        }

        return `\n\n==== ${title} ====\n` + formatNodeList(list)
    }

    const mainHeader = () => {
        const lc = window.location.href.split('/')
        const releaseName = lc[lc.length - 1].replace('...', ' => ')

        return `Release ${releaseName}`
    }

    return mainHeader() + log('NEXUS', nexusList) + log('Frontastic', frontasticList)
}
