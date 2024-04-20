import { Chessboard } from "react-chessboard"
export const Game = () => {
    return <div className="bg-backboard p-5 h-screen flex justify-center overflow-auto">
        <div className="h-auto w-[95%] p-4 md:w-[82%] backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 flex justify-center items-center">
                <Chessboard position={'start'} customBoardStyle={{borderRadius: '5px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5'}} />
            </div>
            <div className="col-span-1 md:col-span-1 overflow-y-scroll border-white border rounded-md relative min-h-24">
                <table className="table-fixed w-[100%] px-2">
                    <thead className="bg-slate-200 w-[100%] top-0 sticky">
                        <tr>
                            <th>From</th>
                            <th>To</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}