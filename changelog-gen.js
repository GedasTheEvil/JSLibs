function getChangeLog() {
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
        'rilexus',
        'Zetttman',
        'z0n',
        'Markus Renken',
        'andre-va',
        'Andreas Mischke',
        'andreasmischke',
        'Marcel Ahne',
        'kalinaprym',
    ]

    const nodeList = document.querySelectorAll(`.TimelineItem.TimelineItem--condensed > .TimelineItem-body`)

    const isNexusDev = author => nexusDevs.indexOf(author) !== -1
    const isPrymDev = author => prymDevs.indexOf(author) !== -1
    const isFrontasticDev = author => !isNexusDev(author) && !isPrymDev(author)

    const getAuthor = element => {
        const author = element.querySelector(`.AvatarStack-body`)
        const fallbackAuthor = 'Unknown'

        if (!author) {
            return fallbackAuthor
        }

        const authorName = author?.ariaLabel?.trim() || fallbackAuthor

        return authorName.split(' and ')[0].split(', ')[0].trim()
    }

    const getMessage = element => {
        const message = element.querySelector(`code`)

        if (!message) {
            return ''
        }

        return message.innerText.replace(`…`, '').trim()
    }

    const doesNotHave = (text, phrase) => text.toLowerCase().search(phrase) === -1

    const authorFilter = call => element => call(getAuthor(element))

    const nodeToList = rawNodeList => Array.prototype.map.call(rawNodeList, e => e)

    const makeList = filterBy => {
        return nodeToList(nodeList).filter(authorFilter(filterBy))
    }

    const nexusList = makeList(isNexusDev)
    const prymList = makeList(isPrymDev)
    const frontasticList = makeList(isFrontasticDev)

    const excludeString = stringToExclude => {
        return t => doesNotHave(t, stringToExclude)
    }

    const formatNodeList = list => {
        const data = list
            .map(getMessage)
            .filter(t => t.length > 0)
            .filter(excludeString('merge pull request'))
            .filter(excludeString('merge branch'))
            .filter(excludeString('merge remote'))
            .filter(excludeString('merge conflict'))
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
            .filter(excludeString('mr issues'))
            .filter(excludeString('linter'))
            .filter(excludeString('removed comments'))
            .filter(excludeString('resolved pr'))
            .filter(excludeString('fixed pr'))
            .filter(excludeString('buildfix'))
            .filter(excludeString('build fix'))
            .filter(excludeString('build trigger'))
            .filter(excludeString('restart build'))
            .filter(excludeString('undid project yml'))
            .filter(excludeString('update prym_poc/src'))
            .sort((a, b) => a.localeCompare(b))
            .map(t => `* ${t}`)

        return [...new Set(data)].reduce((a, b) => `${a}\n${b}`, '')
    }

    const withHeader = (title, list) => {
        if (!(list && list.length)) {
            return ''
        }

        return `\n\n==== ${title} ====\n` + list
    }

    const log = (title, rawList) => {
        const list = formatNodeList(rawList)

        return withHeader(title, list)
    }

    const mainHeader = () => {
        const lc = window.location.href.split('/')
        const releaseName = lc[lc.length - 1].replace('...', ' => ')

        return `Front-end Release ${releaseName}`
    }

    const getTicketList = () => {
        const ticketPrefix = `PCED2C-`
        const ticketPattern = new RegExp(`${ticketPrefix}\\d+`, 'i')
        const messageToTicket = message => {
            const matches = message.match(ticketPattern) || []

            return matches[0]
        }
        const ticketNumberToLink = ticket => `https://prym-group.atlassian.net/browse/${ticket}`

        const rawList = nodeToList(nodeList)
            .map(getMessage)
            .filter(message => message.indexOf(ticketPrefix) !== -1)
            .filter(excludeString('merge pull request'))
            .filter(excludeString('merge branch'))
            .filter(excludeString('merge remote'))
            .filter(excludeString('merge conflict'))
            .map(messageToTicket)
            .filter(Boolean)
            .map(ticketNumberToLink)
            .sort((a, b) => a.localeCompare(b))
            .map(t => `* ${t}`)

        return [...new Set(rawList)].reduce((a, b) => `${a}\n${b}`, '')
    }

    return (
        mainHeader() +
        log('NEXUS', nexusList) +
        log('PRYM', prymList) +
        log('Frontastic', frontasticList) +
        withHeader('Tickets to be deployed', getTicketList())
    )
}

getChangeLog()
