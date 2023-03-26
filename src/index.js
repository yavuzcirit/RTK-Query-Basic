import React from "react";
import ReactDOM from "react-dom/client";
import {createApi,ApiProvider,fetchBaseQuery} from "@reduxjs/toolkit/query/react"


// interface PokemonListing {
//   count:number;
//   results:Array<{
//     name:string;
//     url:string;
//   }>
// }

// interface PokemonDetailData {
//   id:number;
//   name:string;
//   height:number;
//   width:number;
//   types:Array<{
//     slot:number;
//     type:{
//       name:string;
//       url:string
//     }
//   }>;
//   sprites:{
//     front_default:string
//   }
// }



// // data copy & pasted from https://pokeapi.co/api/v2/pokemon?limit=9
// const fakePokemonListing = {
//   count: 1126,
//   next: "https://pokeapi.co/api/v2/pokemon?offset=9&limit=9",
//   previous: null,
//   results: [
//     { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
//     { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
//     { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
//     { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
//     { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
//     { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
//     { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
//     { name: "wartortle", url: "https://pokeapi.co/api/v2/pokemon/8/" },
//     { name: "blastoise", url: "https://pokeapi.co/api/v2/pokemon/9/" },
//   ],
// };

// // partial data of https://pokeapi.co/api/v2/pokemon/1/
// const fakePokemonDetailData = {
//   id: 1,
//   name: "bulbasaur",
//   height: 7,
//   weight: 69,
//   types: [
//     {
//       slot: 1,
//       type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
//     },
//     {
//       slot: 2,
//       type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
//     },
//   ],
//   sprites: {
//     front_default:
//       "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
//   },
// };




function simulateLoading(){
  return new Promise((resolve)=>setTimeout(resolve,500))
}

const api =createApi({
  baseQuery:fetchBaseQuery({
    baseUrl:`https://pokeapi.co/api/v2/`
  }),
  endpoints:build => ({
    pokemonList: build.query({
      query(){
       return {
        url:"pokemon",
        params:{
          limit:100
        },
        method:"GET"
       }
      }
    }),
    pokemonDetail: build.query({
      query: ({name}) => `pokemon/${name}/`
    })
  }),
})

const {usePokemonListQuery, usePokemonDetailQuery} = api 



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApiProvider api={api}>
    <App />
    </ApiProvider>
  </React.StrictMode>
);


function App() {
  const [selectedPokemon, selectPokemon] = React.useState(undefined);

  return (
    <>
      <header>
        <h1>My Pokedex</h1>
      </header>
      <main>
        {selectedPokemon ? (
          <>
            <PokemonDetails pokemonName={selectedPokemon} />
            <button onClick={() => selectPokemon(undefined)}>back</button>
          </>
        ) : (
          <PokemonList onPokemonSelected={selectPokemon} />
        )}
      </main>
    </>
  );
}

function PokemonList({ onPokemonSelected }) {
  const {data, isLoading,isError,isSuccess} = usePokemonListQuery();

  if(isLoading){
    return "isLoading..."
  }

  if(isError){
    return "Something goes wrong..."
  }

  if(isSuccess){
    return (
      <article>
        <h2>Overview</h2>
        <ol start={1}>
          {data.results.map((pokemon) => (
            <li key={pokemon.name}>
              <button onClick={() => onPokemonSelected(pokemon.name)}>
                {pokemon.name}
              </button>
            </li>
          ))}
        </ol>
      </article>
    );
  }
  

  
}

const listFormatter = new Intl.ListFormat("en-GB", {
  style: "short",
  type: "conjunction",
});
function PokemonDetails({ pokemonName }) {
  const {data, isLoading,isError,isSuccess} = usePokemonDetailQuery({name: pokemonName});

  if(isLoading){
    return "isLoading..."
  }

  if(isError){
    return "Something goes wrong..."
  }

  if(isSuccess){
    return (
      <article>
        <h2>{data.name}</h2>
        <img src={data.sprites.front_default} alt={data.name} />
        <ul>
          <li>id: {data.id}</li>
          <li>height: {data.height}</li>
          <li>weight: {data.weight}</li>
          <li>
            types:
            {listFormatter.format(data.types.map((item) => item.type.name))}
          </li>
        </ul>
      </article>
    );
  }

  
}
