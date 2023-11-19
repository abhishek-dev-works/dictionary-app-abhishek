window.onload = async function () {
    const titleElement = document.getElementById('appTitle');
    const appTitle = 'Dictionary App';

    // Function to add letters with a delay
    async function addLetterWithDelay(index) {
        await new Promise(resolve => setTimeout(resolve, 150));
        titleElement.textContent = appTitle.slice(0, index + 1);
    }

    // Loop through each letter in the app title
    for (let i = 0; i < appTitle.length; i++) {
        await addLetterWithDelay(i);
    }
};

function searchWord() {
    // Get the word from the input field
    let word = document.getElementById('searchInput').value;
    
    // Clear the results before displaying new results
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = '';

    // Make a fetch request to the DictionaryAPI
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            // Handle the response data
            displayResults(data);
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching data:', error);
            displayError('An error occurred while fetching the data.');
        });
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function displayResults(data) {
    const resultContainer = document.getElementById('resultContainer');

    if (data.length > 0) {
        data.forEach(result => {
            const articleElement = document.createElement('article');
            articleElement.classList.add('word');

            // Capitalize the first letter of the word itself
            const capitalizedWord = capitalizeFirstLetter(result.word);

            // Display the word itself
            const wordHeader = document.createElement('h1');
            wordHeader.textContent = capitalizedWord;
            articleElement.appendChild(wordHeader);

            // Display phonetic information
            if (result.phonetics.length > 0) {
                
                // Check if there is an audio URL
                if (result.phonetics[0].audio) {
                    const audioElement = document.createElement('audio');
                    audioElement.style.maxWidth= '80%';
                    audioElement.controls = true;
                    const sourceElement = document.createElement('source');
                    sourceElement.src = result.phonetics[0].audio;
                    sourceElement.type = 'audio/mpeg';
                    audioElement.appendChild(sourceElement);
                    articleElement.appendChild(audioElement);
                }
            }

            // Display meanings and definitions
            if (result.meanings.length > 0) {
                result.meanings.forEach(meaning => {
                    const partOfSpeechElement = document.createElement('h4');
                    partOfSpeechElement.textContent = `Part of Speech: ${meaning.partOfSpeech}`;
                    articleElement.appendChild(partOfSpeechElement);

                    // Display the first definition only
                    if (meaning.definitions.length > 0) {
                        const definitionParagraph = document.createElement('p');
                        definitionParagraph.textContent = `Definition: ${meaning.definitions[0].definition}`;
                        articleElement.appendChild(definitionParagraph);
                    }
                });
            }

            // Append the article to the result container
            resultContainer.appendChild(articleElement);
        });
    } else {
        displayError('Word not found.');
    }
}

function displayError(message) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `<h1>Opps! I could not find what you were looking for. 😞</h1>`;
}

function checkKey() {
    if(event?.keyCode == 13){
        searchWord();
    }
}
