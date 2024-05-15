const express = require('express');
const router = express.Router();

const { Client } = require('@elastic/elasticsearch');

const client = new Client({
    node: 'https://32710f9c2fed4fbc80c8ec3c23078b47.us-central1.gcp.cloud.es.io',
    auth: {
        apiKey: 'RGZwcmRvOEJta2NRLTR3cGZJbXM6RVA3czFleWxTNDJvVFpXb0NwRUhFUQ=='
    }
});

function formatPokemonData(hits) {
    return hits.hits.map(hit => ({
        "#": hit._source['#'],
        "Name": hit._source['Name'],
        "Type1": hit._source['Type1'],
        "Type2": hit._source['Type2'],
        "HP": hit._source['HP'],
        "Attack": hit._source['Attack'],
        "Sp_Atk": hit._source['Sp_Atk'],
        "Defense": hit._source['Defense'],
        "Sp_Def": hit._source['Sp_Def'],
        "Speed": hit._source['Speed'],
        "Variation": hit._source['Variation']
    }));
}

async function searchPokemonByName(pokemonName) {
    const { hits } = await client.search({
        index: 'pokemon',
        body: {
            query: {
                match: {
                    "Name": pokemonName
                }
            },
            _source: ["#", "Name", "Type1", "Type2", "HP", "Attack", "Sp_Atk", "Defense", "Sp_Def", "Speed", "Variation"]
        }
    });
    return formatPokemonData(hits);
}

async function getAllPokemon() {
    try {
        const { hits } = await client.search({
            index: 'pokemon',
            body: {
                query: {
                    match_all: {}
                },
                _source: ["#", "Name", "Type1", "Type2", "HP", "Attack", "Sp_Atk", "Defense", "Sp_Def", "Speed", "Variation"]
            }
        });
        return formatPokemonData(hits);
    } catch (error) {
        console.error(error);
    }

}

async function searchedPokemon(pokemonName) {
    const { hits } = await client.search({
        index: 'pokemon',
        body: {
            query: {
                fuzzy: {
                    Name: {
                        value: pokemonName                    }
                }
            }
        }
    });
    return formatPokemonData(hits);
}

async function getRandomPokemon() {
    const { hits } = await client.search({
        index: 'pokemon',
        body: {
            size: 1,
            query: {
                function_score: {
                    functions: [
                        {
                            random_score: {}
                        }
                    ]
                }
            }
        }
    });

    return formatPokemonData(hits);
}

router.get('/pokemons', async (req, res) => {
    const pokemonName = req.params.name;
    try {
        const results = await getAllPokemon();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;
    try {
        const results = await searchPokemonByName(pokemonName);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/pokemonSelected/:name', async (req, res) => {
    const pokemonName = req.params.name;
    try {
        const results = await searchedPokemon(pokemonName);
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/randomPokemon', async (req, res) => {
    try {
        const results = await getRandomPokemon();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;