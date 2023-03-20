const fileInput = document.getElementById('file-input') as HTMLInputElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;
const charactersDiv = document.getElementById('characters') as HTMLDivElement;
const charactersButtons = document.getElementsByClassName('character-button') as HTMLCollectionOf<HTMLButtonElement>;
const paragraphs = document.getElementsByTagName('p') as HTMLCollectionOf<HTMLParagraphElement>;
const fileList = document.getElementById('file-list') as HTMLDivElement;
const loadingDiv = document.getElementById('loading') as HTMLDivElement;

export {fileInput, resultDiv, charactersDiv, charactersButtons, paragraphs, fileList, loadingDiv}