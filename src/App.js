import React, { useCallback, useEffect, useRef, useReducer } from "react";
import "./App.css";
import Cup from "./components/Cup";

const initialState = {
  shuffling: false,
  open: true,
  started: false,
  finished: false,
  selected: -1,
  prompt: "",
  cupNumber: 5,
  refs: [],
};

const chooseRandomCup = (cupNumber) => {
  return Math.floor(Math.random() * (cupNumber - 0));
};
function reducer(state, action) {
  switch (action.type) {
    case "SET_CUP_NUMBER":
      return {
        ...state,
        cupNumber: action.cupNumber,
        refs: [],
      };
    case "SET_PROMPT_LOOSE":
      return {
        ...state,
        prompt: "you loose",
        selected: action.selected,
        finished: true,
      };
    case "SET_PROMPT_WON":
      return {
        ...state,
        prompt: "You Win",
        selected: action.selected,
        finished: true,
      };
    case "SELECT_CUP":
      return {
        ...state,
        shuffling: false,
        started: true,
        finished: false,
        selected: chooseRandomCup(state.cupNumber),
        prompt: "",
      };

    case "OPEN_CUP":
      return { ...state, open: true };

    case "CLOSE_CUP":
      return { ...state, open: false };
    case "START_SHUFFLE":
      return {
        ...state,
        shuffling: true,

        finished: false,

        prompt: "shuffling...",
      };

    case "END_SHUFFLE":
      return {
        ...state,

        started: false,
        shuffling: false,

        prompt: "Now choose a cup!",
      };

    default:
      throw new Error();
  }
}

function App() {
  const refs = useRef([]);

  const [state, setState] = useReducer(reducer, initialState);

  const cupClick = (idx) => {
    return () => {
      if (!state.finished) {
        const selected = chooseRandomCup(state.cupNumber);

        if (idx !== selected) {
          setState({ type: "SET_PROMPT_LOOSE", selected });
        } else {
          setState({ type: "SET_PROMPT_WON", selected });
        }
      }
    };
  };

  const getCups = () => {
    const cups = Array.from({ length: state.cupNumber });
    const width = initialState.cupNumber * 165;

    return (
      <div className="container" style={{width:width}}>
        {cups.map((val, idx) => {
          return (
            <Cup
              ref={(el) => (refs.current = [...refs.current, el])}
              left={165 * idx}
              key={idx}
              idx={idx}
              onClick={cupClick(idx)}
              open={state.open}
              selected={state.selected === idx}
            />
          );
        })}
      </div>
    );
  };

  const selectCup = () => {
    setState({ type: "SELECT_CUP" });
  };

  const animateShuffle = (el, from, to, time) => {
    const start = new Date().getTime();
    const timer = setInterval(function () {
      const step = Math.min(1, (new Date().getTime() - start) / time);

      el.style.left = from + step * (to - from) + "px";
      if (step == 1) clearInterval(timer);
    }, 25);
    el.style.left = from + "px";
  };

  const shuffle = useCallback(() => {
    const array = [];
    for (let i = 0; i < state.cupNumber; i++) {
      array.push(i);
    }
    const randomArray = array.sort(() => {
      return 0.5 - Math.random();
    });

    const cupObjects = [];
    const lefts = [];
    for (let i = 0; i < randomArray.length; i++) {
      cupObjects.push({
        number: randomArray[i],
        ref: refs.current[randomArray[i]],
        left: randomArray[i] * 165,
      });
      lefts.push(randomArray[i] * 165);
    }

    let shuffleLefts = shuffleArray(shuffleArray(lefts));
    while (JSON.stringify(shuffleLefts) === JSON.stringify(lefts)) {
      shuffleLefts = shuffleArray(shuffleArray(lefts));
    }

    for (let i = 0; i < randomArray.length; i++) {
      animateShuffle(
        cupObjects[i].ref,
        cupObjects[i].left,
        shuffleLefts[i],
        400
      );
    }
  }, [state.cupNumber]);

  const shuffleArray = (arrayInput) => {
    const array = [...arrayInput];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  };

  const btnOnClick = () => {
    if (state.started) {
      setState({ type: "CLOSE_CUP" });
      setState({ type: "START_SHUFFLE" });
    } else {
      setState({ type: "OPEN_CUP" });
      selectCup();
    }
  };

  const btnText = () => {
    if (state.started && !state.shuffling) {
      return "shffle";
    } else if (state.started && state.shuffling) {
      return "shuffling...";
    }

    return "New game";
  };

  useEffect(() => {
    if (state.shuffling) {
      setTimeout(() => {
        shuffle();
      }, 400);

      setTimeout(() => {
        setState({ type: "END_SHUFFLE" });
      }, 1000);
    }
  }, [shuffle, state.shuffling, state.open]);

  return (
    <div >
      <h2 className="title" >Click Button To Start Game</h2>
      <h2 className="title" >{state.prompt}</h2>
      {getCups()}
      <button  onClick={btnOnClick}>
        {btnText()}
      </button>
    </div>
  );
}

export default App;
