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
  scrapeAllowedMsg: string;
  setScrapeAllowedMsg: Dispatch<SetStateAction<string>>;
  isScrapeAllowed: boolean;
  setIsScrapeAllowed: Dispatch<SetStateAction<boolean>>;
  scrapeAllowedTimer: number;
  setScrapeAllowedTimer: Dispatch<SetStateAction<number>>;
}

const NewScrapeContext = createContext<ScrapeContextProps>({
  loadingScrape: false,
  setLoadingScrape: () => {},
  errorMsg: "",
  setErrorMsg: () => {},
  showErrorMsg: false,
  setShowErrorMsg: () => {},
  scrapeAllowedMsg: "",
  setScrapeAllowedMsg: () => {},
  isScrapeAllowed: true,
  setIsScrapeAllowed: () => {},
  scrapeAllowedTimer: 0,
  setScrapeAllowedTimer: () => {},
});

/* @ts-ignore */
export const NewScrapeContextProvider = ({ children }) => {
  const [loadingScrape, setLoadingScrape] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false);
  const [scrapeAllowedMsg, setScrapeAllowedMsg] = useState<string>("");
  const [isScrapeAllowed, setIsScrapeAllowed] = useState<boolean>(true);
  const [scrapeAllowedTimer, setScrapeAllowedTimer] = useState<number>(0);

  return (
    <NewScrapeContext.Provider
      value={{
        loadingScrape,
        setLoadingScrape,
        errorMsg,
        setErrorMsg,
        showErrorMsg,
        setShowErrorMsg,
        scrapeAllowedMsg,
        setScrapeAllowedMsg,
        isScrapeAllowed,
        setIsScrapeAllowed,
        scrapeAllowedTimer,
        setScrapeAllowedTimer
      }}
    >
      {children}
    </NewScrapeContext.Provider>
  );
};

export const useNewScrapeContext = () => useContext(NewScrapeContext);
