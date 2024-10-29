import { useState, useEffect } from "react";

const MemoryGame = () => {

    const [gridSize, setGridSize] = useState(4)
    const [cards, setCards] = useState<{ id: number, number: number }[]>([])

    const [flipped, setFlipped] = useState<number[]>([])
    const [solved, setSolved] = useState<number[]>([])

    const [disabled, setDisabled] = useState(true)
    const [won, setWon] = useState(false)
    const [showNumberFirstTime, setShowNumberFirstTime] = useState(true);

    const handleGridSize = (e: React.ChangeEvent<HTMLInputElement>) => {
        const size = parseInt(e.target.value)
        setGridSize(size)
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

    useEffect(()=> {
        if(solved.length === cards.length && cards.length > 0) {
            setWon(true)
        }
    },[solved, cards])

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-grey-100 p-4">
            <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
            {/* Input */}
            <div className="mb-4">
                <label htmlFor="gridSize" className="mr-2">Grid Size: (Max 10)</label>
                <input type="number" id="gridSize" min={2} max={10} value={gridSize} onChange={(e) => handleGridSize(e)} className="border-2 border-gray-300 rounded px-2 py-1" />
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