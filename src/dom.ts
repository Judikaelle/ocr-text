const fileInput = document.getElementById('file-input') as HTMLInputElement;
const resultSection = document.getElementById('result') as HTMLDivElement;
const charactersDiv = document.getElementById('characters') as HTMLDivElement;
const charactersButtons = document.getElementsByClassName('character-button') as HTMLCollectionOf<HTMLButtonElement>;
const paragraphs = document.getElementsByClassName('personnage-replique') as HTMLCollectionOf<HTMLDivElement>;
const fileList = document.getElementById('file-list') as HTMLDivElement;
const loadingDiv = document.getElementById('loading') as HTMLDivElement;

export {fileInput, resultSection, charactersDiv, charactersButtons, paragraphs, fileList, loadingDiv}