import {assignColors, isUppercase, replaceAll} from "./utils";
import {characterRegex, didascalieRegex} from "./regex";
import {Dialogues} from "./types";
import {charactersButtons, paragraphs, resultDiv} from "./dom";

const getDialogues = (text: string | undefined) => {
    const repliques = text?.match(/[^\n]+/g);

    let allCharacters: Array<string> = [];
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
    return {dialogues, allCharacters};
}

const dialoguesToHtml = (dialogues: Dialogues, div: HTMLDivElement, allCharacters: Array<string>, activeCharacter: string | null = null) => {
    let characterColors: any = {};
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

const selectedCharacter = (ocrText: string | undefined) => {
// Création d'un tableau à partir de la collection de boutons
    const arrayCharactersButtons = Array.from(charactersButtons);
    let activeCharacter = '';

    // Ajout d'un event listener sur chaque bouton
    for (const button of arrayCharactersButtons) {
        button.addEventListener('click', () => {
            let characterId = button.getAttribute('id');
            console.log(characterId);
            if (characterId) activeCharacter = activeCharacter === '' || activeCharacter !== characterId ? characterId : '';
            resultDiv.innerHTML = '';
            let {dialogues, allCharacters} = getDialogues(ocrText);
            dialoguesToHtml(dialogues, resultDiv, allCharacters, activeCharacter);

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
}


export {getDialogues, dialoguesToHtml, selectedCharacter};