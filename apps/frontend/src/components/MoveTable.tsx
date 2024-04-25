export const MoveTable = ({moves} : {moves: string[]}) => {
    return <div className="col-span-1 md:col-span-1 overflow-y-scroll border-slate-300 border rounded-md min-h-20">
        <div className="bg-slate-300 h-12 w-[100%] top-0 col-span-2 flex justify-center items-center sticky font-bold text-xl">
            Moves
        </div>
        <div className="grid grid-cols-2">
            {
                moves.map((move, ind) => 
                    <div key={ind} className="col-span-1 text-lg text-white flex justify-center items-center h-12">
                        {move}
                    </div>)
            }
        </div>
    </div>
}