import { useUser } from "@chess/store/user"
import { useEffect, useState } from "react"

const WS_URL = 'ws://localhost:8080'
export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const user = useUser()
    useEffect(() => {
        if(!user || user.state === "loading"){
            return
        }
        console.log(user)
        const ws = new  WebSocket(WS_URL);

        ws.onopen = () => {
            setSocket(ws)
        }

        ws.onclose = () => {
            setSocket(null)
        }

        return () => {
            ws.close();
        }
    }, [user])
    
    return socket
}