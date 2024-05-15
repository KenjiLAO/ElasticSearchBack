const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

const pokemonRoute = require('./routes/pokemon');

app.get('/pokemon/:name', pokemonRoute);
app.get('/pokemons', pokemonRoute);
app.get('/pokemonSelected/:input', pokemonRoute);
app.get('/randomPokemon', pokemonRoute);


