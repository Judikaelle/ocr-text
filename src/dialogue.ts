import {assignColors, getLines, isUppercase, replaceAll, splitLines} from "./utils";
import {characterRegex, didascalieRegex} from "./regex";
import {Dialogues} from "./types";
import {charactersButtons, paragraphs, resultSection} from "./dom";

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

const dialoguesToHtml = (dialogues: Dialogues, section: HTMLDivElement, allCharacters: Array<string>, activeCharacter: string | null = null) => {
    let characterColors: any = {};
    const dialoguesArray = Object.values(dialogues);
    characterColors = assignColors(allCharacters);
    let color;
    for (const key in dialoguesArray) {
        let character = dialoguesArray?.[key]["personnage"];
        color = activeCharacter !== character ? "white" : "black";
        const text = dialoguesArray[key]["replique"];
        section.innerHTML += `<div class="personnage-replique"><b style="background-color: ${characterColors[character]}">${character}</b> : <div class="replique" id=${key} style="background-color: ${color}">${text}</div></div>`;
    }
}

const selectedCharacter = (ocrText: string | undefined) => {
    // @ts-ignore
    const arrayCharactersButtons = [...charactersButtons];
    let activeCharacter = '';

    arrayCharactersButtons.forEach(button => {
        button.addEventListener('click', () => {
            const characterId = button.getAttribute('id');
            if (characterId) {
                activeCharacter = activeCharacter === '' || activeCharacter !== characterId ? characterId : '';
            }
            resultSection.innerHTML = '';
            const {dialogues, allCharacters} = getDialogues(ocrText);
            dialoguesToHtml(dialogues, resultSection, allCharacters, activeCharacter);


            // @ts-ignore
            const paragraphArray = [...paragraphs];
            paragraphArray.forEach(paragraph => {
                const characterLine = paragraph.innerText.match(characterRegex)?.[0].replace(':', '').trim();
                const replique = paragraph.querySelector('.replique') as HTMLDivElement;
                if (characterLine === characterId) {
                    // Reformate monologue
                    if (replique.innerHTML.length > 100) {
                        replique.innerHTML = splitLines(replique);
                        const lines = getLines();
                        lines.forEach(line => {
                            const div = document.createElement('div');
                            div.setAttribute('class', 'replique-line');
                            line.forEach(span => {
                                span.innerHTML = ` ${span.innerHTML} `;
                                div.appendChild(span);
                            });
                            if (div.innerHTML.length > 1) {
                                replique.appendChild(div);
                            }
                        });
                    }
                }
                if (replique.innerHTML.length > 100 && characterLine === characterId) {
                    const allLines = Array.from(document.getElementsByClassName('replique-line')) as HTMLDivElement[];
                    allLines.forEach(line => {
                        line.addEventListener('click', () => {
                            line.style.backgroundColor = line.style.backgroundColor === 'white' || '' ? 'black' : 'white'
                        });
                    });
                }
                paragraph.addEventListener('click', () => {
                    if (characterLine === characterId && replique.innerHTML.length <= 100) {
                            replique.style.backgroundColor = replique.style.backgroundColor === 'black' ? 'white' : 'black';
                        }
                });
            });
        });
    });
};


export {getDialogues, dialoguesToHtml, selectedCharacter};