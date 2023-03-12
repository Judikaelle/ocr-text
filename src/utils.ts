export const isUppercase = (string: string) => {
    return /^\p{Lu}/u.test(string);
}

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

export const createResetButton = (div: HTMLDivElement, toDo: { (): void; (): void; }) => {
    const button = document.createElement('button');
    button.setAttribute('class', 'reset-button');
    button.innerText = 'Réinitialiser';
    button.addEventListener('click', () => {
        toDo();
    });
    div.appendChild(button);
}

export const replaceAll = (string: string) => {
    return string.replace('7', "?!").replace('))', ')');
}