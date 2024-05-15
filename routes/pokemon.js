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
        "Id": hit._source['#'],
        "Name": hit._source['Name'],
        "Type1": hit._source['Type1'],
        "Type2": hit._source['Type2'],
        "HP": hit._source['HP'],
        "Attack": hit._source['Attack'],
        "Sp_Atk": hit._source['Sp_ Atk'],
        "Defense": hit._source['Defense'],
        "Sp_Def": hit._source['Sp_ Def'],
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
            _source: ["#", "Name", "Type1", "Type2", "HP", "Attack", "Sp_ Atk", "Defense", "Sp_ Def", "Speed", "Variation"]
        }
    });
    return formatPokemonData(hits);
}

async function getAllPokemon() {
    try {
        const { hits } = await client.search({
            index: 'pokemon',
            body: {
                "size": 1200,
                query: {
                    match_all: {}
                },
                _source: ["#", "Name", "Type1", "Type2", "HP", "Attack", "Sp_ Atk", "Defense", "Sp_ Def", "Speed", "Variation"]
            }
        });

        return formatPokemonData(hits);
    } catch (error) {
        console.error(error);
    }
}

const pageSize = 20;
async function fetchPokemons(page) {
    try {
        const { hits } = await client.search({
            index: 'pokemon',
            body: {
                from: (page - 1) * pageSize,
                size: pageSize,
                query: {
                    match_all: {}
                }
            }
        });
        return formatPokemonData(hits);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchAllPokemons() {
    let allPokemons = {};
    let page = 1;
    let fetchedPokemons;

    do {
        fetchedPokemons = await fetchPokemons(page);
        allPokemons[page.toString()] = fetchedPokemons;
        page++;
    } while (fetchedPokemons.length === pageSize);

    return allPokemons;
}


async function searchedPokemon(pokemonName) {
    const { hits } = await client.search({
        index: 'pokemon',
        body: {
            query: {
                fuzzy: {
                    Name: {
                        value: pokemonName
                    }
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

async function createSearchedPokemonIndex() {
    await client.indices.create({
        index: 'searched_pokemon',
        body: {
            mappings: {
                properties: {
                    Name: { type: 'keyword' },
                    timestamp: { type: 'date' }
                }
            }
        }
    });
}

async function logSearch(pokemonName) {
    try {
        const { hits } = await client.search({
            index: 'pokemon',
            body: {
                query: {
                    match: {
                        Name: pokemonName
                    }
                }
            }
        });

        if (hits.total.value > 0) {
            await client.index({
                index: 'searched_pokemon',
                body: {
                    Name: pokemonName,
                    timestamp: new Date()
                }
            });
            console.log(`Recherche pour "${pokemonName}" enregistrée.`);
        } else {
            console.log(`Le Pokémon "${pokemonName}" n'existe pas dans l'index.`);
        }
    } catch (error) {
        console.error('Error logging search:', error);
        throw error;
    }
}

async function getMostSearchedPokemon() {
    const { aggregations } = await client.search({
        index: 'searched_pokemon',
        body: {
            size: 0,
            aggs: {
                most_searched: {
                    terms: {
                        field: 'Name',
                        size: 20,
                        order: {
                            _count: 'desc'
                        }
                    }
                }
            }
        }
    });
    return aggregations.most_searched.buckets;
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

router.get('/pokemons/paggination', async (req, res) => {
    const pokemonName = req.params.name;
    try {
        const results = await fetchAllPokemons();
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;
    await logSearch(pokemonName);
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

router.get('/pokemonMostSearched', async (req, res) => {
    try {
        const mostSearched = await getMostSearchedPokemon();
        res.json(mostSearched);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;