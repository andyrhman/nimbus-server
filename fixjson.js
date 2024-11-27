import fs from 'fs';

const fixJson = () => {
    try {
        const path = './src/config/serviceAccount.json';
        const serviceAccountKey = process.env.GCP_SA_KEY;

        if (!serviceAccountKey) {
            throw new Error('Environment variable GCP_SA_KEY is not set');
        }

        const serviceAccount = JSON.parse(serviceAccountKey);
        fs.mkdirSync('./src/config', { recursive: true });
        fs.writeFileSync(path, JSON.stringify(serviceAccount, null, 2));

        console.log(`Service account file created successfully at: ${path}`);
    } catch (error) {
        console.error(`Error creating service account file: ${error.message}`);
        process.exit(1); 
    }
};

fixJson();
