import {characterRegex, didascalieRegex, ensembleRegex} from "./regex";
import {Dialogues} from "./types";
import {assignColors, getLines, removeDidascalies, splitPhrases} from "./utils";
import {charactersButtons, paragraphs, resultSection} from "./dom";

const formatExcelFile = (data: Object) => {
    const allDialogue: any = {};
    let allCharacters: Array<string> = [];
    let currentIndex = 1;

    // @ts-ignore
    for (const [line] of data) {
        if (line) {
            const newLine = removeDidascalies(line)
            const characterMatch = newLine.match(characterRegex);
            const didascalieMatch = newLine.match(didascalieRegex);
            // const parenthesesMatch = newLine.match(parenthesesRegex);
            const ensembleMatch = newLine.match(ensembleRegex);

            if (characterMatch) {
                let character = characterMatch[0].replace(':', '').trim();

                // Ajouter le personnage à la liste des personnages
                allCharacters.push(character);
                allCharacters = Array.from(new Set(allCharacters));

                const replique = newLine.replace(characterMatch[0], '').trim();

                // Créer un objet pour chaque dialogue
                allDialogue[currentIndex] = {"personnage": character, "replique": replique};
                currentIndex++;
            } else if (didascalieMatch) {
                const didascalie = didascalieMatch[0];
                const didascalieSplit = didascalie.split(' ');
                // const parentheses = parenthesesMatch?.[0];
                let character = didascalieSplit[0].trim();

                // Ajouter le personnage à la liste des personnages
                if (character === 'AMANDE') character = 'ARMANDE';
                allCharacters.push(character);
                allCharacters = Array.from(new Set(allCharacters));

                const replique = newLine.replace(didascalieMatch[0], '');

                // Créer un objet pour chaque dialogue
                allDialogue[currentIndex] = {
                    "personnage": didascalieSplit[0].trim(),
                    "replique": `${replique}`
                };
                currentIndex++;
            } else if (ensembleMatch) {
                const replique = line.replace(ensembleMatch[0], '').trim();

                // Créer un objet pour chaque dialogue
                allDialogue[currentIndex] = {"personnage": 'ENSEMBLE', "replique": replique};
                currentIndex++;
            } else {
                allDialogue[currentIndex - 1]["replique"] += ` ${newLine}`;
            }
        }
    }

    return {allDialogue, allCharacters};

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

const selectedCharacter = (text: Object) => {
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
            const {allDialogue, allCharacters} = formatExcelFile(text);
            dialoguesToHtml(allDialogue, resultSection, allCharacters, activeCharacter);

            // @ts-ignore
            const paragraphArray = [...paragraphs];
            paragraphArray.forEach(paragraph => {
                const characterLine = paragraph.innerText.match(characterRegex)?.[0].replace(':', '').trim();
                const replique = paragraph.querySelector('.replique') as HTMLDivElement;
                if (characterLine === characterId && replique.innerHTML.length > 100) {
                    // replique.innerHTML = splitLines(replique);
                    replique.innerHTML = splitPhrases(replique);
                    const lines = getLines();
                    lines.forEach(line => {
                        const div = document.createElement('div');
                        div.setAttribute('class', 'replique-line');
                        line.forEach(span => {
                            span.innerHTML = ` ${span.innerHTML} `;
                            if (replique.innerHTML.includes(span.innerHTML)) {
                                div.appendChild(span);
                            }
                        });
                        if (div.innerHTML.length > 1) {
                            replique.appendChild(div);
                        }
                    });

                }
                if (replique.innerHTML.length > 100 && characterLine === characterId) {
                    // const allPhrases = replique.innerText.split(/[.]{1,3}|[!?]{1,2}/);
                    const allLines = Array.from(replique.getElementsByClassName('replique-line')) as HTMLDivElement[];
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


export {formatExcelFile, dialoguesToHtml, selectedCharacter};