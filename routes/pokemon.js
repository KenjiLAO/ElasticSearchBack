const express = require('express');
const router = express.Router();

const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'https://32710f9c2fed4fbc80c8ec3c23078b47.us-central1.gcp.cloud.es.io',
    auth: {
        apiKey: 'RGZwcmRvOEJta2NRLTR3cGZJbXM6RVA3czFleWxTNDJvVFpXb0NwRUhFUQ=='
    }
});

async function searchPokemonByName(pokemonName) {
    const { hits } = await client.search({
        index: 'pokemon',
        body: {
            query: {
                match: {
                    "Name": pokemonName
                }
            },
            _source: ["#", "Name", "Type1", "Type2", "Variation"]
        }
    });
    const res = hits.hits.map(hit => ({
        "#": hit._source['#'],
        "Name": hit._source['Name'],
        "Type1": hit._source['Type1'],
        "Type2": hit._source['Type2']
    }));

    return res;
}

async function getAllPokemon() {
    try {
        const { hits } = await client.search({
            index: 'pokemon',
            body: {
                query: {
                    match_all: {}
                },
                _source: ["#", "Name", "Type1", "Type2", "Variation"]
            }
        });
        hits.hits.map(poke => console.log(poke))
        const res = hits.hits.map(hit => ({
            "#": hit._source['#'],
            "Name": hit._source['Name'],
            "Type1": hit._source['Type1'],
            "Type2": hit._source['Type2']
        }));

        return res;
    } catch (error) {
        console.error(error);
    }

}

router.get('/pokemons', async (req, res) => {
    console.log("test")
    const pokemonName = req.params.name;
    try {
        const results = await getAllPokemon();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/pokemon/:name', async (req, res) => {
    console.log("test")
    const pokemonName = req.params.name;
    try {
        const results = await searchPokemonByName(pokemonName);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
