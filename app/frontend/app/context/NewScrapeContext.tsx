"use client";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

// useContext for start-scrape/page.tsx and start-scrape/ScrapeCreator.tsx components

interface ScrapeContextProps {
  loadingScrape: boolean;
  setLoadingScrape: Dispatch<SetStateAction<boolean>>;
  errorCode: number;
  setErrorCode: Dispatch<SetStateAction<number>>;
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
  errorCode: 0,
  setErrorCode: () => {},
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
  const [errorCode, setErrorCode] = useState<number>(0);
  const [scrapeAllowedMsg, setScrapeAllowedMsg] = useState<string>("");
  const [isScrapeAllowed, setIsScrapeAllowed] = useState<boolean>(true);
  const [scrapeAllowedTimer, setScrapeAllowedTimer] = useState<number>(0);

  return (
    <NewScrapeContext.Provider
      value={{
        loadingScrape,
        setLoadingScrape,
        errorCode,
        setErrorCode,
        scrapeAllowedMsg,
        setScrapeAllowedMsg,
        isScrapeAllowed,
        setIsScrapeAllowed,
        scrapeAllowedTimer,
        setScrapeAllowedTimer,
      }}
    >
      {children}
    </NewScrapeContext.Provider>
  );
};

export const useNewScrapeContext = () => useContext(NewScrapeContext);
