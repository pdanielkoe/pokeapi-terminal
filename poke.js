const axios = require('axios');
const fs = require('fs');
const { exit } = require('process');

const config = require('./config/default.json');

// const endpoints = {
//     "location": "api/v2/location",
//     "pokemon": "api/v2/pokemon"
// }

// async function getLocation(location_name) {
//     try {
//         const location_req = await axios.get(`${config.url}/${endpoints.location}/${location_name}/`);
//         return location_req.data;
//     } catch (error) {
//         console.error(error);
//     }
// }

// async function getPokemonWithinAreas(areas) {
//     try {

//         let requests = [];

//         let pokemon_encounters = [];

//         areas.forEach(async (area) => {
//             console.log(`REQUEST: ${area.url}`)
//             requests.push(axios.get(area.url));
//         })

//         return Promise.all(requests)
//             .then((reponses) => {
//                 reponses.forEach((response) => {
//                     const pokemon_within_area = response.data.pokemon_encounters;
//                     // console.log(pokemon_within_area);
//                     pokemon_within_area.forEach((pokemon) => {
//                         pokemon_encounters.push(pokemon.pokemon.url)
//                     })
//                 });
//                 return pokemon_encounters;
//             });

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function getPokemonDetails(pokemon_urls) {
//     try {

//         let requests = [];

//         let pokemons = [];

//         pokemon_urls.forEach(async (url) => {
//             console.log(`REQUEST: ${url}`)
//             requests.push(axios.get(url));
//         })

//         return Promise.all(requests)
//             .then((reponses) => {
//                 reponses.forEach(async (response) => {
//                     const data = response.data;
//                     const pokemon = {
//                         "id": data.id,
//                         "name": data.name,
//                         "types": data.types,
//                         "location_method": data.location_area_encounters,
//                         "stats": data.stats.map(stat => ({
//                             "name": stat.stat.name,
//                             "base_stat": stat.base_stat,
//                         })),
//                     }
//                     // console.log(pokemon);
//                     pokemons.push(pokemon)
//                 });
//                 return pokemons;
//             });

//     } catch (error) {
//         console.error(error);
//     }
// }

// async function getPokemonEncounterDetails(pokemons, areas) {
//     try {

//         let requests = [];

//         const area_urls = areas.map(area => area.url);

//         // console.log(area_urls);

//         pokemons.forEach(async (pokemon) => {
//             console.log(`REQUEST: ${pokemon.location_method}`)
//             requests.push(axios.get(pokemon.location_method));
//         })

//         return Promise.all(requests)
//             .then((reponses) => {
//                 reponses.forEach((response, index) => {
//                     const data = response.data;

//                     pokemons[index].location_method = [];

//                     data.forEach((area) => {
//                         if (area_urls.includes(area.location_area.url)) {
//                             pokemons[index].location_method.push(area)
//                         }
//                     });
//                 });

//                 return pokemons;
//             });

//     } catch (error) {
//         console.error(error);
//     }

// }

async function getPokemon(id_or_name) {
    try {
        const pokemon_req = await axios.get(`${config.url}/api/v2/pokemon/${id_or_name}/`);
        return pokemon_req.data;
    } catch (error) {
        console.error(error);
    }
}

async function getEncounter(id_or_name, location) {

    try {
        const encounter_req = await axios.get(`${config.url}/api/v2/pokemon/${id_or_name}/encounters`);

        let encounter_details = []

        encounter_req.data.forEach(async (encounter) => {
            if (encounter.location_area.name.indexOf(location) !== -1) {
                // console.log(encounter.location_area.name)
                encounter_details.push(encounter)
            }
        })
        return encounter_details;
    } catch (error) {
        console.error(error);
    }
}


class Pokemon {
    constructor(id, name, types, locations_methods, stats) {
        this.id = id;
        this.name = name;
        this.types = types;
        this.locations_methods = locations_methods;
        this.stats = stats;
    }

    show() {
        return [
            `id: ${this.id}`,
            `name: ${this.name}`,
            `types: ${this.types}`,
            `locations_methods: ${this.locations_methods}`,
            `stats: ${this.stats}`,
        ].join('\r\n');
    }

    typesFormatter() { }
    locationsMethodsFormatter() { }
    statsFormatter() { }
    toJSON() {
        return JSON.stringify({
            "id": this.id,
            "name": this.name,
            "types": this.types,
            "locations_methods": this.locations_methods,
            "stats": this.stats,
        })
    }

}

(async () => {
    try {
        // const location_data = await getLocation();
        // const areas = location_data.areas;
        // const pokemon_encounters = await getPokemonWithinAreas(areas);
        // let pokemons = await getPokemonDetails(pokemon_encounters);
        // pokemons = await getPokemonEncounterDetails(pokemons, areas);
        // console.log(location_data);
        // console.log(areas);
        // console.log(`pokemon_encounters:${pokemon_encounters}`);
        // console.log(`pokemons:${JSON.stringify(pokemons)}`);

        const pokemon_data = await getPokemon(54);
        const encounter_data = await getEncounter(54, config.location);

        if (pokemon_data.data === 'Not Found') {
            return exit();
        }

        // const location_data = await getLocation(config.location);
        // const areas = location_data.areas;

        const pokemon = new Pokemon(
            pokemon_data.id,
            pokemon_data.name,
            pokemon_data.types,
            encounter_data,
            pokemon_data.stats
        )

        console.log(pokemon);


        //test

        // try {
        //     const pokemon_req = await axios.get(`https://pokeapi.co/api/v2/location/?limit=796`);
        //     test = pokemon_req.data.results;

        //     console.log('location:')
        //     test.forEach((location) => {
        //         if (location.name.indexOf(config.location) !== -1) {

        //             console.log(` - ${location.name}`)
        //         }
        //     });
        // } catch (error) {
        //     console.error(error);
        // }

        // try {
        //     const pokemon_req = await axios.get(`https://pokeapi.co/api/v2/location-area/?limit=702`);
        //     test = pokemon_req.data.results;

        //     console.log('location-area:')
        //     test.forEach((area) => {
        //         if (area.name.indexOf(config.location) !== -1) {

        //             console.log(` - ${area.name}`)
        //         }
        //     });
        // } catch (error) {
        //     console.error(error);
        // }


        // fs.writeFileSync('cache.json', JSON.stringify(pokemons));
    } catch (e) {
        console.log(e);
    }
})();