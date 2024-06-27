
import { useWindowSize } from '@react-hook/window-size'
import Confetti from 'react-confetti'

export const Conf =  () => {
  const [width, height] = useWindowSize()
  return (
    <Confetti
      numberOfPieces={1000}
      recycle={false}
      width={width}
      height={height}
    />
  )
}