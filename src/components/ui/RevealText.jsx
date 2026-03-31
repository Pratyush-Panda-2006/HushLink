import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

export function RevealText({
  text = "STUNNING",
  textColor = "text-white",
  overlayColor = "text-red-500",
  fontSize = "text-[250px]",
  letterDelay = 0.08,
  overlayDelay = 0.05,
  overlayDuration = 0.4,
  springDuration = 600,
  autoCycle = false,
  autoCycleSpeed = 150,
  letterImages = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  ],
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [autoIndex, setAutoIndex] = useState(null);
  const [showRedText, setShowRedText] = useState(false);
  const isManualHover = useRef(false);

  // Overlay sweep after spring entrance
  useEffect(() => {
    const lastLetterDelay = (text.length - 1) * letterDelay;
    const totalDelay = lastLetterDelay * 1000 + springDuration;

    const timer = setTimeout(() => {
      setShowRedText(true);
    }, totalDelay);

    return () => clearTimeout(timer);
  }, [text.length, letterDelay, springDuration]);

  // Auto-cycle: sweep the active letter index continuously
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!autoCycle) return;

    // Wait for entrance + overlay to finish before starting auto-cycle
    const lastLetterDelay = (text.length - 1) * letterDelay;
    const overlayFinish = lastLetterDelay * 1000 + springDuration + (text.length * overlayDelay * 1000) + (overlayDuration * 1000);

    const startTimer = setTimeout(() => {
      let idx = 0;
      setAutoIndex(0);

      intervalRef.current = setInterval(() => {
        if (!isManualHover.current) {
          idx = (idx + 1) % (text.length + 2); // +2 adds a brief "gap" between loops
          setAutoIndex(idx < text.length ? idx : null);
        }
      }, autoCycleSpeed);
    }, overlayFinish + 200);

    return () => {
      clearTimeout(startTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoCycle, autoCycleSpeed, text.length, letterDelay, springDuration, overlayDelay, overlayDuration]);

  // Determine which letter is "active" (manual hover takes priority)
  const activeIndex = isManualHover.current ? hoveredIndex : (hoveredIndex !== null ? hoveredIndex : autoIndex);

  return (
    <div className="flex items-center justify-center relative">
      <div className="flex">
        {text.split("").map((letter, index) => (
          <motion.span
            key={index}
            onMouseEnter={() => {
              isManualHover.current = true;
              setHoveredIndex(index);
            }}
            onMouseLeave={() => {
              isManualHover.current = false;
              setHoveredIndex(null);
            }}
            className={`${fontSize} font-black tracking-tight cursor-pointer relative overflow-hidden`}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              delay: index * letterDelay,
              type: "spring",
              damping: 8,
              stiffness: 200,
              mass: 0.8,
            }}
          >
            {/* Base text layer */}
            <motion.span
              className={`absolute inset-0 ${textColor}`}
              animate={{
                opacity: activeIndex === index ? 0 : 1,
              }}
              transition={{ duration: 0.12 }}
            >
              {letter}
            </motion.span>
            {/* Image text layer with background panning */}
            <motion.span
              className="text-transparent bg-clip-text bg-cover bg-no-repeat"
              animate={{
                opacity: activeIndex === index ? 1 : 0,
                backgroundPosition:
                  activeIndex === index ? "10% center" : "0% center",
              }}
              transition={{
                opacity: { duration: 0.12 },
                backgroundPosition: {
                  duration: 3,
                  ease: "easeInOut",
                },
              }}
              style={{
                backgroundImage: `url('${letterImages[index % letterImages.length]}')`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {letter}
            </motion.span>

            {/* Overlay text layer that sweeps across each letter */}
            {showRedText && (
              <motion.span
                className={`absolute inset-0 ${overlayColor} pointer-events-none`}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  delay: index * overlayDelay,
                  duration: overlayDuration,
                  times: [0, 0.1, 0.7, 1],
                  ease: "easeInOut",
                }}
              >
                {letter}
              </motion.span>
            )}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
