import { WizardLayout } from "@/modules/tournament/components/wizard/wizard-layout";

export const metadata = {
  title: "Create Tournament | TMS",
  description: "Create a new tournament",
};

export default function CreateTournamentPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Tournament</h1>
        <p className="text-muted-foreground">
          Initialize a new tournament, select the format, and define the rules.
        </p>
      </div>
      
      <WizardLayout />
    </div>
  );
}
