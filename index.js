const express = require('express');
const app = express();
const port = 3000;
const { swaggerUi, swaggerSpec } = require('./swagger');

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

const pokemonRoute = require('./routes/pokemon');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/pokemon/:name', pokemonRoute);
app.get('/pokemons', pokemonRoute);
app.get('/pokemons/pagination/:page/:size', pokemonRoute);
app.get('/pokemonSelected/:name', pokemonRoute);
app.get('/randomPokemon', pokemonRoute);
app.get('/pokemonMostSearched', pokemonRoute);