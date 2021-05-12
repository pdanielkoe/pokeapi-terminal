const axios = require('axios');
const fs = require('fs');
const util = require('util');
const { exit } = require('process');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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

            version_details.forEach(({ encounter_details, version }) => {
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
        return (temp === '') ? `\r\n    -` : temp;
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

class Cache {
    constructor(filename) {
        this.filename = filename;
        // this.cache_ttl = 60 * 60 * 24 * 7 * 1000;
        this.cache_ttl =  10*1000;
        this.data = [];
    }
    async load() {
        try {
            const raw_cache = await readFile(this.filename);
            this.data = JSON.parse(raw_cache);
            return;
        } catch (error) {
            // console.error(error);
        }
    }
    async store(pokemon) {

        try {
            const cache_timestamp = new Date().getTime();

            const cache_pokemon = JSON.parse(pokemon.toJSON())
            cache_pokemon.cache_timestamp = cache_timestamp

            this.clear(pokemon.id);
            
            this.data.push(cache_pokemon)

            await writeFile(
                this.filename,
                JSON.stringify(this.data));
            return 'cached';
        } catch (error) {
            console.error(error);
        }
    }
    clear(id) {
        const filtered = this.data.filter((val, key) => {
            return val.id != id;
        })
        this.data = filtered;
    }
    get(id_or_name) {
        const pokemon = this.data;

        for (let i = 0; i < pokemon.length; i++) {

            // check if the pokemon with given id or name exits in cache, and the cahce is not expired
            if ((pokemon[i].id == id_or_name || pokemon[i].name == id_or_name) && !this.isExpired(pokemon[i].cache_timestamp)) {
                return pokemon[i];
            }
        }

        return null;
    }
    isExpired(cache_timestamp) {
        return (new Date().getTime() - cache_timestamp > this.cache_ttl) ? true : false;
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
        // const test_input = 'bulbasaur';
        const test_input = 1;
        // const test_input = '1';

        const id_or_name = test_input

        const cache = new Cache(config.cache);
        await cache.load();

        const cache_pokemon = cache.get(id_or_name);

        if (cache_pokemon == null) {
            // not exist in cache
            console.log('CRAWL DATA');
            const pokemon_data = await getPokemon(id_or_name);
            const encounter_data = await getEncounter(id_or_name, config.location);

            if (pokemon_data.data === 'Not Found') {
                console.log('Not Found');
                return exit();
            }

            const pokemon = new Pokemon(
                pokemon_data.id,
                pokemon_data.name,
                pokemon_data.types,
                encounter_data,
                pokemon_data.stats
            )

            cache.store(pokemon)
            console.log(pokemon.show());

        } else {
            // load from cache
            console.log('CACHED DATA');
            const pokemon = new Pokemon(
                cache_pokemon.id,
                cache_pokemon.name,
                cache_pokemon.types,
                cache_pokemon.locations_methods,
                cache_pokemon.stats
            )
            console.log(pokemon.show());
        }

    } catch (e) {
        console.log(e);
    }
})();