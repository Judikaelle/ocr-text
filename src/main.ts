import {createWorker} from "tesseract.js";
import {isUppercase} from "./utils";

// Get DOM elements
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const charactersDiv = document.getElementById('characters') as HTMLDivElement;
const charactersButtons = document.getElementsByClassName('character-button') as HTMLCollectionOf<HTMLButtonElement>;
const lines = document.getElementsByTagName('p') as HTMLCollectionOf<HTMLParagraphElement>;

interface Dialogues {
    [nombre: string]: {
        personnage: string;
        replique: string;
    };
}

let characterColors: any = {};

// Regex
const characterRegex = /^[A-Za-z]+(\s*:|:)/;
const didascalieRegex = /^([^\(\)]+)\s*\([^)]*\)\s*:/


const assignColors = (characters: Array<string>) => {
    const colors = ["lightcoral", "lightskyblue", "lightgreen", "lightsalmon"]
    const charactersColors: any = {};
    for (const character of characters) {
        charactersColors[character] = colors[0];
        colors.splice(0, 1);
    }
    return charactersColors;
}

const resetFiles = () => {
    fileInput.value = '';
    resultDiv.innerHTML = '';
    charactersDiv.innerHTML = '';
}

// Add event listener to submit button
submitButton.addEventListener('click', async () => {
    if (resultDiv.innerText !== '') return;
    let allCharacters: Array<string> = [];

    const file = fileInput.files?.[0];
    // Vérification qu'un fichier a été sélectionné
    if (!file) {
        if (resultDiv) {
            resultDiv.innerText = 'Veuillez sélectionner un fichier.';
        }
    }


// Fonction permettant la lecture d'un fichier en tant qu'URL Data
    async function readFileAsDataUrl(file?: File): Promise<string> {
        if (!file) {
            throw new Error('Fichier non trouvé');
        }
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const imageDataUrl = await readFileAsDataUrl(file);


    const performOcr = async (image: string) => {
        const worker = await createWorker();
        try {
            await worker.loadLanguage('fra');
            await worker.initialize('fra');
            const {data: {text}} = await worker.recognize(image);
            return text;
        } catch (error) {
            console.log(error);
        } finally {
            await worker.terminate();
        }
        return
    }

    const ocrText = await performOcr(imageDataUrl);


    // Récupérer les dialogues
    const getDialogues = (text: string | undefined) => {
        // TODO: Récupérer didascalies
        const repliques = text?.match(/^.+$/gm);
        const dialogues: any = {};
        let currentIndex = 1;

        for (const r of repliques || []) {
            const didascalieMatch = r.match(didascalieRegex);
            const characterMatch = r.match(characterRegex);

            if (didascalieMatch) {
                const didascalie = didascalieMatch[0];
                const stringSplit = didascalie.split(' ');
                const dialogue = r.replace(didascalie, '');

                // Ajouter le personnage à la liste des personnages
                allCharacters.push(stringSplit[0].trim());
                allCharacters = Array.from(new Set(allCharacters))

                dialogues[currentIndex] = {"personnage": stringSplit[0].trim(), "replique": dialogue};
                currentIndex++;
            } else if (characterMatch && isUppercase(characterMatch[0])) {
                const character = characterMatch[0];
                const dialogue = r.replace(character, '');

                // Ajouter le personnage à la liste des personnages
                allCharacters.push(character.replace(':', '').trim());
                allCharacters = Array.from(new Set(allCharacters));

                // Créer un objet pour chaque dialogue
                dialogues[currentIndex] = {"personnage": character.replace(':', '').trim(), "replique": dialogue};
                currentIndex++;
            } else {
                dialogues[currentIndex - 1]["replique"] += ` ${r}`;
            }
        }
        console.table(allCharacters);
        return dialogues;
    }


    const createCharactersButtons = (characters: Array<string>, div: HTMLDivElement) => {
        for (const character of characters) {
            const button = document.createElement('button');
            button.setAttribute('class', 'character-button');
            button.setAttribute('id', character)
            button.innerText = character;
            div.appendChild(button);
        }
    }

    const createResetButton = (div: HTMLDivElement) => {
        const button = document.createElement('button');
        button.setAttribute('class', 'reset-button');
        button.innerText = 'Réinitialiser';
        button.addEventListener('click', () => {
            resetFiles();
        });
        div.appendChild(button);
    }


    const dialoguesToHtml = (dialogues: Dialogues, div: HTMLDivElement, currentCharacter: string | null = null) => {
        const dialoguesArray = Object.values(dialogues);
        characterColors = assignColors(allCharacters);
        let color;
        for (const key in dialoguesArray) {
            let character = dialoguesArray?.[key]["personnage"];
            if (currentCharacter !== character) {
                color = characterColors[character];
            } else {
                color = "black";
            }
            const text = dialoguesArray[key]["replique"];
            div.innerHTML += `<p><b>${character}</b> : <span id=${key} style="background-color: ${color}">${text}</span></p>`;
        }
    }


    // Affichage du résultat dans la div prévue à cet effet
    if (resultDiv && ocrText) {
        dialoguesToHtml(getDialogues(ocrText), resultDiv);
        createCharactersButtons(allCharacters, charactersDiv);
        createResetButton(charactersDiv);
    }


    // Création d'un tableau à partir de la collection de boutons
    const arrayCharactersButtons = Array.from(charactersButtons);

    // Ajout d'un event listener sur chaque bouton
    for (const button of arrayCharactersButtons) {
        button.addEventListener('click', () => {
            resultDiv.innerHTML = '';
            const character = button.getAttribute('id');
            // const characterDialogues = Object.values(getDialogues(ocrText)).filter((dialogue: any) => dialogue.personnage === character);
            dialoguesToHtml(getDialogues(ocrText), resultDiv, character);

            // Création d'un tableau à partir de la collection de span
            const arrayLines = Array.from(lines);
            for (const line of arrayLines) {
                line.addEventListener('click', () => {
                    const span = line.getElementsByTagName('span')[0];
                    const characterLine = line.innerText.match(characterRegex)?.[0];
                    if (characterLine === character) span.style.backgroundColor = span.style.backgroundColor === "black" ? characterColors[character] : "black";
                });
            }
        });
    }

});


export {}