export const isUppercase = (string: string) => {
    return /^\p{Lu}/u.test(string);
}

export const createCharactersButtons = (characters: Array<string>, div: HTMLDivElement) => {
    for (const character of characters) {
        const button = document.createElement('button');
        button.setAttribute('class', 'character-button');
        button.setAttribute('id', character)
        button.innerText = character;
        div.appendChild(button);
    }
}

export const createResetButton = (div: HTMLDivElement, toDo: { (): void; (): void; }) => {
    const button = document.createElement('button');
    button.setAttribute('class', 'reset-button');
    button.innerText = 'Réinitialiser';
    button.addEventListener('click', () => {
        toDo();
    });
    div.appendChild(button);
}