function getChangeLog() {

  const list = document.querySelectorAll(`.commit-message.pr-1.flex-auto`)

  const doesNotHave = (text, phrase) => text.toLowerCase().search(phrase) === -1

  return Array.prototype.map.call(list, e => e.innerText)
    .filter(t => doesNotHave(t, 'merge pull request'))
    .filter(t => doesNotHave(t, 'built assets for release'))
    .map(t => `* ${t}`)

}