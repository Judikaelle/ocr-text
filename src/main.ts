import {assignColors, resetFiles} from "./utils";
import {createCharactersButtons, createResetButton} from "./html";
import {charactersDiv, fileInput, fileList, loadingDiv, resultSection} from "./dom";
import {performOcr, readFileAsDataUrl} from "./ocr";
import {dialoguesToHtml, getDialogues, selectedCharacter} from "./dialogue";
import {addImageToDB, getImageFromDB} from "./database";

// TODO: Ajouter Revealjs (https://revealjs.com/)
// TODO : Séparer par ligne les monologues (https://stackoverflow.com/questions/27915469/how-to-split-an-html-paragraph-up-into-its-lines-of-text-with-javascript) | Séparer phrase par phrase

let characterColors: any = {};
let file: File | undefined;
let ocrText: string | undefined;
let imageDataUrl;

// Récupération de l'image depuis la base de données
(async () => {
    file = await getImageFromDB("1").then(r => r)
    if (file) {
        imageDataUrl = await readFileAsDataUrl(file);
        fileList.innerText = file.name;
        ocrText = await performOcr(imageDataUrl, loadingDiv);
        let {dialogues, allCharacters} = getDialogues(ocrText);
        dialoguesToHtml(dialogues, resultSection, allCharacters, characterColors);
        loadingDiv.innerHTML = '';
        createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
        createResetButton(charactersDiv, resetFiles.bind(fileInput, resultSection, charactersDiv));
        selectedCharacter(ocrText)
    }
})()


fileInput.addEventListener('change', async () => {
    file = fileInput.files?.[0];
    if (file) {
        addImageToDB("1", file).then(r => console.log(r))
        resetFiles(fileInput, resultSection, charactersDiv);
        fileList.innerText = file.name;
        loadingDiv.innerHTML = 'Working...';
    }

    imageDataUrl = await readFileAsDataUrl(file);
    ocrText = await performOcr(imageDataUrl, loadingDiv);


    // Affichage du résultat dans la div prévue à cet effet
    if (resultSection && ocrText) {
        resultSection.innerHTML = '';
        let {dialogues, allCharacters} = getDialogues(ocrText);
        dialoguesToHtml(dialogues, resultSection, allCharacters, characterColors);
        loadingDiv.innerHTML = '';
        createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
        createResetButton(charactersDiv, resetFiles.bind(fileInput, resultSection, charactersDiv));
    }

    selectedCharacter(ocrText)


});


export {}