import type { Request, Response } from "express";
import { handleGithubEvent } from "../services/webhookService.ts";

export async function handleGithubWebhook(req: Request, res: Response) {
  const eventHeader = (req.headers["x-github-event"] || req.headers["X-GitHub-Event"]) as string | undefined;
  console.log("--- GitHub Webhook Received ---");
  console.log("Event:", eventHeader);

  // Call the service to process the event. Service must not throw.
  try {
    await handleGithubEvent(eventHeader, req.body);
  } catch (err) {
    // Service should handle errors; log just in case.
    console.error("Unexpected error in webhook processing", err);
  }

  // Always return 200 to GitHub
  return res.status(200).json({ received: true });
}
