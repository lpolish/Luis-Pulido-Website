"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

type Card = {
  id: number
  image: string
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  asButton?: boolean
}

export default function MemoryGame({ asButton = false }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [level, setLevel] = useState<number>(1)
  const [showTime, setShowTime] = useState<number>(10)
  const [timeLeft, setTimeLeft] = useState<number>(10)
  const [isShowingCards, setIsShowingCards] = useState<boolean>(true)
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const initializeGame = () => {
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
    setShowTime(10)
    setTimeLeft(10)
    setIsShowingCards(true)
    setGameStarted(true)
  }

  const resetGame = () => {
    setLevel(1)
    initializeGame()
  }

  const handleCardClick = (id: number) => {
    if (isShowingCards || flippedCards.length === 2) return

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    )

    setFlippedCards((prev) => [...prev, id])
  }

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      if (cards[first].image === cards[second].image) {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === first || card.id === second
              ? { ...card, isMatched: true }
              : card
          )
        )
        setMatchedPairs((prev) => prev + 1)
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === first || card.id === second
                ? { ...card, isFlipped: false }
                : card
            )
          )
        }, 1000)
      }
      setFlippedCards([])
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matchedPairs === cards.length / 2 && gameStarted) {
      setLevel((prev) => prev + 1)
      setShowTime((prev) => Math.max(prev - 2, 3))
      setTimeout(() => {
        initializeGame()
      }, 1500)
    }
  }, [matchedPairs, cards.length, gameStarted])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isShowingCards && gameStarted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setCards((prevCards) =>
              prevCards.map((card) => ({ ...card, isFlipped: false }))
            )
            setIsShowingCards(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isShowingCards, gameStarted, showTime])

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
                className={`aspect-square relative overflow-hidden ${
                  card.isFlipped ? "bg-gray-700" : "bg-purple-800"
                } ${isShowingCards ? "pointer-events-none" : ""}`}
                onClick={() => !isShowingCards && handleCardClick(card.id)}
              >
                {card.isFlipped || card.isMatched ? (
                  <Image 
                    src={card.image} 
                    alt="Alebrije"
                    layout="fill"
                    objectFit="cover"
                    className={card.isMatched ? "opacity-70" : ""}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
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

  if (asButton) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 text-lg transition-all duration-200 ease-in-out">
            Play Memory Game
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] w-full max-h-[95vh] h-full p-0 overflow-auto bg-transparent border-none">
          <GameContent />
        </DialogContent>
      </Dialog>
    )
  }

  return <GameContent />
}