import { createEffect, createSignal } from "solid-js";
import styles from "./SustainabilityGauge.module.scss";

interface SustainabilityGaugeProps {
  score: number; // 0 to 100
}

export default function SustainabilityGauge(props: SustainabilityGaugeProps) {
  const [animatedScore, setAnimatedScore] = createSignal(0);

  createEffect(() => {
    // Simple animation effect for the score
    setTimeout(() => {
      setAnimatedScore(props.score);
    }, 100);
  });

  const radius = 60;
  const circumference = radius * Math.PI; // Semi-circle
  const strokeDashoffset = () =>
    circumference - (animatedScore() / 100) * circumference;

  return (
    <div class={styles.gaugeContainer}>
      <div class={styles.gaugeHeader}>
        <span>Sustainability Score:</span>
        <span class={styles.scoreText}>{props.score}/100</span>
      </div>
      
      <div class={styles.svgWrapper}>
        <svg
          class={styles.gaugeSvg}
          viewBox="0 0 160 90"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Background Arc */}
          <path
            class={styles.bgArc}
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke-width="15"
            stroke-linecap="round"
          />
          {/* Foreground Arc */}
          <path
            class={styles.fgArc}
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke-width="15"
            stroke-linecap="round"
            style={{
              "stroke-dasharray": circumference,
              "stroke-dashoffset": strokeDashoffset(),
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        <div class={styles.centerScore}>
          <span class={styles.largeScore}>{animatedScore()}</span>
          <span class={styles.outOf}>/100</span>
        </div>
      </div>
    </div>
  );
}
