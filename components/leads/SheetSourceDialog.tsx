"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogFooter,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCreateSheetSource, useUpdateSheetSource } from "@/hooks/useSheetSources";
import type { SheetSource } from "@/hooks/useSheetSources";

const PLATFORMS = [
  { value: "google",    label: "Google Ads" },
  { value: "facebook",  label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "meta",      label: "Meta" },
  { value: "whatsapp",  label: "WhatsApp" },
  { value: "other",     label: "Other" },
] as const;

const schema = z.object({
  name:        z.string().min(1, "Name is required").max(100),
  source:      z.string().min(1, "Source key is required").max(100),
  platform:    z.enum(["google", "facebook", "instagram", "meta", "whatsapp", "other"]),
  description: z.string().max(300).optional(),
  isActive:    z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existing?: SheetSource | null;
}

export function SheetSourceDialog({ open, onOpenChange, existing }: Props) {
  const isEditing = !!existing;
  const { mutate: create, isPending: creating } = useCreateSheetSource();
  const { mutate: update, isPending: updating } = useUpdateSheetSource();
  const isPending = creating || updating;

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { name: "", source: "", platform: "other", description: "", isActive: true },
    });

  useEffect(() => {
    if (open) {
      reset(existing
        ? { name: existing.name, source: existing.source, platform: existing.platform,
            description: existing.description ?? "", isActive: existing.isActive }
        : { name: "", source: "", platform: "other", description: "", isActive: true });
    }
  }, [open, existing, reset]);

  function onSubmit(values: FormValues) {
    if (isEditing) {
      update({ id: existing!._id, payload: values }, { onSuccess: () => onOpenChange(false) });
    } else {
      create(values, { onSuccess: () => onOpenChange(false) });
    }
  }

  const isActive = watch("isActive");

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="max-w-md">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>
            {isEditing ? "Edit Sheet Source" : "Add Sheet Source"}
          </ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label>Sheet Name</Label>
            <Input {...register("name")} placeholder="e.g. Abhin Google Ads" />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Source key */}
          <div className="space-y-1.5">
            <Label>Source Key</Label>
            <Input {...register("source")} placeholder="e.g. google ads" className="font-mono text-sm" />
            <p className="text-[11px] text-muted-foreground">
              Must match exactly what the App Script sends as <code className="bg-muted px-1 rounded">source</code>.
            </p>
            {errors.source && <p className="text-xs text-destructive">{errors.source.message}</p>}
          </div>

          {/* Platform */}
          <div className="space-y-1.5">
            <Label>Platform</Label>
            <Select
              value={watch("platform")}
              onValueChange={(v) => setValue("platform", v as FormValues["platform"])}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
            <Input {...register("description")} placeholder="e.g. June 2026 onwards" />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Active</p>
              <p className="text-xs text-muted-foreground">Shows in source dropdown when creating leads</p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(v) => setValue("isActive", v)}
            />
          </div>

          <ResponsiveDialogFooter className="pt-2 px-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Add Source"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
