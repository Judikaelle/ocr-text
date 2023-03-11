export const isUppercase = (string: string) => {
    return /^\p{Lu}/u.test(string);
}