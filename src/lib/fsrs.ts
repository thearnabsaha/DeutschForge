/**
 * FSRS-4.5 (Free Spaced Repetition Scheduler) implementation.
 * Based on the open-source FSRS algorithm by Jarrett Ye.
 *
 * States: 0=New, 1=Learning, 2=Review, 3=Relearning
 * Ratings: 1=Again, 2=Hard, 3=Good, 4=Easy
 */

const W = [
  0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05,
  0.34, 1.26, 0.29, 2.61,
];

const DECAY = -0.5;
const FACTOR = Math.pow(0.9, 1 / DECAY) - 1;

export type Rating = 1 | 2 | 3 | 4;
export type State = 0 | 1 | 2 | 3;

export interface CardSchedulingInfo {
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: State;
  lastReview: Date | null;
  nextReview: Date;
}

export interface ReviewOutput {
  stability: number;
  difficulty: number;
  scheduledDays: number;
  state: State;
  lapses: number;
  reps: number;
  nextReview: Date;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function initStability(rating: Rating): number {
  return Math.max(W[rating - 1], 0.1);
}

function initDifficulty(rating: Rating): number {
  return clamp(W[4] - (rating - 3) * W[5], 1, 10);
}

function retrievability(elapsedDays: number, stability: number): number {
  if (stability <= 0) return 0;
  return Math.pow(1 + (FACTOR * elapsedDays) / stability, DECAY);
}

function nextDifficulty(d: number, rating: Rating): number {
  const newD = d - W[6] * (rating - 3);
  const meanReverted = W[4] + (newD - W[4]) * 0.1;
  return clamp(meanReverted, 1, 10);
}

function nextRecallStability(
  d: number,
  s: number,
  r: number,
  rating: Rating
): number {
  const hardPenalty = rating === 2 ? W[15] : 1;
  const easyBonus = rating === 4 ? W[16] : 1;
  return (
    s *
    (1 +
      Math.exp(W[8]) *
        (11 - d) *
        Math.pow(s, -W[9]) *
        (Math.exp(W[10] * (1 - r)) - 1) *
        hardPenalty *
        easyBonus)
  );
}

function nextForgetStability(
  d: number,
  s: number,
  r: number
): number {
  return (
    W[11] *
    Math.pow(d, -W[12]) *
    (Math.pow(s + 1, W[13]) - 1) *
    Math.exp(W[14] * (1 - r))
  );
}

function nextInterval(stability: number): number {
  const interval = (stability / FACTOR) * (Math.pow(0.9, 1 / DECAY) - 1);
  return Math.max(Math.round(interval), 1);
}

export function scheduleReview(
  card: CardSchedulingInfo,
  rating: Rating,
  now: Date = new Date()
): ReviewOutput {
  const elapsed =
    card.lastReview
      ? (now.getTime() - card.lastReview.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

  let newStability: number;
  let newDifficulty: number;
  let newState: State;
  let newLapses = card.lapses;
  let scheduledDays: number;

  if (card.state === 0) {
    newStability = initStability(rating);
    newDifficulty = initDifficulty(rating);

    if (rating === 1) {
      newState = 1;
      scheduledDays = 0;
      newLapses += 1;
    } else if (rating === 2) {
      newState = 1;
      scheduledDays = 0;
    } else {
      newState = 2;
      scheduledDays = nextInterval(newStability);
    }
  } else {
    const r = retrievability(elapsed, card.stability);
    newDifficulty = nextDifficulty(card.difficulty, rating);

    if (rating === 1) {
      newStability = nextForgetStability(newDifficulty, card.stability, r);
      newState = 3;
      scheduledDays = 0;
      newLapses += 1;
    } else {
      newStability = nextRecallStability(
        newDifficulty,
        card.stability,
        r,
        rating
      );
      if (card.state === 1 || card.state === 3) {
        newState = rating === 2 ? (card.state as State) : 2;
        scheduledDays = rating === 2 ? 0 : nextInterval(newStability);
      } else {
        newState = 2;
        scheduledDays = nextInterval(newStability);
      }
    }
  }

  const nextReview = new Date(now);
  if (scheduledDays === 0) {
    nextReview.setMinutes(nextReview.getMinutes() + (rating === 1 ? 1 : 10));
  } else {
    nextReview.setDate(nextReview.getDate() + scheduledDays);
  }

  return {
    stability: Math.max(newStability, 0.01),
    difficulty: newDifficulty,
    scheduledDays,
    state: newState,
    lapses: newLapses,
    reps: card.reps + 1,
    nextReview,
  };
}

export function getRetrievability(
  elapsedDays: number,
  stability: number
): number {
  return retrievability(elapsedDays, stability);
}
