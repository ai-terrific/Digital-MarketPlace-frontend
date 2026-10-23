import { useState } from "react";

export const useRefresh = () => {
  const [index, setIndex] = useState<number>(0);

  const refresh = () => {
    setIndex((prev) => prev + 1);
  };

  return { index, refresh };
};
