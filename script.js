
const wordContainer = document.getElementById("word-info")

function renderWord(words) {
    words.entries.forEach((word) => {
        word.senses.forEach((sense) => {
            const wordInfo = sense.definition
            const wordDefinition = document.createElement("p")
            wordDefinition.textContent = wordInfo
            wordContainer.append(wordDefinition)
        })
        
    })
    
}
function clearOutput() {
    wordContainer.innerHTML = ""
}

async function getWords(e) {
    e.preventDefault()
    const API = `https://freedictionaryapi.com/api/v1/entries/en/`
    const userWord = document.getElementById("word").value.toLowerCase()
    const word = userWord
    clearOutput()
    try {
        const response = await fetch(`${API}${word}`)
        const words = await response.json()
        renderWord(words)
    } catch (error) {
        console.log(error)
    }
}

document.getElementById("submit-btn").addEventListener('click', getWords)