export const isUppercase = (string: string) => {
    return /^\p{Lu}/u.test(string);
}

export const replaceAll = (string: string) => {
    return string.replace('7', "?!").replace('))', ')');
}

export const resetFiles = (...args: (HTMLDivElement | HTMLInputElement)[]) => {
    for (const a of args) {
        a.innerHTML = '';
        if ("value" in a) {
            console.log(a)
            a.value = '';
        }

    }
}

export const assignColors = (characters: Array<string>) => {
    const colors = ["lightcoral", "lightskyblue", "lightgreen", "lightsalmon"]
    const charactersColors: any = {};
    for (const character of characters) {
        charactersColors[character] = colors[0];
        colors.splice(0, 1);
    }
    return charactersColors;
}