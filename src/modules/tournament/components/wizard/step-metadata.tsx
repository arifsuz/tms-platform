"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { updateMetadata, nextStep } from "../../store/tournamentWizardSlice";
import { tournamentWizardSchema } from "../../tournament.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const metadataSchema = tournamentWizardSchema.shape.metadata;

type FormValues = z.infer<typeof metadataSchema>;

export function StepMetadata() {
  const dispatch = useDispatch();
  const defaultValues = useSelector((state: RootState) => state.tournamentWizard.metadata);

  const form = useForm<FormValues>({
    resolver: zodResolver(metadataSchema),
    defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    dispatch(updateMetadata(values));
    dispatch(nextStep());
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Summer Championship 2026" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Brief description about this tournament" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="game"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Game / Sport</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Chess, Valorant, Futsal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}
