import * as React from 'react';
import { useTimer } from 'use-timer';
import './style.css';

const green =
  'https://github.com/mayerlench/react-ts-ptlzj2/blob/main/images/5b44682b-0a5c-4cd7-9666-943616fe04f5.jpg?raw=true';
const red =
  'https://github.com/mayerlench/react-ts-ptlzj2/blob/main/images/5d27ea74-e8d3-4a30-8d00-8ff71b46839d.jpg?raw=true';
const yellow =
  'https://github.com/mayerlench/react-ts-ptlzj2/blob/main/images/7ff90ef6-87ca-477c-963c-8d5b8dcc6d73.jpg?raw=true';

type ThreatLevel = {
  threatLevel: string;
  duration: number;
};

const intitalCountdown = 5;

export default function App() {
  const [threatLevel, setThreatLevel] = React.useState<ThreatLevel>(null);
  const [threatLevels, setThreatLevels] = React.useState<ThreatLevel[]>(null);

  const [gameCompleted, setGameCompleted] = React.useState(false);
  const { start, advanceTime, time } = useTimer({
    initialTime: 1,
    endTime: 0,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      setNextThreatLevel(threatLevels);
    },
  });

  const countdown = useTimer({
    initialTime: intitalCountdown,
    endTime: 0,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      startGame();
    },
  });

  React.useEffect(() => {
    console.log(time);
  }, [time]);

  const startCountdown = () => {
    countdown.start();
  };

  const setNextThreatLevel = (threatLevels: ThreatLevel[]) => {
    const next = threatLevels?.[0];
    console.log(next);
    if (!next) {
      countdown.reset();
      return setGameCompleted(true);
    }
    setThreatLevel(next);

    setThreatLevels(threatLevels.slice(1));
    start();
    advanceTime(-next.duration + 1);
  };

  const startGame = () => {
    setGameCompleted(false);
    const game = buildGame();
    setThreatLevels(game);
    console.log('GAME', game);
    setNextThreatLevel(game);
  };

  const stopGame = () => {
    setThreatLevel(null);
    setGameCompleted(false);
  };

  const buildGame = () => {
    const initalThreatTime = randomIntFromInterval(5, 10);
    const initalAssessTime = randomIntFromInterval(5, 8);

    const threatRengage = Boolean(randomIntFromInterval(0, 20) > 10);
    const threatRengageTime = randomIntFromInterval(3, 9);

    const game = [
      { threatLevel: red, duration: initalThreatTime },
      { threatLevel: yellow, duration: initalAssessTime },
    ].concat(
      threatRengage
        ? [
            { threatLevel: red, duration: threatRengageTime },
            { threatLevel: yellow, duration: 4 },
          ]
        : []
    );

    return game;
  };

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div className="container text-center">
      <h1 className="mt-5">Threat assessment practice</h1>
      <div className="mt-5">
        {!gameCompleted && (
          <img
            src={threatLevel?.threatLevel}
            style={{ maxHeight: 750 }}
            className={
              threatLevel?.threatLevel === red
                ? 'img-fluid animate__animated animate__pulse animate__infinite animate__faster'
                : 'img-fluid'
            }
          />
        )}
        {gameCompleted && (
          <img src={green} style={{ maxHeight: 750 }} className="img-fluid" />
        )}
      </div>

      <div>
        {countdown.time === intitalCountdown && (
          <button onClick={startCountdown} className="btn btn-primary">
            Start
          </button>
        )}
        {countdown.time !== 0 && (
          <label className="m-3">{countdown.time} second delayed start</label>
        )}
      </div>
    </div>
  );
}
