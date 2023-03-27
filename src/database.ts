const DB_NAME = 'Excel';
const DB_VERSION = 1;
const DB_STORE_NAME = 'ExcelFile';

const openDB = () => {
    return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => {
            console.error("Erreur lors de l'ouverture de la base de données");
            reject(request.error);
        };

        request.onsuccess = () => {
            const db = request.result;
            console.log("Base de données ouverte avec succès");
            resolve(db);
        };

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(DB_STORE_NAME)) {
                db.createObjectStore(DB_STORE_NAME, {keyPath: 'id'});
                console.log(`Store ${DB_STORE_NAME} créé avec succès`);
            }
        };
    });
};

const addFileToDB = (imageId: string, imageData: File) => {
    return new Promise<void>(async (resolve, reject) => {
        const db = await openDB();

        const transaction = db.transaction(DB_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(DB_STORE_NAME);

        const image = {id: imageId, data: imageData};
        const request = store.add(image);

        request.onerror = () => {
            console.error(`Erreur lors de l'ajout de l'image ${imageId} à la base de données`);
            reject(request.error);
        };

        request.onsuccess = () => {
            console.log(`Image ${imageId} ajoutée à la base de données avec succès`);
            resolve();
        };
    });
};

const getFileFromDB = (imageId: string) => {
    return new Promise<File| undefined>(async (resolve, reject) => {
        const db = await openDB();

        const transaction = db.transaction(DB_STORE_NAME, 'readonly');
        const store = transaction.objectStore(DB_STORE_NAME);

        const request = store.get(imageId);

        request.onerror = () => {
            console.error(`Erreur lors de la récupération de l'image ${imageId} depuis la base de données`);
            reject(request.error);
        };

        request.onsuccess = () => {
            const image = request.result;
            if (!image) {
                console.warn(`L'image ${imageId} n'a pas été trouvée dans la base de données`);
                resolve(undefined);
            } else {
                console.log(`Image ${imageId} récupérée depuis la base de données avec succès`);
                resolve(image.data);
            }
        };
    });
};

export {openDB, addFileToDB, getFileFromDB};