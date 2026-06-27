import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TournamentType } from "@/generated/prisma/enums";

export interface TournamentWizardState {
  currentStep: number;
  metadata: {
    name: string;
    description?: string;
    game: string;
    timezone: string;
    logo?: string;
  };
  format: {
    engineType: TournamentType;
    participantLimit: number;
  };
  rules: {
    winPoints: number;
    lossPoints: number;
    drawPoints: number;
    tieBreaker: string;
  };
}

const initialState: TournamentWizardState = {
  currentStep: 1,
  metadata: {
    name: "",
    description: undefined,
    game: "",
    timezone: "UTC",
  },
  format: {
    engineType: "KNOCK_OUT",
    participantLimit: 16,
  },
  rules: {
    winPoints: 3,
    lossPoints: 0,
    drawPoints: 1,
    tieBreaker: "head_to_head",
  },
};

export const tournamentWizardSlice = createSlice({
  name: "tournamentWizard",
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep -= 1;
    },
    updateMetadata: (
      state,
      action: PayloadAction<Partial<TournamentWizardState["metadata"]>>
    ) => {
      state.metadata = { ...state.metadata, ...action.payload };
    },
    updateFormat: (
      state,
      action: PayloadAction<Partial<TournamentWizardState["format"]>>
    ) => {
      state.format = { ...state.format, ...action.payload };
    },
    updateRules: (
      state,
      action: PayloadAction<Partial<TournamentWizardState["rules"]>>
    ) => {
      state.rules = { ...state.rules, ...action.payload };
    },
    resetWizard: () => initialState,
  },
});

export const {
  setStep,
  nextStep,
  prevStep,
  updateMetadata,
  updateFormat,
  updateRules,
  resetWizard,
} = tournamentWizardSlice.actions;

export default tournamentWizardSlice.reducer;
