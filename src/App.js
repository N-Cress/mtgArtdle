import victorySound from './correct-answer-sound-effect.mp3';
import incorrectSound from './incorrect.mp3';
import './App.css';
import { TextField, Button } from '@mui/material';
import { Favorite, FavoriteBorder, VolumeMute, VolumeOff } from '@mui/icons-material';
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
  const [volume, setVolume] = useState(true);
  const [volumeValue, setVolumeValue] = useState(0.1);

  const wSound = new Audio(victorySound)
  const lSound = new Audio(incorrectSound)
  

  function toggleVolume() {
    setVolume((prev) => !prev)
    console.log(volume)
    switch (volume) {
      case true:
        setVolumeValue(0)
        console.log(lSound.volume)
        break;
      case false:
        setVolumeValue(0.1)
        console.log(lSound.volume)
        break;
      default: 
        break;
    }
  }

  function submitGuess() {
    const button = document.getElementById("submit");
    const field = document.getElementById("field");

    checkVictory(field.value)
    const img = document.getElementById("game-image");
    const artist = document.getElementById("artist");
    const cmc = document.getElementById("cmc");
    const set_name = document.getElementById("set_name");
    const flavor_text = document.getElementById("flavor_text");

    console.log(guessLeft)
    switch (guessLeft) {
      case 5: 
        img.style.filter = "blur(5px)";
        cmc.innerHTML = `CMC: ${artData.cmc}`;
        break;
      case 4:
        img.style.filter = "blur(4px)";
        set_name.innerHTML = `Set Name: ${artData.set_name}`
        break;
      case 3:
        img.style.filter = "blur(3px)";
        artist.innerHTML =  `Artist: ${artData.artist}`
        set_name.innerHTML = `Set Name: ${artData.set_name}`
        break;
      case 2:
        img.style.filter = "blur(0px)";
        if (!artData.flavor_text) {
          flavor_text.innerHTML = `Flavor Text: None`
        }
        else {
          flavor_text.innerHTML = `Flavor Text: ${artData.flavor_text}`
        }
        break;
      case 1:
        setGameOver(true);
        disableInputs();
        break;
      default: {
        break;
      }
    }
  }

  function checkVictory(guess) {
    lSound.volume = volumeValue;
    wSound.volume = volumeValue;

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
      <div className="nav">
        {volume ?  <VolumeMute className="volumeButton" onClick={toggleVolume}/>
        : <VolumeOff className="volumeButton" onClick={toggleVolume}/>}
      </div>
      <h1>MtgARTDLE </h1>
      <div id="image-container">
        {artData ? <img id="game-image" src={artData.image_uris.art_crop} alt="Guess the art" /> 
        : <div className="skeleton-image"></div>
        }
      </div>
      <div className="hints">
        <div className="hint" id="cmc"> </div>
        <div className="hint" id="set_name"> </div>
        <div className="hint" id="artist"> </div>
        <div className="hint" id="released_at"> </div>
        <div className="hint" id="flavor_text"> </div>
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
