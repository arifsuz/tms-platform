"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { setStep, resetWizard } from "../../store/tournamentWizardSlice";
import { StepMetadata } from "./step-metadata";
import { StepFormat } from "./step-format";
import { StepRules } from "./step-rules";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const steps = [
  { id: 1, name: "Metadata", description: "Basic details" },
  { id: 2, name: "Format", description: "Engine & limits" },
  { id: 3, name: "Rules", description: "Points & tie-breakers" },
];

export function WizardLayout() {
  const currentStep = useSelector((state: RootState) => state.tournamentWizard.currentStep);
  const dispatch = useDispatch();

  useEffect(() => {
    // Reset wizard on mount
    dispatch(resetWizard());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Stepper */}
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => {
            const isCurrent = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <li key={step.name} className="md:flex-1">
                <div
                  className={cn(
                    "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                    isCompleted
                      ? "border-primary hover:border-primary/80"
                      : isCurrent
                      ? "border-primary"
                      : "border-muted"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCompleted || isCurrent ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Step {step.id}
                  </span>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <StepMetadata />}
          {currentStep === 2 && <StepFormat />}
          {currentStep === 3 && <StepRules />}
        </CardContent>
      </Card>
    </div>
  );
}
