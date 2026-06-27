"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateFormat, nextStep, prevStep } from "../../store/tournamentWizardSlice";
import { tournamentWizardSchema } from "../../tournament.schema";
import { TournamentType } from "@/generated/prisma/enums";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formatSchema = tournamentWizardSchema.shape.format;

type FormValues = z.infer<typeof formatSchema>;

export function StepFormat() {
  const dispatch = useDispatch();
  const defaultValues = useSelector((state: RootState) => state.tournamentWizard.format);

  const form = useForm<FormValues>({
    resolver: zodResolver(formatSchema),
    defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    dispatch(updateFormat(values));
    dispatch(nextStep());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="engineType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TournamentType.KNOCK_OUT}>Knock-out (Single Elimination)</SelectItem>
                  <SelectItem value={TournamentType.ROUND_ROBIN}>Round-Robin (League)</SelectItem>
                  <SelectItem value={TournamentType.SWISS}>Swiss System</SelectItem>
                  <SelectItem value={TournamentType.HYBRID}>Hybrid (Groups + Knock-out)</SelectItem>
                  <SelectItem value={TournamentType.LADDER}>Ladder</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Once the tournament starts, the format cannot be changed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="participantLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Participant Limit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={2}
                  max={512}
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                />
              </FormControl>
              <FormDescription>
                Maximum 512 participants supported for MVP.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => dispatch(prevStep())}>
            Previous
          </Button>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}
