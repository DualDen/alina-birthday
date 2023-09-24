import React, { useState } from 'react'
import { useSprings, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from 'react-use-gesture'

import styles from './styles.module.css'

interface ICard {
  text?: string;
  image?: string;
}

const cards: ICard[] = [
  {
    text: 'Твои Юля и Денис!',
    image: 'https://sun9-58.userapi.com/impg/TArNdz4NEs118Tv3qKkDGGdY3MF65w9CQxY2Tw/LBG6v52cmLU.jpg?size=735x656&quality=95&sign=714381161de842126c94921c8af57f35&type=album'
  },
  {
    text: 'Мы тебя бесконечно любим!',
    image: 'https://sun9-36.userapi.com/impg/AN4H5PDbpNiBPthOvxUu9C2jPctUo_lHhUdjUw/Uhxz70E4gi8.jpg?size=720x596&quality=95&sign=1ce85aee43e68bda153dbe04fd1554d2&type=album'
  },
  {
    text: 'Умной!',
    image: 'https://sun9-80.userapi.com/impg/0zgy397yw_O562En-HY-55-tMLY0y6m-nNK8SA/9LN7hKBba_M.jpg?size=564x564&quality=95&sign=9f2d9207e635eecb8ed191cfb1dd7493&type=album'
  },
    {
    text: 'Сильной!',
      image: 'https://sun9-21.userapi.com/impg/NX5kXLeuAWGQUJz1XKfKZQPihM8DeqnUoKuRLw/Y4dbp3Gr4KM.jpg?size=600x900&quality=95&sign=d33ab5ff3043a7c9ba8f78da13c77158&type=album'
  },
  {
    text: 'Трудолюбивой',
    image: 'https://sun9-8.userapi.com/impg/VEooRnH-HPeG-63uClEXCL2w509pSoKGlEw4qw/knLdpc0WK4k.jpg?size=735x800&quality=95&sign=c8730453dcb145c62fe71b023b266ba0&type=album'
  },
    {
    text: 'Креативной!',
      image: 'https://sun9-4.userapi.com/impg/4k-jd83obptGcdclFAMAzCpvQFpk0kTx0tJQ7A/KMHc6tBCbSc.jpg?size=736x736&quality=95&sign=7d4a5cd2db012d48188356bab195321f&type=album'
  },
    {
    text: 'Красивой!',
      image: 'https://sun9-33.userapi.com/impg/F5Dqeuh6NAsNNVGpItkGeE3ROJSuz0BdpNuZMg/K6he7rodTgI.jpg?size=350x348&quality=95&sign=1d275495cffa483af3ab0281318a8500&type=album'
  },
  {
    text: 'Доброй!',
    image: 'https://sun9-54.userapi.com/impg/6qj8vzib0EpWp7_btglldbr3cwWHJ10lk-gGwg/hTTxaNgfUJE.jpg?size=530x530&quality=95&sign=2accc89d816996c7db7f1fcc27f6fb6d&type=album'
  },
  {
    text: 'Оставайся всегда такой же :',
    image: 'https://sun9-55.userapi.com/impg/LpqzyQ8xbFjQYzSsQpcjgIGEVUhXDpE3ohhzTg/bKjodt-jcyE.jpg?size=675x699&quality=95&sign=79415fa4863eb6211a766e6fe2fe0cb8&type=album'
  },
  {
    text: 'С днем рождения!',
    image: 'https://sun9-4.userapi.com/impg/KYNY2YaV6Cz6UPeErJG4XrZO0UiNIgZAk18Ruw/LGOI9vsfcjQ.jpg?size=736x736&quality=95&sign=edaf25cd88fcd3b748fc2cd101801e5b&type=album'
  },
  {
    image: 'https://sun9-40.userapi.com/impg/EM2C7rE-VqN1eNL8jY_jMvUi_SX9tRZvrpWN0g/qTJQtgy-syQ.jpg?size=736x736&quality=95&sign=509ef40f17dc78f3e99dbb66aadde16b&type=album',
  }
]

const to = (i: number) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
})
const from = (_i: number) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 })
const trans = (r: number, s: number) =>
    `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

function Deck() {
  const [gone] = useState(() => new Set()) // The set flags all the cards that are flicked out
  const [props, api] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i),
  })) // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2 // If you flick hard enough it should trigger the card to fly out
    const dir = xDir < 0 ? -1 : 1 // Direction should either point left or right
    if (!down && trigger) gone.add(index) // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
    api.start(i => {
      if (index !== i) return // We're only interested in changing spring-data for the current spring
      const isGone = gone.has(index)
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0 // When a card is gone it flys out left or right, otherwise goes back to zero
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0) // How much the card tilts, flicking it harder makes it rotate faster
      const scale = down ? 1.1 : 1 // Active cards lift up a bit
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      }
    })
    if (!down && gone.size === cards.length)
      setTimeout(() => {
        gone.clear()
        api.start(i => to(i))
      }, 600)
  })
  // Now we're just mapping the animated values to our view, that's it. Btw, this component only renders once. :-)
  return (
      <>
        {props.map(({ x, y, rot, scale }, i) => (
            <animated.div className={styles.deck} key={i} style={{ x, y }}>
              {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
              <animated.div
                  {...bind(i)}
                  style={{
                    transform: interpolate([rot, scale], trans),
                    backgroundImage: `url(${cards[i]?.image})`,
                    backgroundPosition: i === cards.length - 1  ? 'center center' : 'center bottom',
                  }}
              >
                {cards[i]?.text}
              </animated.div>
            </animated.div>
        ))}
      </>
  )
}

export default function App() {
  return (
      <div className={styles.container}>
        <Deck />
      </div>
  )
}
