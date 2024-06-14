import { Button } from "@chess/ui/button"
import { useNavigate } from "react-router-dom"

export const GameEndModal = ({message, buttonText, setEndGameModal}: {
    message: string,
    buttonText: string,
    setEndGameModal:  React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const navigate = useNavigate()
    function handler(){
        setEndGameModal(false)
        navigate('/game/random', {replace:true})
        navigate(0)
    }
    return <div className="backdrop-blur-sm fixed inset-0 justify-center items-center flex">
         <div className="h-[40%] w-[40%] bg-black bg-opacity-50 top-auto left-auto p-10 rounded-lg text-center text-white">
            <div className="font-bold text-2xl py-10">
                {message}
            </div>
            <div className="text-center">
                <Button onClickHandler={handler} disabled={false} className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                    {buttonText}
                </ Button>
            </div>
        </div>
    </div>
}