import React, { FC, useEffect, useRef } from "react";

import { Tagger } from "../../src";
import { loadTagger } from "./igo";
import { useAsyncEffect } from "./hooks/useAsyncEffect";
import useInput from "./hooks/useInput";

const App: FC = () => {
  const taggerRef = useRef<Tagger>();

  useAsyncEffect(async () => {
    taggerRef.current = await loadTagger();
  }, []);

  const [text, input] = useInput(s => {
    const tagger = taggerRef.current;
    console.log(tagger.parseNBest(s, 10));
  });

  return (
    <div>
      <p>{text}</p>
      <input onChange={input} />
    </div>
  );
};

export default App;
