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

const splitLines = (monologue: HTMLDivElement) => {
    return monologue.innerHTML = monologue.innerText.split(/\s/).map(function (word) {
        return '<span>' + word + '</span>'
    }).join(' ');
}

const splitPhrases = (monologue: HTMLDivElement) => {
    return monologue.innerText.split(/(\.{1,3}|[!?][?!]?)/).map(function (phrase) {
        return '<span>' + phrase + '</span>'
    }).join(' ');
}


const getLines = () => {
    const lines = [];
    let line: HTMLSpanElement[] = [];
    let lastTop = -1;
    const words = Array.from(document.getElementsByTagName('span'));
    words.forEach((word) => {
        if (word.offsetTop !== lastTop) {
            lastTop = word.offsetTop;
            lines.push(line);
            line = [];
        }
        line.push(word);
    });
    lines.push(line);
    return lines;
};

const memoize = <T = any>(fn: { call: (arg0: any, arg1: T) => any; }) => {
    const cache = new Map();
    const cached = function (this: any, val: T) {
        return cache.has(val)
            ? cache.get(val)
            : cache.set(val, fn.call(this, val)) && cache.get(val);
    };
    cached.cache = cache;
    return cached;
};


export {isUppercase, replaceAll, resetFiles, assignColors, splitLines, splitPhrases, getLines, memoize}