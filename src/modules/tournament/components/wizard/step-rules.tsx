"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateRules, prevStep } from "../../store/tournamentWizardSlice";
import { tournamentWizardSchema } from "../../tournament.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createTournamentAction } from "@/server/actions/tournament.actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const rulesSchema = tournamentWizardSchema.shape.rules;

type FormValues = z.infer<typeof rulesSchema>;

export function StepRules() {
  const dispatch = useDispatch();
  const router = useRouter();
  const wizardState = useSelector((state: RootState) => state.tournamentWizard);
  const { data: activeOrg } = authClient.useActiveOrganization();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(rulesSchema),
    defaultValues: wizardState.rules,
  });

  const onSubmit = async (values: FormValues) => {
    if (!activeOrg?.id) {
      toast.error("Please select an organization first.");
      return;
    }

    setIsSubmitting(true);
    dispatch(updateRules(values));

    const payload = {
      metadata: wizardState.metadata,
      format: wizardState.format,
      rules: values,
    };

    try {
      const result = await createTournamentAction(payload, activeOrg.id);

      if (result.success && result.data) {
        toast.success("Tournament created successfully!");
        router.push(`/tournaments/${result.data.slug}/participants`);
      } else {
        toast.error(result.message || "Failed to create tournament");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="winPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Win Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="drawPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Draw Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lossPoints"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loss Points</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="tieBreaker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tie-Breaker Rule</FormLabel>
              <FormControl>
                <Input placeholder="e.g. head_to_head, goal_difference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => dispatch(prevStep())} disabled={isSubmitting}>
            Previous
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Tournament
          </Button>
        </div>
      </form>
    </Form>
  );
}
