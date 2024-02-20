/*dice.ts*/

import { Span, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("dice-lib");
function rollOnce(i: number, min: number, max: number) {
  return tracer.startActiveSpan(`rollOnce:${i}`, (span) => {
    const result = Math.floor(Math.random() * (max - min) + min);
    span.setAttribute("dice-lib.rolled", result.toString());
    span.end();
    return result;
  });
}

export function rollTheDice(rolls: number, min: number, max: number) {
  return tracer.startActiveSpan(
    "rollTheDice",
    { attributes: { "dice-lib.rolls": rolls.toString() } },
    (span: Span) => {
      const result: number[] = [];
      for (let i = 0; i < rolls; i++) {
        result.push(rollOnce(i, min, max));
      }
      span.end();
      return result;
    }
  );
}
