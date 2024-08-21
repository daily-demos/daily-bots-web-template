"use client";

import { useEffect, useState } from "react";
import { DailyVoiceClient } from "realtime-ai-daily";
import { VoiceClientAudio, VoiceClientProvider } from "realtime-ai-react";

import App from "./App";

export default function Home() {
  const [dailyVoiceClient, setDailyVoiceClient] =
    useState<DailyVoiceClient | null>(null);

  useEffect(() => {
    if (dailyVoiceClient) {
      return;
    }

    const voiceClient = new DailyVoiceClient({
      baseUrl: "/api",
      services: {
        llm: "together",
        tts: "cartesia",
      },
      config: [
        {
          service: "tts",
          options: [
            { name: "voice", value: "79a125e8-cd45-4c13-8a67-188112f4dd22" },
          ],
        },
        {
          service: "llm",
          options: [
            {
              name: "model",
              value: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
            },
            {
              name: "initial_messages",
              value: [
                {
                  role: "system",
                  content:
                    "You are a assistant called ExampleBot. You can ask me anything. Keep responses brief and legible.",
                },
              ],
            },
            { name: "run_on_config", value: true },
          ],
        },
      ],
    });

    setDailyVoiceClient(voiceClient);
  }, [dailyVoiceClient]);

  return (
    <VoiceClientProvider voiceClient={dailyVoiceClient!}>
      <>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="flex flex-col gap-4 items-center">
            <h1 className="text-4xl font-bold">My First Daily Bot</h1>
            <App />
          </div>
        </main>
        <VoiceClientAudio />
      </>
    </VoiceClientProvider>
  );
}
