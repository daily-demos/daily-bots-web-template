import React, { useState } from "react";
import { TransportState, VoiceError, VoiceEvent } from "realtime-ai";
import { useVoiceClient, useVoiceClientEvent } from "realtime-ai-react";

const App: React.FC = () => {
  const voiceClient = useVoiceClient();
  const [error, setError] = useState<string | null>(null);
  const [botTranscript, setBotTranscript] = useState<string[]>([]);
  const [state, setState] = useState<TransportState>("idle");

  useVoiceClientEvent(VoiceEvent.BotTranscript, (transcript) => {
    setBotTranscript((prev) => [...prev, transcript]);
  });

  useVoiceClientEvent(
    VoiceEvent.TransportStateChanged,
    (state: TransportState) => {
      setState(state);
    }
  );

  async function start() {
    if (!voiceClient) return;

    try {
      await voiceClient.start();
    } catch (e) {
      setError((e as VoiceError).message || "Unknown error occured");
      voiceClient.disconnect();
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-red-500 text-bold">{error}</div>

      {state === "idle" && (
        <button
          onClick={() => start()}
          className="mx-auto bg-slate-300 px-5 py-2 rounded-full self-center"
        >
          Start
        </button>
      )}

      <div className="text-center">
        Transport state: <strong>{state}</strong>
      </div>

      <div className="mt-10">
        {botTranscript.map((transcript, index) => (
          <div key={index}>{transcript}</div>
        ))}
      </div>
    </div>
  );
};

export default App;
