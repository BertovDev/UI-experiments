"use client"

import { useRef, useEffect, useState, ReactNode } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useAnimationFrame,
  MotionValue,
  useMotionValueEvent,
  AnimatePresence,
} from "framer-motion"
import { useDrag } from "@use-gesture/react"
import { useControls, Leva } from "leva"

import gsap from "gsap"
import { SplitText } from "gsap/SplitText"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import {
  BitcoinIcon,
  EthereumIcon,
  SolanaIcon,
  CardanoIcon,
  PolkadotIcon,
  ChainlinkIcon,
  PolygonIcon,
  AvalancheIcon,
} from "@/components/icons/crypto-icons"

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrambleTextPlugin)
}

const CRYPTO_DATA = [
  {
    name: "Bitcoin",
    price: "$64,230.50",
    icon: <BitcoinIcon className="h-5 w-5 fill-white" />,
    trend: "up" as const,
  },
  {
    name: "Ethereum",
    price: "$3,450.20",
    icon: <EthereumIcon className="h-5 w-5 fill-white" />,
    trend: "down" as const,
  },
  {
    name: "Solana",
    price: "$145.80",
    icon: <SolanaIcon className="h-5 w-5 fill-white" />,
    trend: "up" as const,
  },
  {
    name: "Cardano",
    price: "$0.45",
    icon: <CardanoIcon className="h-5 w-5 fill-white" />,
    trend: "down" as const,
  },
  {
    name: "Polkadot",
    price: "$7.20",
    icon: <PolkadotIcon className="h-5 w-5 fill-white" />,
    trend: "up" as const,
  },
  {
    name: "Chainlink",
    price: "$18.40",
    icon: <ChainlinkIcon className="h-5 w-5 fill-white" />,
    trend: "up" as const,
  },
  {
    name: "Polygon",
    price: "$0.89",
    icon: <PolygonIcon className="h-5 w-5 fill-white" />,
    trend: "down" as const,
  },
  {
    name: "Avalanche",
    price: "$45.30",
    icon: <AvalancheIcon className="h-5 w-5 fill-white" />,
    trend: "up" as const,
  },
]

// Animated Trending Icons
function TrendUpIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#10b981" // emerald-500
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      initial={{ pathLength: 0, opacity: 0, y: 5 }}
      animate={{ pathLength: 1, opacity: 1, y: 0 }}
      exit={{ pathLength: 0, opacity: 0, y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
      <polyline points="17 6 23 6 23 12"></polyline>
    </motion.svg>
  )
}

function TrendDownIcon() {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ef4444" // red-500
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      initial={{ pathLength: 0, opacity: 0, y: -5 }}
      animate={{ pathLength: 1, opacity: 1, y: 0 }}
      exit={{ pathLength: 0, opacity: 0, y: 5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
      <polyline points="17 18 23 18 23 12"></polyline>
    </motion.svg>
  )
}

function MorphingIcon({
  baseIcon,
  trend,
  index,
  rotation,
  ANGLE,
  isDragging,
}: {
  baseIcon: ReactNode
  trend: "up" | "down"
  index: number
  rotation: MotionValue<number>
  ANGLE: number
  isDragging: React.MutableRefObject<boolean>
}) {
  const [isActive, setIsActive] = useState(false)

  useMotionValueEvent(rotation, "change", (latest) => {
    // Same math as ScramblingCryptoText
    let diff = (latest + index * ANGLE) % 360
    if (diff < 0) diff += 360
    if (diff > 180) diff -= 360

    const distanceAbs = Math.abs(diff)
    // Same 0.2 tighter multiplier to match scramble delay
    const pRaw = 1 - distanceAbs / (ANGLE * 0.2)
    const p = Math.max(0, Math.min(1, pRaw))

    // If p > 0.5 (dead center zone) and we aren't dragging, we become active
    const shouldBeActive = p > 0.5 && !isDragging.current

    if (shouldBeActive !== isActive) {
      setIsActive(shouldBeActive)
    }
  })

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        {!isActive ? (
          <motion.div
            key="base-icon"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center text-xl"
          >
            {baseIcon}
          </motion.div>
        ) : (
          <motion.div
            key="trend-icon"
            initial={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.5, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {trend === "up" ? <TrendUpIcon /> : <TrendDownIcon />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ScramblingCryptoText({
  coinData,
  index,
  rotation,
  ANGLE,
}: {
  coinData: (typeof CRYPTO_DATA)[number]
  index: number
  rotation: MotionValue<number>
  ANGLE: number
}) {
  const textRef = useRef<HTMLSpanElement>(null)
  const splitRef = useRef<any>(null)
  const scrambleChars = "01234567890O080928$%#@!"
  const stateRef = useRef({ lastP: -1 })

  useEffect(() => {
    if (!textRef.current) return

    // Ensure we start cleanly with the coin's name
    textRef.current.innerText = coinData.name
    gsap.registerPlugin(SplitText)
    splitRef.current = new SplitText(textRef.current, { type: "chars" })

    return () => {
      splitRef.current?.revert()
    }
  }, [coinData.name])

  useAnimationFrame(() => {
    if (!splitRef.current || !textRef.current) return

    // We must safely calculate the shortest circular distance to 0 (the center screen).
    // The previous math broke on rapid negative swipe overflows. This explicitly normalizes it.
    let diff = (rotation.get() + index * ANGLE) % 360
    if (diff < 0) diff += 360
    if (diff > 180) diff -= 360

    const distanceAbs = Math.abs(diff)

    // Progress is 1 when dead center, 0 when beyond an ANGLE away.
    // 0.5 multiplier instead of 0.8 delays the scramble so it only happens very close to the center.
    const pRaw = 1 - distanceAbs / (ANGLE * 0.2)
    // clamp between 0 and 1
    const p = Math.max(0, Math.min(1, pRaw))

    // Don't waste cycles re-painting if we haven't moved or hit the stable bounds
    if (p === 0 && stateRef.current.lastP <= 0) return
    // (Force re-eval if p===1 to handle text swapping length bugs)
    if (p === 1 && stateRef.current.lastP === 1) return

    stateRef.current.lastP = p

    // Out of center zone: Force Name string
    if (p === 0) {
      if (textRef.current.innerText !== coinData.name) {
        splitRef.current.revert()
        textRef.current.innerText = coinData.name
        splitRef.current = new SplitText(textRef.current, { type: "chars" })
      }
      return
    }

    // Dead center: Force Price string
    if (p === 1) {
      if (textRef.current.innerText !== coinData.price) {
        splitRef.current.revert()
        textRef.current.innerText = coinData.price
        splitRef.current = new SplitText(textRef.current, { type: "chars" })
      }
      return
    }

    // Morph zone (0 < p < 1)
    const targetString = p > 0.5 ? coinData.price : coinData.name

    // If the string length has changed while scrambling, rebuild the SplitText
    if (textRef.current.innerText.length !== targetString.length) {
      splitRef.current.revert()
      textRef.current.innerText = targetString.replace(/./g, "#") // Fill with dummies so split finds correct length
      splitRef.current = new SplitText(textRef.current, { type: "chars" })
    }

    splitRef.current.chars.forEach((charEl: HTMLElement, i: number) => {
      const elementProgress = i / targetString.length
      const resolved =
        p > 0.5
          ? (p - 0.5) * 2 > elementProgress // Morphing towards price
          : (0.5 - p) * 2 > elementProgress // Morphing back towards name

      if (resolved) {
        charEl.innerText = targetString[i] ?? ""
      } else {
        charEl.innerText =
          scrambleChars[Math.floor(Math.random() * scrambleChars.length)] ?? ""
      }
    })

    // Manage color and font manually since React won't re-render this component per-frame
    if (p > 0.5) {
      if (coinData.trend === "up") {
        textRef.current.style.color = "#34d399" // emerald-400
      } else {
        textRef.current.style.color = "#f87171" // red-400
      }
      textRef.current.style.fontFamily = "var(--font-mono)"
    } else {
      textRef.current.style.color = "#ededed"
      textRef.current.style.fontFamily = "inherit"
    }
  })

  return (
    <span
      ref={textRef}
      className="text-sm tracking-wide font-medium"
      style={{ color: "#ededed" }} // Set initial base color
    >
      {coinData.name}
    </span>
  )
}

export default function CircularTickerPage() {
  const {
    numCards,
    itemHeight,
    itemWidth,
    perspective,
    springStiffness,
    springDamping,
    springMass,
    dragMomentumMultiplier,
    svgStrokeColor,
    svgStrokeWidth,
    svgStrokeOpacity,
    autoRotate,
    autoRotateSpeed,
  } = useControls({
    numCards: { value: 19, min: 10, max: 50, step: 1 },
    itemHeight: { value: 50, min: 20, max: 150, step: 1 },
    itemWidth: { value: 230, min: 100, max: 400, step: 1 },
    perspective: { value: 230, min: 100, max: 3000, step: 50 },
    springStiffness: { value: 200, min: 50, max: 1000, step: 10 },
    springDamping: { value: 55, min: 10, max: 100, step: 1 },
    springMass: { value: 1.0, min: 0.1, max: 10, step: 0.1 },
    dragMomentumMultiplier: { value: 5.0, min: 1, max: 20, step: 0.1 },
    svgStrokeColor: "#333333",
    svgStrokeWidth: { value: 1.5, min: 0, max: 10, step: 0.5 },
    svgStrokeOpacity: { value: 0.4, min: 0, max: 1, step: 0.1 },
    autoRotate: true,
    autoRotateSpeed: { value: 82, min: 0, max: 200, step: 1 },
  })

  const {
    cardScale,
    cardBorderColor,
    cardBorderTopOpacity,
    cardBorderBottomOpacity,
    cardHighlightOpacity,
    cardGlowOpacity,
    cardInnerShadowSize,
    cardInnerShadowOpacity,
  } = useControls("Selection Card", {
    cardScale: { value: 1, min: 0.8, max: 1.5, step: 0.01 },
    cardBorderColor: "#808080",
    cardBorderTopOpacity: { value: 0.25, min: 0, max: 1, step: 0.01 },
    cardBorderBottomOpacity: { value: 0.05, min: 0, max: 1, step: 0.01 },
    cardHighlightOpacity: { value: 0.5, min: 0, max: 1, step: 0.01 },
    cardGlowOpacity: { value: 0.13, min: 0, max: 1, step: 0.01 },
    cardInnerShadowSize: { value: 180, min: 0, max: 200, step: 5 },
    cardInnerShadowOpacity: { value: 0.00, min: 0, max: 0.5, step: 0.005 },
  })

  const {
    itemBorderColor,
    itemBorderTopOpacity,
    itemBorderBottomOpacity,
    itemHighlightOpacity,
  } = useControls("Item Cards", {
    itemBorderColor: "#808080",
    itemBorderTopOpacity: { value: 0.15, min: 0, max: 1, step: 0.01 },
    itemBorderBottomOpacity: { value: 0.04, min: 0, max: 1, step: 0.01 },
    itemHighlightOpacity: { value: 0.2, min: 0, max: 1, step: 0.01 },
  })

  const {
    gradientLeftX,
    gradientRightX,
    gradientWidth,
    gradientOpacity,
  } = useControls("Side Gradients", {
    gradientLeftX: { value: 471, min: -50, max: 3000, step: 1 },
    gradientRightX: { value: 471, min: -50, max: 3000, step: 1 },
    gradientWidth: { value: 20, min: 1, max: 20, step: 1 },
    gradientOpacity: { value: 1.0, min: 0, max: 1, step: 0.05 },
  })

  const cards = Array.from({ length: numCards }, (_, i) => ({
    id: i,
    // Wrap data based on index
    data: CRYPTO_DATA[i % CRYPTO_DATA.length],
  }))

  // Radius = (cardWidth / 2) / tan(PI / numCards) -> Now based on WIDTH for horizontal
  const RADIUS = itemWidth / 2 / Math.tan(Math.PI / numCards)
  // ANGLE per card
  const ANGLE = 360 / numCards

  // The raw rotation value in degrees
  const rotation = useMotionValue(0)

  // A spring to make dragging feel snappy/smooth
  const springRotation = useSpring(rotation, {
    stiffness: springStiffness,
    damping: springDamping,
    mass: springMass,
  })

  const [activeIndex, setActiveIndex] = useState(0)
  // We keep track if the user is currently dragging so we can pause auto-scroll
  const isDragging = useRef(false)

  // Detect the card currently passing through the center
  useMotionValueEvent(rotation, "change", (latest) => {
    const rawIndex = Math.round(-latest / ANGLE)
    const index = ((rawIndex % numCards) + numCards) % numCards
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  })

  // Timetracking for auto-pause
  const pauseUntil = useRef(0)
  const lastBypassIndex = useRef<number | null>(null)

  // Handle seamless auto-rotation
  useAnimationFrame((time, delta) => {
    if (autoRotate && !isDragging.current) {
      if (time < pauseUntil.current) return

      const currentRot = rotation.get()
      const nearestAngle = Math.round(currentRot / ANGLE) * ANGLE
      const distance = Math.abs(currentRot - nearestAngle)

      // Snap & Pause logic when hitting perfect center
      if (distance < 0.5) {
        const index = Math.round(-nearestAngle / ANGLE)
        if (lastBypassIndex.current !== index) {
          pauseUntil.current = time + 1500 // 1.5s pause
          lastBypassIndex.current = index
          rotation.set(nearestAngle) // Snap precisely
          return
        }
      } else if (distance > ANGLE / 4) {
        // Reset once we're far enough away
        lastBypassIndex.current = null
      }

      rotation.set(currentRot - (autoRotateSpeed * delta) / 1000)
    }
  })

  // Handle Dragging
  const bind = useDrag(
    ({ active, delta: [dx], velocity: [vx], direction: [dirX] }) => {
      isDragging.current = active

      if (active) {
        // Rotate the cylinder based on pixel dragged horizontally.
        const rotationChange = (dx / itemWidth) * ANGLE
        rotation.set(rotation.get() + rotationChange) // note the '+' for intuitive swipe direction
      } else {
        // Snap to nearest card upon release for momentum throw
        const currentRotation = rotation.get()
        const momentum = vx * dragMomentumMultiplier * dirX
        const targetRotation = currentRotation + momentum * ANGLE
        const nearestAngle = Math.round(targetRotation / ANGLE) * ANGLE
        rotation.set(nearestAngle)
      }
    },
    { filterTaps: true }
  )

  // Generate accurate 2D projection of the 3D cylinder boundaries to draw the SVG border
  const numPoints = 80
  const startAngle = -Math.PI / 1.5
  const endAngle = Math.PI / 1.5

  const topPoints: [number, number][] = []
  const bottomPoints: [number, number][] = []

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints
    const theta = startAngle + t * (endAngle - startAngle)
    const X = RADIUS * Math.sin(theta)
    const Z = RADIUS * Math.cos(theta) - RADIUS
    const factor = perspective / (perspective - Z)
    const yOffset = itemHeight / 2 + 1
    topPoints.push([X * factor, -yOffset * factor])
    bottomPoints.push([X * factor, yOffset * factor])
  }

  // Catmull-Rom → cubic bezier for a smooth curve through all points
  function pointsToSmoothPath(pts: [number, number][]): string {
    if (pts.length < 2) return ""
    const first = pts[0]!
    let d = `M ${first[0]} ${first[1]}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)]!
      const p1 = pts[i]!
      const p2 = pts[i + 1]!
      const p3 = pts[Math.min(i + 2, pts.length - 1)]!
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
    }
    return d
  }

  const topPathD = pointsToSmoothPath(topPoints)
  const bottomPathD = pointsToSmoothPath(bottomPoints)

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Leva collapsed={false} />
      <style>{`
        .perspective-container {
          perspective: ${perspective}px;
          transform-style: preserve-3d;
        }
        .cylinder {
          position: relative;
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
          touch-action: none; /* Important for clean dragging */
        }
        .card-3d {
          position: absolute;
          top: 50%;
          left: 50%;
          transform-style: preserve-3d;
          backface-visibility: hidden;
        }
      `}</style>

      {/* Outer wrapper to contain everything including the static center card */}
      <div className="relative w-full max-w-6xl mx-auto flex justify-center">
        {/* Ticker Container -> SWAPPED height/width logic roughly */}
        <div
          className="perspective-container relative flex h-[300px] w-full max-w-5xl select-none items-center justify-center overflow-hidden rounded-2xl"
          {...bind()}
        >
          {/* The Curvature Border SVG */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <svg
              width="1000"
              height="300"
              viewBox="-500 -150 1000 300"
              className="overflow-visible"
            >
              <path
                d={topPathD}
                fill="none"
                stroke={svgStrokeColor}
                strokeWidth={svgStrokeWidth}
                strokeOpacity={svgStrokeOpacity}
              />
              <path
                d={bottomPathD}
                fill="none"
                stroke={svgStrokeColor}
                strokeWidth={svgStrokeWidth}
                strokeOpacity={svgStrokeOpacity}
              />
            </svg>
          </div>

          {/* Left blur/fadeout mask */}
          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-40 bg-linear-to-r from-black/50 via-black/20 to-transparent backdrop-blur-[1px]"
            style={{ left: `${gradientLeftX}px` }}
          />

          {/* Right blur/fadeout mask */}
          <div
            className="pointer-events-none absolute inset-y-0 z-20 w-40 bg-linear-to-l from-black/50 via-black/20 to-transparent backdrop-blur-[1px]"
            style={{ right: `${gradientRightX}px` }}
          />

          {/* Glowing side lines on container edges */}
          <div
            className="pointer-events-none absolute inset-y-0 z-100"
            style={{
              left: `${gradientLeftX}px`,
              width: `${gradientWidth}px`,
              opacity: gradientOpacity,
              background: `linear-gradient(to bottom, transparent, #000000/10, transparent)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 z-100"
            style={{
              right: `${gradientRightX}px`,
              width: `${gradientWidth}px`,
              opacity: gradientOpacity,
              background: `linear-gradient(to bottom, transparent, #000000/10, transparent)`,
            }}
          />


          {/* Moving Content (The Cylinder) */}
          <motion.div
            className="cylinder cursor-grab active:cursor-grabbing z-10"
            style={{
              // we now map to rotateY
              rotateY: springRotation,
              // Move cylinder back by RADIUS to center the rotation axis
              z: -RADIUS,
            }}
          >

            {cards.map((card, i) => {
              const data = card.data
              if (!data) return null
              return <div
                key={card.id}
                className="card-3d"
                style={{
                  height: `${itemHeight}px`,
                  width: `${itemWidth}px`,
                  marginLeft: `-${itemWidth / 2}px`,
                  marginTop: `-${itemHeight / 2}px`,
                  transform: `rotateY(${i * ANGLE}deg) translateZ(${RADIUS}px)`,
                }}
              >
                <div className="relative shadow-white/10 flex h-full w-full items-center justify-center px-4 rounded-xl bg-[#0a0a0a] shadow-sm transition-colors">
                  {/* Gradient stroke border */}
                  <svg className="pointer-events-none absolute inset-0" width={itemWidth} height={itemHeight} viewBox={`0 0 ${itemWidth} ${itemHeight}`} fill="none">
                    <defs>
                      <linearGradient id={`item-border-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={itemBorderColor} stopOpacity={itemBorderTopOpacity} />
                        <stop offset="100%" stopColor={itemBorderColor} stopOpacity={itemBorderBottomOpacity} />
                      </linearGradient>
                    </defs>
                    <rect x="0.5" y="0.5" width={itemWidth - 1} height={itemHeight - 1} rx="11" ry="11" stroke={`url(#item-border-${i})`} strokeWidth="1" />
                  </svg>
                  {/* Top specular highlight */}
                  <div className="pointer-events-none absolute top-0 left-0 right-0 h-px" style={{ background: `radial-gradient(ellipse at 50% 0%, ${itemBorderColor}, transparent 70%)`, opacity: itemHighlightOpacity }} />
                  <MorphingIcon
                    baseIcon={data.icon}
                    trend={data.trend}
                    index={i}
                    rotation={springRotation}
                    ANGLE={ANGLE}
                    isDragging={isDragging}
                  />
                  <div className="font-mono pt-0.5 min-w-[80px] text-center">
                    <ScramblingCryptoText
                      coinData={data}
                      index={i}
                      rotation={springRotation}
                      ANGLE={ANGLE}
                    />
                  </div>
                </div>
              </div>
            })}
          </motion.div>
        </div>

        {/* Static Card rendered outside the main 3D cylinder to stay always on top */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
          {/* Arrow pointing down above the card */}
          <div className="flex justify-center absolute -translate-y-1/2 left-1/2 -translate-x-1/2 rotate-180">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white/40"
            >
              <path
                d="M8 2L3 10h10L8 2Z"
                fill="currentColor"
              />
            </svg>
          </div>

          {/* Active selection card */}
          <div
            className="relative flex items-center justify-center rounded-xl"
            style={{
              height: `${itemHeight}px`,
              width: `${itemWidth}px`,
              scale: `${cardScale}`,
            }}
          >
            {/* Gradient stroke border: bright top → dim bottom (top-lit curved surface) */}
            <svg
              className="pointer-events-none absolute inset-0"
              width={itemWidth}
              height={itemHeight}
              viewBox={`0 0 ${itemWidth} ${itemHeight}`}
              fill="none"
            >
              <defs>
                <linearGradient id="card-border-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cardBorderColor} stopOpacity={cardBorderTopOpacity} />
                  <stop offset="100%" stopColor={cardBorderColor} stopOpacity={cardBorderBottomOpacity} />
                </linearGradient>
              </defs>
              <rect
                x="0.5" y="0.5"
                width={itemWidth - 1}
                height={itemHeight - 1}
                rx="11" ry="11"
                stroke="url(#card-border-grad)"
                strokeWidth="1"
              />
            </svg>

            {/* Top specular highlight: radial gradient catchlight simulating a convex surface */}
            <div
              className="pointer-events-none absolute top-0 left-0 right-0 h-px"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${cardBorderColor}, transparent 70%)`,
                opacity: cardHighlightOpacity,
              }}
            />

            {/* Inner background radial glow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-white/10 via-transparent to-transparent"
              style={{ opacity: cardGlowOpacity }}
            />

            {/* Inner shadow */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ boxShadow: `inset 0 0 ${cardInnerShadowSize}px rgba(255,255,255,${cardInnerShadowOpacity})` }}
            />
          </div>

          {/* Arrow pointing up below the card */}
          <div className="flex justify-center absolute -translate-y-1/2  left-1/2   -translate-x-1/2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="text-white/40"
            >
              <path
                d="M8 2L3 10h10L8 2Z"
                fill="currentColor"
              />
            </svg>
          </div>

        </div>
      </div>
    </div>
  )
}
