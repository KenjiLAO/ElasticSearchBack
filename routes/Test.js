const { Client } = require('@elastic/elasticsearch');

const client = new Client({

    node: 'https://32710f9c2fed4fbc80c8ec3c23078b47.us-central1.gcp.cloud.es.io',
    auth: {
        apiKey: 'RGZwcmRvOEJta2NRLTR3cGZJbXM6RVA3czFleWxTNDJvVFpXb0NwRUhFUQ=='
    }
});

async function getPokemonMapping() {
    try {
        const { body } = await client.indices.getMapping({ index: 'pokemon' });
        console.log(JSON.stringify(body, null, 2)); //
    } catch (error) {
        console.error(error);
    }
}

async function checkPokemonIndexExists() {
    try {
        const { body: indexExists } = await client.indices.exists({ index: 'pokemon' });
        if (indexExists) {
            console.log("L'index 'pokemon' existe.");
            // Appeler la fonction pour obtenir le mapping de l'index "pokemon"
            getPokemonMapping();
        } else {
            console.log("L'index 'pokemon' n'existe pas.");
            // Traiter le cas où l'index n'existe pas
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la vérification de l'existence de l'index 'pokemon':", error);
    }
}


async function testConnection() {
    try {
        const response = await client.ping();
        console.log("Connexion réussie !");
        console.log("Réponse :" + response);
    } catch (error) {
        console.error("Erreur lors de la connexion à Elasticsearch :", error);
    }
}
