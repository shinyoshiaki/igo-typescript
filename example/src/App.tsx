import React, { FC, useEffect, useRef, useState } from "react";

import { Tagger } from "../../src";
import { loadTagger } from "./igo";
import { useAsyncEffect } from "./hooks/useAsyncEffect";
import useInput from "./hooks/useInput";

const App: FC = () => {
  const taggerRef = useRef<Tagger>();
  const [ime, setIme] = useState("");

  useAsyncEffect(async () => {
    taggerRef.current = await loadTagger();
  }, []);

  const [text, input] = useInput(s => {
    const tagger = taggerRef.current;
    setIme(JSON.stringify(tagger.parseNBest(s, 10)));
  });

  return (
    <div>
      <p>{text}</p>
      <input onChange={input} />
      <p>{ime}</p>
    </div>
  );
};

export default App;
