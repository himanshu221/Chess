import { useNavigate } from "react-router-dom"

export const Landing = () => {
    const navigate = useNavigate()
    function handleClick() {
        navigate('/game')
    }
    return <div className="h-screen bg-cover bg-chessboard flex justify-center items-center">
        <div className="h-[50vh] w-[70vw] px-10 py-16 md:h-[50vh] backdrop-saturate-200 md:w-[60vw] rounded-lg backdrop-blur-sm bg-[#18120ebf] flex flex-col items-center">
            <div className="text-5xl mb-16 md:mb-24 text-white font-bold flex items-center justify-center">
                Play Chess Online on the #1 Site!
            </div>
            <div>
                <button onClick={handleClick} type="button" className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                    Play
                </button>
            </div>
        </div>
    </div>
}