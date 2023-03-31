import {assignColors, resetFiles} from "./utils";
import {createCharactersButtons, createResetButton} from "./html";
import {charactersDiv, fileInput, loadingDiv, resultSection} from "./dom";
import {addFileToDB, getFileFromDB} from "./database";
import {importExcel} from "./import";
import {dialoguesToHtml, formatExcelFile, selectedCharacter} from "./dialogue";




// TODO: Ajouter Revealjs (https://revealjs.com/)
let excelText: Object;

// Récupération du fichier depuis la base de données
(async () => {
    file = await getFileFromDB("1").then(r => r)
    if (file) {
        excelText = await importExcel(file)
        let {allDialogue, allCharacters} = formatExcelFile(excelText)
        dialoguesToHtml(allDialogue, resultSection, allCharacters, characterColors);
        loadingDiv.innerHTML = '';
        createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
        createResetButton(charactersDiv, resetFiles.bind(fileInput, resultSection, charactersDiv));
        selectedCharacter(excelText)
        // const memoizeSelectedCharacter = memoize(selectedCharacter)
        // memoizeSelectedCharacter(excelText)
    }
})()



let characterColors: any = {};
let file: File | undefined;


fileInput.addEventListener('change', async () => {
    file = fileInput.files?.[0];
    if (file) {
        addFileToDB("1", file).then(r => console.log(r))
        excelText = await importExcel(file)
        let {allDialogue, allCharacters} = formatExcelFile(excelText)
        dialoguesToHtml(allDialogue, resultSection, allCharacters, characterColors);
        loadingDiv.innerHTML = '';
        createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
        createResetButton(charactersDiv, resetFiles.bind(fileInput, resultSection, charactersDiv));
        selectedCharacter(excelText)
    }
});

// function getPosition(element: HTMLElement | null) {
//     const rect = element?.getBoundingClientRect();
//     return {
//         x: rect?.left,
//         y: rect?.top
//     };
// }
//
// const {x, y} = getPosition(document.getElementById("result"));
// const element = document.elementFromPoint(0, 500);
// console.log(element)

export {}