const axios = require('axios');
const fs = require('fs');

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
            // console.log(`REQUEST: ${area.url}`)
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
            // console.log(`REQUEST: ${url}`)
            requests.push(axios.get(url));
        })

        return Promise.all(requests)
            .then((reponses) => {
                reponses.forEach(async (response) => {
                    const data = response.data;
                    const pokemon = {
                        "id": data.id,
                        "name": data.name,
                        "types": data.types,
                        "location_method": data.location_area_encounters,
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

async function getPokemonEncounterDetails(pokemons, areas) {
    try {

        requests = [];

        const area_urls = areas.map(area => area.url);

        // console.log(area_urls);

        pokemons.forEach(async (pokemon) => {
            // console.log(`REQUEST: ${pokemon.location_method}`)
            requests.push(axios.get(pokemon.location_method));
        })

        return Promise.all(requests)
            .then((reponses) => {
                reponses.forEach((response, index) => {
                    const data = response.data;

                    pokemons[index].location_method = [];

                    data.forEach((area) => {
                        if (area_urls.includes(area.location_area.url)) {
                            pokemons[index].location_method.push(area)
                        }
                    });
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
        let pokemons = await getPokemonDetails(pokemon_encounters);
        pokemons = await getPokemonEncounterDetails(pokemons, areas);
        // console.log(location_data);
        // console.log(areas);
        // console.log(`pokemon_encounters:${pokemon_encounters}`);
        // console.log(`pokemons:${JSON.stringify(pokemons)}`);
        console.log(pokemons);

        // fs.writeFileSync('cache.json', JSON.stringify(pokemons));
    } catch (e) {
        console.log(e);
    }
})();