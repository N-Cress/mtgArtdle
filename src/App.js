import testArt from './testimage.jpg'
import './App.css';
import { Autocomplete, TextField, Button } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [guessLeft, setGuessLeft] = useState(5);
  const [fieldValue, setFieldValue] = useState();
  const [winOrLose, setWinOrLose] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answer, setAnswer] = useState();
  const [artData, setArtData] = useState(false);


  function submitGuess() {
    const button = document.getElementById("submit");
    const field = document.getElementById("field");

    checkVictory(field.value)

    if (guessLeft === 1) {
      setGameOver(true)
      disableInputs();
    }

  }

  function checkVictory(guess) {
    if (guess === answer) {
      setWinOrLose(true)
      setGameOver(true)
      disableInputs();
    }
    else {
      setGuessLeft(prevCount => prevCount - 1);
    }
  }

  function disableInputs() {
    const button = document.getElementById("submit");
    const field = document.getElementById("field");

    button.disabled = true;
    button.style.backgroundColor = "grey";
    button.style.cursor = "not-allowed";
    field.style.cursor = "not-allowed";
    field.disabled = true;
  }

  useEffect(() => {
    async function retrieveArtInfo() {
      const { data } = await axios.get('https://api.scryfall.com/cards/random')
      console.log(data)
      setArtData(data)
      setAnswer(data.name)
    }
    retrieveArtInfo()
  }, [])

  return (
    <div id="game">
      <h1>MtgARTDLE </h1>
      <div id="image-container">
        {!!artData === true ? <img id="game-image" src={artData.image_uris.art_crop} alt="Guess the art" /> 
        : <div id="game-image" className="skeleton-image"></div>
        }
      </div>
      {gameOver === false ? <div className="guess-left"> {guessLeft} guesses left </div> 
      : winOrLose ? <div className="guess-left"> You won! </div> :
      <div className="guess-left"> You lost! </div>}
      <div id="hearts" className="guess-left">
      { Array.from({length: guessLeft},(_,index) => <Favorite className="heart"/>) }  
      { Array.from({length: 5 - guessLeft}, (_,index) => <FavoriteBorder />)}
      </div>
      <div id="input-container"> 
        <Autocomplete
          className="input"
          required
          id="field"
          freeSolo
          options={[
            { label: 'The Godfather', id: 1 },
            { label: 'Pulp Fiction', id: 2 },
            { label: 'Burgeoning', id: 3},
          ]}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Card Name" />}
        />
        <Button onClick={submitGuess} id="submit" className="submit_button" variant="contained"> Submit your guess</Button>
        {artData.name}
      </div>
  </div>
  );
}

export default App;
