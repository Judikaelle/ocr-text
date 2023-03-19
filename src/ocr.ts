// Fonction permettant la lecture d'un fichier en tant qu'URL Data
import {createWorker} from "tesseract.js";

export async function readFileAsDataUrl(file?: File): Promise<string> {
    if (!file) {
        throw new Error('Fichier non trouvé');
    }
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export const performOcr = async (image: string, loadingDiv: HTMLDivElement) => {
    let progress = 0;
    const worker = await createWorker({
        logger: l => {
            if (l.status === 'recognizing text') {
                progress = Math.round(l.progress * 100);
                loadingDiv.innerText = `Working... ${progress}%`;
            }
        }
    });

    try {
        await worker.loadLanguage('fra');
        await worker.initialize('fra');
        const {data: {text}} = await worker.recognize(image);
        return text;
    } catch (error) {
        console.log(error);
    } finally {
        await worker.terminate();
    }
    return
}