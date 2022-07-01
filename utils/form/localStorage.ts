export function saveToLocalStorage(toSave: any[], labels: string[]) {
    toSave.map((obj, index) => localStorage.setItem(labels[index], JSON.stringify(obj)));
}