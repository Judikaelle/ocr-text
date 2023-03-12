import {createWorker} from "tesseract.js";
import {createCharactersButtons, createResetButton, isUppercase, replaceAll} from "./utils";

// Get DOM elements
const fileInput = document.getElementById('file-input') as HTMLInputElement;
// const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const charactersDiv = document.getElementById('characters') as HTMLDivElement;
const charactersButtons = document.getElementsByClassName('character-button') as HTMLCollectionOf<HTMLButtonElement>;
const lines = document.getElementsByTagName('p') as HTMLCollectionOf<HTMLParagraphElement>;
const fileList = document.getElementById('file-list') as HTMLDivElement;


// TODO: Ajouter Revealjs (https://revealjs.com/)

interface Dialogues {
    [nombre: string]: {
        personnage: string;
        replique: string;
    };
}

let characterColors: any = {};
let progress = 0;

// Regex
const characterRegex = /^[A-Za-z]+(\s*:|:)/;
const didascalieRegex = /^([^\(\)]+)\s*\([^)]*\)\s*:/
// const fullDisacaliesRegex = /\n\s*\S.+\n/


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
fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (file) {
        resetFiles()
        fileList.innerText = file.name;
        resultDiv.innerHTML = 'Working...';
    }

    // if (resultDiv.innerText !== '') return;
    let allCharacters: Array<string> = [];


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
        const worker = await createWorker({
            logger: l => {
                if (l.status === 'recognizing text') {
                    progress = Math.round(l.progress * 100);
                    resultDiv.innerText = `Working... ${progress}%`;
                }
            }
        });

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
        // const repliques = text?.match(/^.+$/gm);
        // const repliques = text?.match(/\n\s*\n/);
        const repliques = text?.match(/[^\n]+/g);

        const dialogues: any = {};
        let currentIndex = 1;

        // Supprime le titre en haut de page
        repliques?.shift();

        for (let r of repliques || []) {
            r = replaceAll(r);
            // const fullDisacalies = r.match(fullDisacaliesRegex);
            // console.log(fullDisacalies);

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
        return dialogues;
    }

    const dialoguesToHtml = (dialogues: Dialogues, div: HTMLDivElement, currentCharacter: string | null = null) => {
        const dialoguesArray = Object.values(dialogues);
        characterColors = assignColors(allCharacters);
        let color;
        for (const key in dialoguesArray) {
            let character = dialoguesArray?.[key]["personnage"];
            color = currentCharacter !== character ? "white" : "black";
            const text = dialoguesArray[key]["replique"];
            div.innerHTML += `<p><b style="background-color: ${characterColors[character]}">${character}</b> : <span id=${key} style="background-color: ${color}">${text}</span></p>`;
        }
    }


    // Affichage du résultat dans la div prévue à cet effet
    if (resultDiv && ocrText) {
        resultDiv.innerHTML = '';
        dialoguesToHtml(getDialogues(ocrText), resultDiv);
        createCharactersButtons(allCharacters, charactersDiv);
        createResetButton(charactersDiv, resetFiles);
    }


    // Création d'un tableau à partir de la collection de boutons
    const arrayCharactersButtons = Array.from(charactersButtons);

    // Ajout d'un event listener sur chaque bouton
    for (const button of arrayCharactersButtons) {
        button.addEventListener('click', () => {
            resultDiv.innerHTML = '';
            const character = button.getAttribute('id');
            dialoguesToHtml(getDialogues(ocrText), resultDiv, character);

            // Création d'un tableau à partir de la collection de span
            const arrayLines = Array.from(lines);
            for (const line of arrayLines) {
                line.addEventListener('click', () => {
                    const span = line.getElementsByTagName('span')[0];
                    const characterLine = line.innerText.match(characterRegex)?.[0].replace(':', '').trim();
                    if (characterLine === character) span.style.backgroundColor = span.style.backgroundColor === "black" ? "white" : "black";
                });
            }
        });
    }

});


export {}