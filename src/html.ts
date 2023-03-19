export const createCharactersButtons = (characters: Array<string>, div: HTMLDivElement, characterColors: any) => {
    for (const character of characters) {
        const button = document.createElement('button');
        button.setAttribute('class', 'character-button');
        button.setAttribute('id', character)
        button.style.backgroundColor = characterColors[character];
        button.innerText = character;
        div.appendChild(button);
    }
}

export const createResetButton = (div: HTMLDivElement, toDo: (...args: (HTMLDivElement | HTMLInputElement)[]) => void) => {
    const button = document.createElement('button');
    button.setAttribute('class', 'reset-button');
    button.innerText = 'Réinitialiser';
    button.addEventListener('click', () => {
        toDo();
    });
    div.appendChild(button);
}