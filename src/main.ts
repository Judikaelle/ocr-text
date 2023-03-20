import {assignColors, resetFiles} from "./utils";
import {createCharactersButtons, createResetButton} from "./html";
import {charactersDiv, fileInput, fileList, loadingDiv, resultDiv} from "./dom";
import {performOcr, readFileAsDataUrl} from "./ocr";
import {dialoguesToHtml, getDialogues, selectedCharacter} from "./dialogue";
import {addImageToDB, getImageFromDB} from "./database";

// TODO: Ajouter Revealjs (https://revealjs.com/)

let characterColors: any = {};
let file: File | undefined;
let ocrText: string | undefined;
let imageDataUrl;

// Récupération de l'image depuis la base de données
file = await getImageFromDB("1").then(r => r)
if (file) {
    imageDataUrl = await readFileAsDataUrl(file);
    fileList.innerText = file.name;
    ocrText = await performOcr(imageDataUrl, loadingDiv);
    let {dialogues, allCharacters} = getDialogues(ocrText);
    dialoguesToHtml(dialogues, resultDiv, allCharacters, characterColors);
    loadingDiv.innerHTML = '';
    createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
    createResetButton(charactersDiv, resetFiles.bind(fileInput, resultDiv, charactersDiv));
}

selectedCharacter(ocrText)

fileInput.addEventListener('change', async () => {
    file = fileInput.files?.[0];
    if (file) {
        addImageToDB("1", file).then(r => console.log(r))
        resetFiles(fileInput, resultDiv, charactersDiv);
        fileList.innerText = file.name;
        loadingDiv.innerHTML = 'Working...';
    }

    imageDataUrl = await readFileAsDataUrl(file);
    ocrText = await performOcr(imageDataUrl, loadingDiv);


    // Affichage du résultat dans la div prévue à cet effet
    if (resultDiv && ocrText) {
        resultDiv.innerHTML = '';
        let {dialogues, allCharacters} = getDialogues(ocrText);
        dialoguesToHtml(dialogues, resultDiv, allCharacters, characterColors);
        loadingDiv.innerHTML = '';
        createCharactersButtons(allCharacters, charactersDiv, assignColors(allCharacters));
        createResetButton(charactersDiv, resetFiles.bind(fileInput, resultDiv, charactersDiv));
    }

    selectedCharacter(ocrText)


});


export {}