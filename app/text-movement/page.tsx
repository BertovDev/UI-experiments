"use client"

import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { useEffect } from "react"
gsap.registerPlugin(SplitText)

const TextMovement = () => {
  useEffect(() => {
    const split = new SplitText("#text", { type: "chars" })

    // 1. Set the initial color for all split characters explicitly to gray
    gsap.set(split.chars, { color: "#fff" })

    // Create a timeline that repeats infinitely
    const tl = gsap.timeline({ repeat: -1 })

    // Use keyframes to smoothly transition back and forth to gray
    // The timeline repeat: -1 handles starting from the left again automatically
    tl.to(split.chars, {
      keyframes: {
        "0%": { color: "#fff" },
        "20%": { color: "#76232E" },
        "40%": { color: "#C0973E" },
        "60%": { color: "#76232E" },
        "80%": { color: "#fff" },
        "100%": { color: "#fff" },
      },
      duration: 1.2,
      stagger: 0.05,
    })

    // Cleanup timeline and split text on unmount
    return () => {
      tl.kill()
      split.revert()
    }
  }, [])

  return (
    <div className="flex items-center flex-col h-screen w-screen bg-black justify-center">
      <h1 id="text" className="text-[#fff] font-mono">
        Aguante Lanus
      </h1>
      <span id="text" className=" opacity-0 left-100 absolute">
        dummy
      </span>
      <div className="flex gap-4 my-2 text-[#C0973E]">
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
      <h1 id="text" className="text-[#fff] font-mono">
        Aguante Lanus
      </h1>
    </div>
  )
}

export default TextMovement
