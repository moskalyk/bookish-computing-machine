import React, { useState, useEffect } from 'react';
import './App.css'
import { useOpenConnectModal } from '@0xsequence/kit'
import { useDisconnect, useAccount } from 'wagmi'

import signPosts from './sign_posts.png'

const wait = (ms: any) => new Promise((res) => setTimeout(res,ms))

              //j   s       d         a     ;         f      l     k
const moves = [[-3,0],[1,1],[0.1,2],[2,0],[2,-1.9],[-1,1],[0.15,-2],[-2,-2]]

const randomIndex = Math.floor(Math.random() * moves.length);
const randomPair = moves[randomIndex];
let x_ =  randomPair[0]*2
// x_ =  Math.floor(Math.random() * 11) - 5
let y_ =  randomPair[1]*2

const outerCircleCenterX = 400;
const outerCircleCenterY = 400;
const outerCircleRadius = 400;

function formatDate(isoDate: any) {
  const date = new Date(isoDate);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}

function DataTable({ data }: any) {
  return (
    <table>
      <thead>
        <tr>
          <th>score</th>
          <th>date</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, index: any) => (
          <tr key={index}>
            <td>{item.score}</td>
            <td>{formatDate(item.date)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const App = () => {
  const [balance, setBalance] = useState<any>(0)
  const [isBridging, setIsBridging] = useState<any>(false)
  const [isPlaying, setIsPlaying] = useState<any>(false)
  const [countdown, setCountdown] = useState<any>(3)
  const [gameSessionState, setGameSessionState] = useState<any>([])
  const [angle, setAngle] = useState(100);
  const [counter, setCounter] = useState(0);
  const [x, setX] = useState(400);
  const [y, setY] = useState(400);
  const [keypress, setKeypress] = useState<any>(false);

  const { setOpenConnectModal } = useOpenConnectModal()
 
  const { isConnected} = useAccount()
  const { disconnect} = useDisconnect()

  const letters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

  const radius = 300; // Adjust the radius as needed
  const center = { x: 400, y: 400 }; // 

  const data = [
    { score: 'test', date: Date.now() },
    // Add more data items as needed
  ];
  
  const getLetterCoordinates = (index: any, totalLetters: any) => {
    const angle = (index / totalLetters) * 2 * Math.PI;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    return { x, y };
  };

  useEffect(() => {
    setTimeout(async () => {
      const radians = (angle * Math.PI) / 180;
      const distance = Math.sqrt(
        Math.pow(x - outerCircleCenterX, 2) + Math.pow(y - outerCircleCenterY, 2)
      );

        if(distance + 50 <= outerCircleRadius){
          setX((x+x_)+Math.cos(radians));
          setY((y+y_));
        } else {
          const randomIndex = Math.floor(Math.random() * moves.length);
          const randomPair = moves[randomIndex];
          x_ =  randomPair[0]*2
          // x_ =  Math.floor(Math.random() * 11) - 5
          y_ =  randomPair[1]*2
          // y_ =  Math.floor(Math.random() * 11) - 5
          setX(400);
          setY(400);
          // setAngle(360*Math.random())
        }
    }, 20)
    const handleKeyDown = (event: any) => {
      const key = event.key.toLowerCase();

      const index = letters.indexOf(key);

      const coords = getLetterCoordinates(index, letters.length);

      const distance = Math.sqrt(
        Math.pow(x - coords.x, 2) + Math.pow(y - coords.y, 2)
      );

      const distanceBell = Math.sqrt(
        Math.pow(x - outerCircleCenterX, 2) + Math.pow(y - outerCircleCenterY, 2)
      );

      function bellCurveScore(value: any, centralPoint: any, deviation: any) {
        // Calculate the standard score (z-score)
        const z = (value - centralPoint) / deviation;
    
        // Use the Gaussian function to compute the score
        const score = Math.exp(-(z * z) / 2);
    
        return score;
      }

      if(distanceBell>=(outerCircleCenterX-150)&&distance + 50 <= 100){
        const centralPoint = 295;
        const deviation = 50;
        const score = bellCurveScore(Math.abs(distanceBell), centralPoint, deviation);
        console.log(`score: ${score}`)
        console.log(`score: ${key}`)
        console.log('passing over the letter')
        setGameSessionState([...gameSessionState, {score: score*9, key: key }])
      }

      const letterIndex = letters.indexOf(key);
      setKeypress(distance + 50 <= 100)
      console.log(distance + 50 <= 100)

    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [angle, x, y]);

  useEffect(() => {
    if(isConnected){
      const element = document.querySelector('body') as any // Replace '.your-element-class' with the actual class of your element

      element.style.backgroundImage = 'none';
    } else {
      const element = document.querySelector('body') as any // Replace '.your-element-class' with the actual class of your element

      console.log(signPosts)
      element.style.backgroundImage = `url(${signPosts})`;
    }

  }, [counter, isConnected])

  const login = () => {
    setOpenConnectModal(true)
  }

  useEffect(() => {
    let interval: any;
    if(isPlaying){
      interval = setInterval(() => {
        setCountdown(countdown-1)
        if(countdown < 0) {
          setGameOver(true);
          clearInterval(interval)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, countdown])

  const [gameTime, setGameTime] = useState(10); // Use gameTime for countdown
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setGameTime((prevGameTime) => {
          const newGameTime = prevGameTime - 1;
          if (newGameTime <= 0) {
            setGameOver(false);
            clearInterval(interval);
          }
          return newGameTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameTime, isPlaying]);

  const [balanceMainnet, setBalanceMainnet] = useState<any>(0)

  useEffect(() => {

  }, [isPlaying])

  return (
    <div className='App'>
    {
      !isConnected ? <>
      <div style={{marginTop: '-250px'}}>

        <h1>bookish computing machine</h1>
        <p>test your keyboard reaction time</p>
        <p>inspire languages via keyboard</p>
        <br/>
        <br/>
        <button className='button' onClick={() => login()}><span>sign in</span></button>
      </div>

      </>:<>
      {
          !isPlaying 
        ? 
            !isBridging 
          ? 
            <>
            <div>
              <button className='button-simple' onClick={() => setIsBridging(true)}>bridge</button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button className='button'><span onClick={() => setIsPlaying(true)}>play</span></button>
              <br/>
              <br/>
              <h4>high scores</h4>
              <DataTable data={data} />

            </div>
            </>
          : 
            <>
            <div>
              <h1>bridging</h1>
              <p style={{textAlign: 'left'}}>
                balance {balance} arbitrum-sepolia
                <br/>
                <br/>
                balance {balanceMainnet} sepolia
              </p>
              <br/>
              <button className='button-simple' onClick={() => setIsBridging(true)}>bridge</button>
              <br/>
              <br/>
              <br/>
              <button className='button'><span onClick={() => {setGameSessionState([]);setCountdown(3);setGameTime(10);setIsBridging(false);setIsPlaying(false);}}>home screen</span></button>
            </div>
            </>
        :
        <>
          {
            countdown >= 0 ? 
            <>
              <div>

                <p>starting in</p>
                <br/>
                {countdown}
                </div>
            </> 
            : 
              gameTime >= 0 ?
            <>
              <div className='container'>
                <p style={{textAlign: 'center',marginLeft: '-100px'}}>{String(keypress)}</p>
                  <svg width="900" height="900">
                    <circle cx="404" cy="404" r="400" fill="transparent" stroke="black" strokeWidth="2" />
                    <circle cx={x} cy={y} r="50" fill="blue" />
                    {letters.map((letter, index) => {
                    const { x, y } = getLetterCoordinates(index, letters.length);
                    return (
                      <text key={index} x={x} y={y} textAnchor="middle" alignmentBaseline="middle">
                        {letter}
                      </text>
                    );
                  })}
                  </svg>
                </div>
              </> 
            :
            <>
              <div>
                <h1>game over</h1>
                <br/>
                <p>
                  {gameSessionState.reduce((totalScore: any, state: any) => totalScore + state.score, 0)}
                </p>
                <br/>
                <button className='button'><span onClick={() => {setGameSessionState([]);setCountdown(3);setGameTime(10);setIsPlaying(true);}}>play again</span></button>
                <br/>
                <br/>
                <button className='button'><span onClick={() => {setGameSessionState([]);setCountdown(3);setGameTime(10);setIsPlaying(false);}}>home screen</span></button>
              </div>
            </>
          }

              
        </>
      }
      <div style={{position: 'fixed', right: '30px', top: '30px', cursor: 'pointer'}} onClick={() => disconnect()}>
        <p>sign out</p>
      </div>

      </> 
    }
    </div>
  );
};

export default App;
