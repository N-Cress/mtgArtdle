import victorySound from './correct-answer-sound-effect.mp3';
import incorrectSound from './incorrect.mp3';
import './App.css';
import { Autocomplete, TextField, Button } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';


function App() {
  const [guessLeft, setGuessLeft] = useState(5);
  const [fieldValue, setFieldValue] = useState();
  const [winOrLose, setWinOrLose] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [answer, setAnswer] = useState();
  const [artData, setArtData] = useState(false);

  const wSound = new Audio(victorySound)
  const lSound = new Audio(incorrectSound)

  wSound.volume = 0.1;
  lSound.volume = 0.1;

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
      setWinOrLose(true);
      setGameOver(true);
      disableInputs();
      wSound.play()
      confetti({
        spread: 180,
        particleCount: 150
      });
    }
    else {
      setGuessLeft(prevCount => prevCount - 1);
      lSound.play();
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
        {artData ? <img id="game-image" src={artData.image_uris.art_crop} alt="Guess the art" /> 
        : <div className="skeleton-image"></div>
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
        <TextField margin="dense" id="field" className="input" label="Card Name" />
        <div className="space"></div>
        <Button id="submit" onClick={submitGuess}  className="submit_button" variant="contained"> Submit your guess</Button>
      </div>
      {artData.name}
  </div>
  );
}

export default App;
