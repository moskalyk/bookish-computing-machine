import React, { useState, useEffect } from 'react';
import './App.css'
const wait = (ms: any) => new Promise((res) => setTimeout(res,ms))

              //j   s       d         a     ;         f      l     k
const moves = [[-3,0],[1,1],[0.1,2],[2,0],[2.5,-1.9],[-1,1],[0.15,-2],[-2,-2]]

const randomIndex = Math.floor(Math.random() * moves.length);
const randomPair = moves[randomIndex];
let x_ =  randomPair[0]*2
// x_ =  Math.floor(Math.random() * 11) - 5
let y_ =  randomPair[1]*2

const outerCircleCenterX = 400;
const outerCircleCenterY = 400;
const outerCircleRadius = 400;

const App = () => {
  const [angle, setAngle] = useState(100);
  const [counter, setCounter] = useState(0);
  const [x, setX] = useState(400);
  const [y, setY] = useState(400);
  const [keypress, setKeypress] = useState<any>(false);

  const letters = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

  const radius = 300; // Adjust the radius as needed
  const center = { x: 400, y: 400 }; // 
  
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
      const letterIndex = letters.indexOf(key);
      setKeypress(distance + 50 <= 100)
      console.log(distance + 50 <= 100)

    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [angle, x, y]);

  useEffect(() => {}, [counter])

  return (
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
  );
};

export default App;
