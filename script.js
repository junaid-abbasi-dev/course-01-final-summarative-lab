
const wordContainer = document.getElementById("word-info")

function renderWord(words) {
    // console.log(words)
    let heading = 0
    words.entries.forEach((word) => {
        const speechHeading = document.createElement("h4")
        speechHeading.textContent = "Part Of Speech"
        wordContainer.append(speechHeading)


        const speech = document.createElement("p")
        speech.textContent = word.partOfSpeech
        wordContainer.append(speech)
        const wordDefinitionHeading = document.createElement("h2")
        wordDefinitionHeading.textContent = `Word Definition ${heading += 1}`
        wordContainer.append(wordDefinitionHeading)

        const pronunciationHeading = document.createElement("h3")
        pronunciationHeading.textContent = "Pronunciation: "
        wordContainer.append(pronunciationHeading)
        word.pronunciations.forEach((pronunciation) => {
            const pronounciationContainer = document.createElement("p")
            pronounciationContainer.textContent = `${pronunciation.text}`
            wordContainer.append(pronounciationContainer)
        })

        word.senses.forEach((sense) => {
            const wordInfo = sense.definition
            const wordDefinition = document.createElement("p")

            wordDefinition.textContent = `${wordInfo}`
            wordContainer.append(wordDefinition)

            sense.examples.forEach((example) => {
                const exampleParagraph = document.createElement("p")
                exampleParagraph.textContent = `Example: ${example}`
                wordContainer.append(exampleParagraph)
            })
        })
        word.synonyms.forEach((synonym) => {
            const synonymPara = document.createElement("p")
            synonymPara.textContent = `Synonym: ${synonym}`
            wordContainer.append(synonymPara)
        })

        
    })
    const sourceContainer = document.createElement("a")
    sourceContainer.href = `${words.source.url}`
    sourceContainer.textContent = words.source.url
    wordContainer.append(sourceContainer)
    // console.log(words.source.url)

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
        if (!response.ok) {
            const errorMessage = document.createElement("p")
            errorMessage.textContent = "Could not find that word"
            wordContainer.append(errorMessage)
            return 
        }
        renderWord(words)
        showSaveFavoriteButton(words.word || word)
    } catch (error) {
        const errorMessage = document.createElement("p")
        errorMessage.textContent = "Could not find that word"
        wordContainer.append(errorMessage)
    }
}

document.getElementById("submit-btn").addEventListener('click', getWords)

// --- Favorites (added below; does not change renderWord) ---
const favoritesList = document.getElementById("favorites-list")
const FAVORITES_KEY = "wordlyFavorites"

function getFavorites() {
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? JSON.parse(saved) : []
}

function setFavorites(favorites) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

function renderFavorites() {
    favoritesList.innerHTML = ""
    const favorites = getFavorites()

    if (favorites.length === 0) {
        const emptyItem = document.createElement("li")
        emptyItem.textContent = "No favorites yet."
        favoritesList.append(emptyItem)
        return
    }

    favorites.forEach((favWord) => {
        const item = document.createElement("li")
        item.classList.add("favorite-item")
        item.textContent = favWord
        favoritesList.append(item)
    })
}

function showSaveFavoriteButton(wordToSave) {
    const saveBtn = document.createElement("button")
    saveBtn.type = "button"
    saveBtn.id = "save-favorite-btn"
    saveBtn.textContent = "Save to Favorites"
    saveBtn.addEventListener("click", () => {
        const favorites = getFavorites()
        if (!favorites.includes(wordToSave)) {
            favorites.push(wordToSave)
            setFavorites(favorites)
            renderFavorites()
        }
        saveBtn.textContent = "Saved!"
        saveBtn.classList.add("saved-highlight")
    })
    wordContainer.append(saveBtn)
}

renderFavorites()