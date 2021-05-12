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
* Sample
   ```sh
   node poke.js 1
   ```
   ```sh
   node poke.js bulbasaur
   ```
   Output:
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
* Sample
   ```sh
   node poke.js 54
   ```
   ```sh
   node poke.js psyduck
   ```
   Output:
   ```sh
   id:
       54
   name:
       psyduck
   types:
       > water
   locations_methods:
       > kanto-route-12-area:
           > firered:
               > super-rod
       ...
   stats:
       > hp: 50
       > attack: 52
       > defense: 48
       > special-attack: 65
       > special-defense: 50
       > speed: 55
   ```
   
## Output Description
```sh
   id:                        #Pokemon ID
       54
   name:                      #Pokemon name
       psyduck 
   types:                     #Pokemon types
       > water
   locations_methods:
       > kanto-route-12-area: #Encounter location area
           > firered:         #Game Versions
               > super-rod    #Catch methods based on game version
       ...
   stats:                     #Pokemon base stats
       > hp: 50
       > attack: 52
       > defense: 48
       > special-attack: 65
       > special-defense: 50
       > speed: 55
   ```

## Misc
- For changing the location may refer to `config/default.json`, currently set to "Kanto"
   ```sh
      {
          "location": __PREFERABLE_LOCATION__,
          "url": "https://pokeapi.co",
          "cache": "cache.json"
      }
   ```
- Cache TTL currently fix to 7 days
