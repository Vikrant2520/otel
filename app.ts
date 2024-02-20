/*app.ts*/
import express, { Request, Express } from "express";
import { rollTheDice } from "./lib/dice";
import { metrics, trace } from "@opentelemetry/api";

const tracer = trace.getTracer("dice-server", "1.0.1");
const meter = metrics.getMeter("dice-server", "1.0.1");

const PORT: number = parseInt(process.env.PORT || "8080");
const app: Express = express();

app.get("/rolldice", (req, res) => {
  const rolls = req.query.rolls ? parseInt(req.query.rolls.toString()) : NaN;
  if (isNaN(rolls)) {
    res
      .status(400)
      .send("Request parameter 'rolls' is missing or not a number.");
    return;
  }
  res.send(JSON.stringify(rollTheDice(rolls, 1, 6)));
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

// Gives the current active span in the context
// trace.getActiveSpan
