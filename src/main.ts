import {assignColors, isUppercase, replaceAll, resetFiles} from "./utils";
import {createCharactersButtons, createResetButton} from "./html";
import {Dialogues} from "./types";
import {charactersButtons, charactersDiv, fileInput, fileList, loadingDiv, paragraphs, resultDiv} from "./dom";
import {characterRegex, didascalieRegex} from "./regex";
import {performOcr, readFileAsDataUrl} from "./ocr";

// TODO: Ajouter Revealjs (https://revealjs.com/)

let characterColors: any = {};

// TODO: Refactoriser
// TODO: Mettre en place LocalStorage
// const ocrText = localStorage.getItem('ocrText')

// if(ocrText) {
//     // Affichage du résultat dans la div prévue à cet effet
//     if (resultDiv && ocrText) {
//         resultDiv.innerHTML = '';
//         dialoguesToHtml(getDialogues(ocrText), resultDiv);
//         loadingDiv.innerHTML = '';
//         loadingDiv.style.marginTop = '0';
//         createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
//         createResetButton(charactersDiv, resetFiles);
//     }
// }

fileInput.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (file) {
        resetFiles(fileInput, resultDiv, charactersDiv);
        fileList.innerText = file.name;
        loadingDiv.innerHTML = 'Working...';
    }

    let allCharacters: Array<string> = [];

    const imageDataUrl = await readFileAsDataUrl(file);


    const ocrText = await performOcr(imageDataUrl, loadingDiv);
    if(ocrText) localStorage.setItem('ocrText', ocrText)



    // Récupérer les dialogues
    const getDialogues = (text: string | undefined) => {
        const repliques = text?.match(/[^\n]+/g);

        const dialogues: any = {};
        let currentIndex = 1;

        // Supprime le titre en haut de page
        repliques?.shift();

        for (let r of repliques || []) {
            r = replaceAll(r);

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

    const dialoguesToHtml = (dialogues: Dialogues, div: HTMLDivElement, activeCharacter: string | null = null) => {
        const dialoguesArray = Object.values(dialogues);
        characterColors = assignColors(allCharacters);
        let color;
        for (const key in dialoguesArray) {
            let character = dialoguesArray?.[key]["personnage"];
            color = activeCharacter !== character ? "white" : "black";
            const text = dialoguesArray[key]["replique"];
            div.innerHTML += `<p><b style="background-color: ${characterColors[character]}">${character}</b> : <span id=${key} style="background-color: ${color}">${text}</span></p>`;
        }
    }


    // Affichage du résultat dans la div prévue à cet effet
    if (resultDiv && ocrText) {
        resultDiv.innerHTML = '';
        dialoguesToHtml(getDialogues(ocrText), resultDiv);
        loadingDiv.innerHTML = '';
        // loadingDiv.style.marginTop = '0';
        createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
        createResetButton(charactersDiv, resetFiles.bind(fileInput, resultDiv, charactersDiv));
    }


    // Création d'un tableau à partir de la collection de boutons
    const arrayCharactersButtons = Array.from(charactersButtons);


    let activeCharacter = '';

    // Ajout d'un event listener sur chaque bouton
    for (const button of arrayCharactersButtons) {
        button.addEventListener('click', () => {
            let characterId = button.getAttribute('id');
            if (characterId) activeCharacter = activeCharacter === '' || activeCharacter !== characterId ? characterId : '';
            resultDiv.innerHTML = '';
            dialoguesToHtml(getDialogues(ocrText), resultDiv, activeCharacter);

            // Création d'un tableau à partir de la collection de paragraphes
            const arrayParagraph = Array.from(paragraphs);
            for (const p of arrayParagraph) {
                p.addEventListener('click', () => {
                    const span = p.getElementsByTagName('span')[0];
                    const characterLine = p.innerText.match(characterRegex)?.[0].replace(':', '').trim();
                    if (characterLine === characterId) span.style.backgroundColor = span.style.backgroundColor === "black" ? "white" : "black";
                });
            }
        });
    }

});


export {}