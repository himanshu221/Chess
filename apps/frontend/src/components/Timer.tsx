import { GAME_TIME_MS } from "@chess/commons/consts"
import { useEffect, useState } from "react"

const Timer = ({timePassed}: {timePassed: number}) => {
    const timeRemaining = GAME_TIME_MS - timePassed
    const [minutes, setMinutes] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)

    useEffect(() => {
        setSeconds(Math.floor((timeRemaining/1000) % 60));
        setMinutes(Math.floor(timeRemaining/(1000*60)))

    },[timePassed])

    return <div className="p-2 bg-black rounded-lg bg-opacity-30">
        {minutes < 10 ? '0' : ''}{minutes}:{seconds < 10 ? '0': ''}{seconds}
    </div>
}

export default Timer