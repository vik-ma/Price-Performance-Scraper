"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface ScrapeContextProps {
  loadingScrape: boolean;
  setLoadingScrape: Dispatch<SetStateAction<boolean>>;
  errorMsg: string;
  setErrorMsg: Dispatch<SetStateAction<string>>;
  showErrorMsg: boolean;
  setShowErrorMsg: Dispatch<SetStateAction<boolean>>;
}

const NewScrapeContext = createContext<ScrapeContextProps>({
  loadingScrape: false,
  setLoadingScrape: () => {},
  errorMsg: "",
  setErrorMsg: () => {},
  showErrorMsg: false,
  setShowErrorMsg: () => {},
});

/* @ts-ignore */
export const NewScrapeContextProvider = ({ children }) => {
  const [loadingScrape, setLoadingScrape] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);

  return (
    <NewScrapeContext.Provider
      value={{
        loadingScrape,
        setLoadingScrape,
        errorMsg,
        setErrorMsg,
        showErrorMsg,
        setShowErrorMsg,
      }}
    >
      {children}
    </NewScrapeContext.Provider>
  );
};

export const useNewScrapeContext = () => useContext(NewScrapeContext);
