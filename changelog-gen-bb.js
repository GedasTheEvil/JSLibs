function getChangeLog () {

    const nodeList = document.querySelectorAll(`tr.iterable-item`)

    const getMessage = element => {
        const message = element.querySelector(`td.text`)

        if (!message) {
            return ''
        }

        return message.innerText.trim()
    }

    const doesNotHave = (text, phrase, safeGuardPattern) => {
         const found = text.toLowerCase().search(phrase) === -1;
         return !found && typeof safeGuardPattern !== 'undefined' ? safeGuardPattern.test(text) === true : found;
     }


    const nexusList = Array.prototype.map.call(nodeList, e => e)

    const formatNodeList = list => {
        const data = list.map(getMessage)
            .filter(t => t.length > 0)
            .filter(t => doesNotHave(t, 'merge pull request'))
            .filter(t => doesNotHave(t, 'merged', /merged.*(?=\*)/img))
            .filter(t => doesNotHave(t, 'merge branch'))
            .filter(t => doesNotHave(t, 'merge remote'))
            .filter(t => doesNotHave(t, 'built assets for release'))
            .filter(t => doesNotHave(t, 'built release'))
            .filter(t => doesNotHave(t, 'pr fixes'))
            .filter(t => doesNotHave(t, 'code review'))
            .filter(t => doesNotHave(t, 'code sniffer fixes'))
            .filter(t => doesNotHave(t, 'commented out'))
            .sort((a, b) => a.localeCompare(b))
            .map(t => t.replace(/merged.*(?=\*)/img, '', t).replace('*', '', t).trim())
            .map(t => t.replace(/PCED2C-(\d+)\s+(.*)/img, 'PCED2C-$1: $2', t))
            .map(t => `* ${t}`)

        return [...new Set(data)].reduce((a, b) => `${a}\n${b}`, '')
    }

    const log = (title, list) => {
        if (!(list && list.length)) {
            return ''
        }

        return `\n\n==== ${title} ====\n` + formatNodeList(list)
    }

    const pad = num => {
        return num > 9 ? num : `0${num}`
    }

    const to15 = num => {
        const a = Math.round(num / 15)

        return pad(a * 15)
    }

    const mainHeader = () => {
        const d = new Date()
        const releaseName = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}` +
            `.${d.getHours()}${to15(d.getMinutes())}`

        return `Back-end (Spryker) Release ${releaseName}`
    }

    return mainHeader() + log('NEXUS', nexusList)
}

getChangeLog()
