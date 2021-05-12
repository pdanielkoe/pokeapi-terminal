# pokeapi-terminal

## Setup
1. Clone the repo
   ```sh
   git clone https://github.com/pdanielkoe/pokeapi-terminal.git
   ```
2. Change directory
   ```sh
   cd pokeapi-terminal
   ```   
3. Install Dependencies
   ```sh
   npm install
   ```
   
## Usage
Get Pokemon details
   ```sh
   node poke.js <ID_OR_NAME>
   ```
Example
   ```sh
   node poke.js 1
   ```
   ```sh
   node poke.js bulbasaur
   ```
Expected Output:
   ```sh
    id:
        1
    name:
        bulbasaur
    types:
        > grass
        > poison
    locations_methods:
        -
    stats:
        > hp: 45
        > attack: 49
        > defense: 49
        > special-attack: 65
        > special-defense: 65
        > speed: 45
   ```
## Misc
- For changing the location may refer to `config/default.json`
   ```sh
      {
          "location": __PREFERABLE_LOCATION__,
          "url": "https://pokeapi.co",
          "cache": "cache.json"
      }
   ```
- Cache TTL currently fix to 7 days
