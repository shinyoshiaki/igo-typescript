import { useState } from "react";

export default function useInput(
  cb: (s: string) => void
): [string, (e: { target: { value: string } }) => void, () => void] {
  const [value, setvalue] = useState("");
  const input = (e: any) => {
    setvalue(e.target.value);
    cb(e.target.value);
  };
  const clear = () => {
    setvalue("");
  };

  return [value, input, clear];
}
