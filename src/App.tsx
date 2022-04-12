/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import axios from "axios"
import PokemonColection from './components/PokemonColection';
import { Detail, Pokemon } from './interfact';



interface Pokemons {
  name: String;
  url: String;
}



const App: React.FC = () => {

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id: 0,
    isOpened: false,
  })

  const loadMore = async () => {
    setLoading(true);
    let res = await axios.get(nextUrl);
    setNextUrl(res.data.next);
    res.data.results.forEach(async (pokemon: Pokemons) => {
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
      setPokemons(p => [...p, poke.data]);

      setLoading(false);
    })
  }

  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20");
      setNextUrl(res.data.next);
      res.data.results.forEach(async (pokemon: Pokemons) => {
        const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        setPokemons(p => [...p, poke.data]);
        setLoading(false);
        // console.log(poke.data);
      })

    };

    getPokemon();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <header className="pokemon-header">
          Pokemon
        </header>
        <PokemonColection
          pokemons={pokemons}
          viewDetail={viewDetail}
          setDetail={setDetail} />
        {!viewDetail.isOpened && (
          <div className="btn">
            <button onClick={loadMore}>{loading ? "Loading..." : "Load more"}</button>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
