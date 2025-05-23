// src/context/SentimentContext.tsx
import React, {
  createContext,
  type ReactNode,
  useContext,
  useReducer,
} from "react";
import type { SentimentFeature } from "../services/csvLoader";

interface State {
  features: SentimentFeature[]; // full dataset
  filter: "all" | "positive" | "neutral" | "negative";
  selectedCountry?: string; // ISO code
}

type Action =
  | { type: "SET_DATA"; payload: SentimentFeature[] }
  | { type: "SET_FILTER"; payload: State["filter"] }
  | { type: "SELECT_COUNTRY"; payload?: string };

const initialState: State = {
  features: [],
  filter: "all",
  selectedCountry: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_DATA":
      return { ...state, features: action.payload };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SELECT_COUNTRY":
      return { ...state, selectedCountry: action.payload };
    default:
      return state;
  }
}

const SentimentContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

export function SentimentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <SentimentContext.Provider value={{ state, dispatch }}>
      {children}
    </SentimentContext.Provider>
  );
}

export function useSentimentContext() {
  return useContext(SentimentContext);
}
