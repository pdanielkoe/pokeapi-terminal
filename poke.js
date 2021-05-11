const axios = require('axios');
const fs = require('fs');
const { exit } = require('process');

const config = require('./config/default.json');
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
            `id:\r\n    ${this.id}`,
            `name:\r\n    ${this.name}`,
            `types:    ${this.typesFormatter()}`,
            `locations_methods:    ${this.locationsMethodsFormatter()}`,
            `stats:    ${this.statsFormatter()}`,
        ].join('\r\n');
    }

    typesFormatter() {
        let temp = '';
        this.types.forEach(({ type }) => {
            temp += `\r\n    > ${type.name}`
        })
        return temp;
    }
    locationsMethodsFormatter() {
        let temp = '';

        this.locations_methods.forEach(({ location_area, version_details }) => {
            temp += `\r\n    > ${location_area.name}:`

            version_details.forEach(({ encounter_details, version}) => {
                temp += `\r\n        > ${version.name}:`
                
                let methods_set = new Set();
                
                encounter_details.forEach(({ method }) => {
                    methods_set.add(`${method.name}`);
                });

                methods_set.forEach((method) => {
                    temp += `\r\n            > ${method}`;
                });
            })
        })
        return (temp === '')?`\r\n    -`:temp;
    }
    statsFormatter() {
        let temp = '';
        this.stats.forEach(({ base_stat, stat }) => {
            temp += `\r\n    > ${stat.name}: ${base_stat}`
        })
        return temp;
    }
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


(async () => {
    try {

        const pokemon_data = await getPokemon(1);
        const encounter_data = await getEncounter(1, config.location);

        if (pokemon_data.data === 'Not Found') {
            return exit();
        }

        const pokemon = new Pokemon(
            pokemon_data.id,
            pokemon_data.name,
            pokemon_data.types,
            encounter_data,
            pokemon_data.stats
        )

        console.log(pokemon.show());


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