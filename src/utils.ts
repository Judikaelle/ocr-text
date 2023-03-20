const isUppercase = (string: string) => {
    return /^\p{Lu}/u.test(string);
}

const replaceAll = (string: string) => {
    return string.replace('7', "?!").replace('))', ')');
}

const resetFiles = (...args: (HTMLDivElement | HTMLInputElement)[]) => {
    for (const a of args) {
        a.innerHTML = '';
        if ("value" in a) {
            a.value = '';
        }

    }
}

const assignColors = (characters: Array<string>) => {
    const colors = ["lightcoral", "lightskyblue", "lightgreen", "lightsalmon"]
    const charactersColors: any = {};
    for (const character of characters) {
        charactersColors[character] = colors[0];
        colors.splice(0, 1);
    }
    return charactersColors;
}

export {isUppercase, replaceAll, resetFiles, assignColors}