import { configureStore } from "@reduxjs/toolkit";
import tournamentWizardReducer from "@/modules/tournament/store/tournamentWizardSlice";

export const store = configureStore({
  reducer: {
    tournamentWizard: tournamentWizardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
