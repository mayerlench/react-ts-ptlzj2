import { flatten } from 'ramda';
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
  image: string;
  level: string;
  duration: number;
};

export default function App() {
  const [threat, setThreat] = React.useState<ThreatLevel>(null);
  const [threats, setThreats] = React.useState<ThreatLevel[]>(null);
  const [autoRepeat, setAutoRepeat] = React.useState(false);
  const [assessTime, setAssessTime] = React.useState(5);

  const [delayedStart, setDelayedStart] = React.useState(5);

  const [gameStatus, setGameStatus] = React.useState<
    'countdown' | 'started' | 'completed' | null
  >(null);

  const { start, advanceTime, time, reset } = useTimer({
    endTime: 0,
    timerType: 'DECREMENTAL',
    onTimeOver: () => {
      setNextThreatLevel(threats);
    },
  });

  const countdown = useTimer({
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
    setGameStatus('countdown');
    countdown.start();
    console.log('delayedStart', -delayedStart);
    countdown.advanceTime(-delayedStart);
  };

  const setNextThreatLevel = (threats: ThreatLevel[]) => {
    const next = threats?.[0];
    console.log(next);
    if (!next) {
      countdown.reset();

      if (autoRepeat) return startCountdown();

      return setGameStatus('completed');
    }
    setThreat(next);

    setThreats(threats.slice(1));
    start();
    advanceTime(-next.duration);
  };

  const startGame = () => {
    setGameStatus('started');
    const game = buildGame();
    setThreats(game);
    setNextThreatLevel(game);
  };

  const stopGame = () => {
    reset();
    countdown.reset();
    setThreats(null);
    setThreat(null);
    setGameStatus(null);
  };

  const buildGame = () => {
    const getAssessLevel = () => ({
      image: yellow,
      duration: assessTime,
      level: 'assess',
    });
    const getFireLevel = (duration: number) => ({
      image: red,
      duration: assessTime,
      level: 'fire',
    });

    const game = flatten(
      [...Array(randomIntFromInterval(1, 3)).keys()].map((m) => {
        return [
          { ...getFireLevel(randomIntFromInterval(5, 10)) },
          { ...getAssessLevel() },
        ];
      })
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
        {gameStatus === 'started' && (
          <img
            src={threat?.image}
            style={{ maxHeight: 750 }}
            className={
              threat?.image === red
                ? 'img-fluid animate__animated animate__pulse animate__infinite animate__faster'
                : 'img-fluid'
            }
          />
        )}
        {gameStatus === 'completed' && (
          <img src={green} style={{ maxHeight: 750 }} className="img-fluid" />
        )}
      </div>

      <div>
        {(!gameStatus || gameStatus === 'completed') && (
          <div>
            <div style={{ width: 100 }} className="m-auto">
              <input
                placeholder="Delay"
                className="form-control"
                value={delayedStart}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (isNaN(value) || value < 0) return;

                  setDelayedStart(Number(e.target.value));
                }}
              />
            </div>
            <div className="form-check d-flex flex-row justify-content-center  mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="flexCheckChecked"
                checked={autoRepeat}
                onChange={(e) => setAutoRepeat(e.target.checked)}
              />
              <label
                className="form-check-label ms-1"
                htmlFor="flexCheckChecked"
              >
                Repeat
              </label>
            </div>
            <button
              onClick={startCountdown}
              className="btn btn-primary btn-lg mt-2"
            >
              START
            </button>
          </div>
        )}
        {gameStatus === 'countdown' && (
          <label className="m-3">{countdown.time} second delayed start</label>
        )}
        {(gameStatus === 'started' || gameStatus === 'countdown') && (
          <div>
            <button onClick={stopGame} className="btn btn-danger btn-lg mt-4">
              STOP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
