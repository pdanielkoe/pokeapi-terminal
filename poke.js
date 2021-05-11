const axios = require('axios');

const config = require('./config/default.json');

const endpoints = {
    "location": "api/v2/location"
}

async function getLocation() {
    try {
        const location_req = await axios.get(`${config.url}/${endpoints.location}/${config.location}/`);
        return location_req.data;
    } catch (error) {
        console.error(error);
    }
}

async function getPokemonWithinAreas(areas) {
    try {

        requests = [];

        let pokemon_encounters = [];

        areas.forEach(async (area) => {
            requests.push(axios.get(area.url));
        })

        return Promise.all(requests)
            .then((reponses) => {
                reponses.forEach((response) => {
                    const pokemon_within_area = response.data.pokemon_encounters;
                    // console.log(pokemon_within_area);
                    pokemon_within_area.forEach((pokemon) => {
                        pokemon_encounters.push(pokemon.pokemon.url)
                    })
                });
                return pokemon_encounters;
            });

    } catch (error) {
        console.error(error);
    }
}

async function getPokemonDetails(pokemon_urls) {
    try {

        requests = [];

        let pokemons = [];

        pokemon_urls.forEach(async (url) => {
            requests.push(axios.get(url));
        })

        return Promise.all(requests)
            .then((reponses) => {
                reponses.forEach((response) => {
                    const data = response.data;
                    const pokemon = {
                        "id": data.id,
                        "name": data.name,
                        "types": data.types.map(type => type.type.name),
                        "location_method": "",
                        "stats": data.stats.map(stat => ({
                            "name": stat.stat.name,
                            "base_stat": stat.base_stat,
                        })),
                    }
                    // console.log(pokemon);
                    pokemons.push(pokemon)
                });
                return pokemons;
            });

    } catch (error) {
        console.error(error);
    }
}

(async () => {
    try {
        const location_data = await getLocation();
        const areas = location_data.areas;
        const pokemon_encounters = await getPokemonWithinAreas(areas);
        const pokemons = await getPokemonDetails(pokemon_encounters);
        // console.log(location_data);
        // console.log(areas);
        // console.log(`pokemon_encounters:${pokemon_encounters}`);
        console.log(`pokemons:${JSON.stringify(pokemons)}`);
        console.log(pokemons);
    } catch (e) {
        console.log(e);
    }
})();