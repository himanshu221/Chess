import { Button } from "@chess/ui/button"

export const Login = () => {
    const BACKEND_URL='http://localhost:3000'

    function handleClick() {
        window.open(`${BACKEND_URL}/auth/google`, '_self')
    }

    return <div className="h-screen bg-cover bg-chessboard flex justify-center items-center">
        <div className="h-auto h-min-72 w-[70vw] px-10 py-16 backdrop-saturate-200 md:w-[60vw] rounded-lg backdrop-blur-sm bg-[#18120ebf] text-center">
            <div className="text-5xl text-white font-bold flex items-center justify-center">
                Play Chess Online on the #1 Site!
            </div>
            <div className="p-10">
            <Button onClickHandler={handleClick} className="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-3xl px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 me-2 mb-2">
                Login with Google
            </ Button>
            </div>
        </div>
    </div>
}