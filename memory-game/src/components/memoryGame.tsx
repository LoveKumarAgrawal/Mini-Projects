import { useState, useEffect } from "react";

const MemoryGame = () => {

    const [gridSize, setGridSize] = useState(4)
    const [cards, setCards] = useState<{ id: number, number: number }[]>([])

    const [flipped, setFlipped] = useState<number[]>([])
    const [solved, setSolved] = useState<number[]>([])

    const [disabled, setDisabled] = useState(true)
    const [won, setWon] = useState(false)
    const [showNumberFirstTime, setShowNumberFirstTime] = useState(true);

    // const handleGridSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const size = parseInt(e.target.value)
    //     if (size >= 2 && size <= 10) setGridSize(size)
    // }

    const handleGridSize = (size: number) => {
        if(size >= 2 && size <= 10) setGridSize(size)
    }

    const initializeGame = () => {
        const totalCards: number = gridSize * gridSize
        const pairCount: number = Math.floor(totalCards / 2)
        const numbers: number[] = [...Array(pairCount).keys()].map(n => n + 1)
        const shuffledCards: { id: number, number: number }[] = [...numbers, ...numbers].sort(() => Math.random() - 0.5).map((number, index) => ({ id: index, number }))

        setCards(shuffledCards)
        setFlipped([])
        setSolved([])
        setWon(false)
        showNumbersTemporarily()
    }

    const showNumbersTemporarily = () => {
        setShowNumberFirstTime(true);
        setTimeout(() => {
            setShowNumberFirstTime(false);
            setDisabled(false);
        }, 2000);
    };


    useEffect(() => {
        initializeGame();
    }, [gridSize]);


    const checkMatch = (secondId: number) => {
        const [firstId] = flipped;
        if (cards[firstId].number === cards[secondId].number) {
            setSolved([...solved, firstId, secondId])
            setFlipped([])
            setDisabled(false)
        } else {
            setTimeout(() => {
                setFlipped([])
                setDisabled(false)
            }, 1000)
        }
    }

    const handleClick = (id: number) => {
        if (disabled || won) return;

        if (flipped.length === 0) {
            setFlipped([id])
            return
        }

        if (flipped.length === 1) {
            setDisabled(true)
            if (id !== flipped[0]) {
                setFlipped([...flipped, id])
                checkMatch(id)
            } else {
                setFlipped([])
                setDisabled(false)
            }
        }
    }

    const isFlipped = (id: number) => flipped.includes(id) || solved.includes(id)
    const idSolved = (id: number) => solved.includes(id)

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true)
        }
    }, [solved, cards])

    return (

        <div className="flex flex-col justify-center items-center min-h-screen bg-grey-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
            {/* Input */}
            <div className="flex justify-center items-center mb-4">
                <div>
                <label htmlFor="gridSize" className="mr-4">Grid Size: (Max 10)</label>
                </div>
                <div className="relative flex items-center max-w-[8rem]">
                    <button type="button" className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100  focus:ring-2 focus:outline-none"
                    onClick={() => handleGridSize(gridSize - 1)}
                    >
                        <svg className="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
                        </svg>
                    </button>
                    <input type="text" value={gridSize} className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5"/>
                    <button type="button" id="increment-button" className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 focus:ring-2 focus:outline-none"
                    onClick={() => handleGridSize(gridSize + 1)}
                    >
                        <svg className="w-3 h-3 text-gray-900" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* GameBoard */}
            <div className={`grid gap-2 mb-4`}
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
                    width: `min(100%, ${gridSize * 5.5}rem)`
                }}
            >
                {cards.map((card) => {
                    return <div key={card.id} className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all ${isFlipped(card.id)
                        ? idSolved(card.id) ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-400"}`}
                        onClick={() => handleClick(card.id)}
                    >
                        {/* {isFlipped(card.id) ? card.number : "?"} */}
                        {isFlipped(card.id) ? card.number : showNumberFirstTime ? card.number : "?"}
                    </div>
                })}
            </div>

            {/* Win */}
            {
                won && <div className="mt-4 text-4xl font-bold text-green-600 animate-bounce">You Won!</div>
            }

            {/* Button */}
            <button className="mt-4 px-4 py-2 bg-green-400 text-white rounded hover:bg-green-600 transition-colors"
                onClick={initializeGame}
            >
                {won ? "Play Again" : "Reset"}
            </button>

        </div>
    )
}

export default MemoryGame;