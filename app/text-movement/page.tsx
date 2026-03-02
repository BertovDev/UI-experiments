"use client"

import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { useEffect, useState } from "react"
import { useControls, useCreateStore, LevaPanel } from "leva"
gsap.registerPlugin(SplitText)

const TextMovementContent = () => {
  const store = useCreateStore()
  const { baseColor, highlightColor, textColor, backgroundColor } = useControls({
    baseColor: "#76232E",
    highlightColor: "#C0973E",
    textColor: "#ffffff",
    backgroundColor: "#000000",
  }, { store })

  useEffect(() => {
    const split = new SplitText("#text", { type: "chars" })

    // 1. Set the initial color for all split characters explicitly to gray
    gsap.set(split.chars, {
      filter: "blur(0px)",
      color: baseColor,
      keyframes: {
        "0%": { color: highlightColor },
        "20%": { color: highlightColor },
        "40%": { color: highlightColor },
        "60%": { color: baseColor },
        "80%": { color: baseColor },
        "100%": { color: baseColor },
      },
    })

    // Create a timeline that repeats infinitely
    const tl = gsap.timeline({ repeat: -1 })

    // Use keyframes to smoothly transition back and forth to gray
    // The timeline repeat: -1 handles starting from the left again automatically
    tl.to(split.chars, {
      filter: "blur(2px)", duration: 0.5, stagger: 0.05, keyframes: {
        "0%": { color: highlightColor },
        "20%": { color: highlightColor },
        "40%": { color: highlightColor },
        "60%": { color: baseColor },
        "80%": { color: baseColor },
        "100%": { color: baseColor },
      },
    }, "<0.5")
    tl.to(split.chars, {
      keyframes: {
        "0%": { color: highlightColor },
        "20%": { color: highlightColor },
        "40%": { color: highlightColor },
        "60%": { color: baseColor },
        "80%": { color: baseColor },
        "100%": { color: baseColor },
      },
      duration: .4,
      stagger: 0.05,
      filter: "blur(0px)",
      opacity: 1,
    }, ">")

    tl.to(split.chars, { filter: "blur(0px)", duration: 0.5, stagger: 0.05, }, "<")


    // Cleanup timeline and split text on unmount
    return () => {
      tl.kill()
      split.revert()
    }
  }, [baseColor, highlightColor])

  return (
    <div className="flex items-center flex-col h-[100dvh] w-screen justify-center overflow-hidden relative" style={{ backgroundColor }}>
      <div className="absolute inset-y-15 left-2 z-[9999] opacity-100 pointer-events-auto">
        <LevaPanel fill store={store} collapsed />
      </div>
      <h1 id="text" className="font-mono" style={{ color: textColor }}>
        Aguante Lanús
      </h1>
      <span id="text" className=" opacity-0 left-100 absolute">
        dummy
      </span>
      <div className="flex gap-4 my-2" style={{ color: highlightColor }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <h1 id="text" className="font-mono" style={{ color: textColor }}>
        Aguante Lanús
      </h1>
    </div>
  )
}

export default function TextMovement() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="h-[100dvh] w-screen bg-black" />

  return <TextMovementContent />
}
