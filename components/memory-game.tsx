"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Link from 'next/link'
import { X } from "lucide-react"

type Card = {
  id: number
  image: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  asButton?: string
  customText?: string
}

export default function MemoryGame({ asButton = 'false', customText = 'Play Memory Game' }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [level, setLevel] = useState<number>(1)
  const [timeLeft, setTimeLeft] = useState<number>(10)
  const [isShowingCards, setIsShowingCards] = useState<boolean>(true)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const initializeGame = useCallback(() => {
    const totalCards = 12
    const imageNumbers = Array.from({ length: 154 }, (_, i) => i + 1)
    const shuffledImageNumbers = imageNumbers.sort(() => Math.random() - 0.5).slice(0, totalCards / 2)
    const pairedImageNumbers = [...shuffledImageNumbers, ...shuffledImageNumbers]
    const shuffledPairs = pairedImageNumbers.sort(() => Math.random() - 0.5)

    const newCards = shuffledPairs.map((number, index) => ({
      id: index,
      image: `/alebrijes/image_${number}.jpg`,
      isFlipped: true,
      isMatched: false,
    }))

    setCards(newCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setTimeLeft(10)
    setIsShowingCards(true)
    setGameStarted(true)
    setIsProcessing(false)
  }, [])

  const resetGame = useCallback(() => {
    setLevel(1)
    initializeGame()
  }, [initializeGame])

  const handleCardClick = useCallback((id: number) => {
    if (isShowingCards || isProcessing || flippedCards.length === 2) return

    setFlippedCards(prev => [...prev, id])
    setCards(prevCards =>
      prevCards.map(card =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    )
  }, [isShowingCards, isProcessing, flippedCards.length])

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true)
      const [first, second] = flippedCards
      if (cards[first].image === cards[second].image) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === first || card.id === second ? { ...card, isMatched: true } : card
          )
        )
        setMatchedPairs(prev => prev + 1)
        setIsProcessing(false)
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === first || card.id === second ? { ...card, isFlipped: false } : card
            )
          )
          setIsProcessing(false)
        }, 1000)
      }
      setFlippedCards([])
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matchedPairs === cards.length / 2 && gameStarted) {
      setLevel(prev => prev + 1)
      setTimeout(initializeGame, 1500)
    }
  }, [matchedPairs, cards.length, gameStarted, initializeGame])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isShowingCards && gameStarted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setCards(prevCards => prevCards.map(card => ({ ...card, isFlipped: false })))
            setIsShowingCards(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isShowingCards, gameStarted])

  const GameContent = () => (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900 p-4 text-white">
      <div className="mb-4 text-center">
        <p className="text-lg sm:text-xl font-semibold text-blue-400">Level: {level}</p>
        <p className="text-lg sm:text-xl font-semibold text-green-400">Matched Pairs: {matchedPairs}/{cards.length / 2}</p>
        {isShowingCards && <p className="text-lg sm:text-xl font-semibold text-yellow-400">Time Left: {timeLeft}s</p>}
      </div>
      {!gameStarted ? (
        <Button
          onClick={initializeGame}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg transition-all duration-200 ease-in-out"
        >
          Start Game
        </Button>
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            {cards.map((card) => (
              <div
                key={card.id}
                className="aspect-square relative overflow-hidden bg-purple-800 cursor-pointer"
                onClick={() => handleCardClick(card.id)}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-300 ${card.isFlipped || card.isMatched ? 'rotate-0' : 'rotate-90'
                    }`}
                  style={{
                    backgroundImage: `url(${card.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {(!card.isFlipped && !card.isMatched) && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-800">
                    <span className="text-2xl sm:text-3xl md:text-4xl text-white">?</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button
            onClick={resetGame}
            className="mt-4 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white py-1 px-2 text-sm transition-all duration-200 ease-in-out"
          >
            Reset Game
          </Button>
        </>
      )}
    </div>
  )

  if (asButton != "false") {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {(asButton === "true" || asButton === "button") ? (
            <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg transition-all duration-200 ease-in-out">
              {customText}
            </Button>
          ) : (
            <Link href="#" className="hover:underline">
              {customText}
            </Link>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 overflow-auto bg-transparent border-none">
          <div className="relative w-full h-full bg-gray-900">
            <Button
              className="absolute top-2 right-2 z-50 bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
            <GameContent />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return <GameContent />
}