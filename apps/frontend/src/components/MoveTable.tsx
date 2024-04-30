export const MoveTable = ({moves} : {moves: string[]}) => {
    let count = 1;
    return <div className="col-span-1 md:col-span-1 overflow-y-scroll backdrop-blur-none border-[#25150c] border-4 rounded-md min-h-48">
        <div className="bg-[#25150c] h-12 w-[100%] top-0 col-span-2 flex justify-center items-center sticky font-bold text-xl text-white">
            Moves
        </div>
        <div className="grid grid-cols-7">
            {
                moves.map((move, ind) => 
                    <>
                        {
                            ind%2 == 0 ? <div key={count} className="col-span-1 text-lg text-slate-300 flex justify-center items-center h-12">
                                {`${count++} .`}
                            </div> : null

                        }
                        <div key={ind} className="col-span-3 text-lg text-white flex justify-center items-center h-12">
                            {move}
                        </div>
                    </>)
            }
        </div>
    </div>
}