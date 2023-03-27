import * as XLSX from 'xlsx';

const importExcel = async (file?: File) : Promise<Object> =>  {
    if (!file) {
        const inputElement = document.getElementById('file-input') as HTMLInputElement;
        if (!inputElement) {
            throw new Error('Le champ de fichier est introuvable.');
        }
        // @ts-ignore
        const [selectedFile] = inputElement.files;
        if (!selectedFile) {
            throw new Error('Aucun fichier sélectionné.');
        }
        file = selectedFile;
    }

    // @ts-ignore
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, {type: 'array'});
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet, { header: 1 });
};

export { importExcel };
