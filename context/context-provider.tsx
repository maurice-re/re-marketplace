import { createContext, useContext, useState } from "react";
import { FormState } from "../models/form-state";

const AppContext = createContext<[FormState, (newContext: FormState) => void]>([
  new FormState(),
  () => {},
]);

export function AppWrapper({ children }: { children: JSX.Element }) {
  const [sharedState, setSharedState] = useState<FormState>(new FormState());

  function updateContext(newContext: FormState) {
    if (
      newContext.routes != sharedState.routes ||
      newContext.cart != sharedState.cart
    ) {
      setSharedState(newContext);
    }
  }

  return (
    <AppContext.Provider value={[sharedState, updateContext]}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
