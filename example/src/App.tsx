import { Morpheme, Tagger } from "../../src";
import React, { FC, useEffect, useRef, useState } from "react";

import { loadTagger } from "./igo";
import { useAsyncEffect } from "./hooks/useAsyncEffect";
import useInput from "./hooks/useInput";

const App: FC = () => {
  const taggerRef = useRef<Tagger>();
  const [ime, setIme] = useState<Morpheme[][] | undefined>();

  useAsyncEffect(async () => {
    taggerRef.current = await loadTagger();
  }, []);

  const [text, input] = useInput(s => {
    const tagger = taggerRef.current;
    setIme(tagger.parseNBest(s, 10));
  });

  return (
    <div>
      <p>{text}</p>
      <input onChange={input} />
      {ime &&
        ime.flatMap(v => v).map(({ feature }, i) => <p key={i}>{feature}</p>)}
    </div>
  );
};

export default App;
