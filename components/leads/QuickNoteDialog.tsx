"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { StickyNote, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAddLeadNote } from "@/hooks/useLeads";

interface QuickNoteDialogProps {
  leadId: string;
  leadName: string;
  className?: string;
}

/**
 * Small note icon button for table rows — opens a dialog to add a note to the
 * lead without leaving the list. Uses the existing POST /leads/:id/notes API.
 */
export function QuickNoteDialog({ leadId, leadName, className = "" }: QuickNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");
  const { mutate: addNote, isPending } = useAddLeadNote();

  function handleSave() {
    const trimmed = content.trim();
    if (!trimmed) return;
    addNote(
      { leadId, content: trimmed },
      {
        onSuccess: () => {
          setContent("");
          setOpen(false);
        },
      },
    );
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className={`${className} text-amber-400 hover:text-amber-300 hover:bg-amber-500/10`}
            >
              <motion.div whileTap={{ scale: 0.9 }}>
                <StickyNote className="h-4 w-4" />
              </motion.div>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">Add note</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={open} onOpenChange={(v) => !isPending && setOpen(v)}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <StickyNote className="h-4 w-4 text-amber-400" />
              Add Note
            </DialogTitle>
            <DialogDescription className="text-xs">
              Note for <span className="font-medium text-foreground">{leadName}</span>
            </DialogDescription>
          </DialogHeader>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note…"
            rows={4}
            maxLength={2000}
            autoFocus
            className="resize-none"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleSave();
            }}
          />

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isPending || !content.trim()}
              className="gap-1.5"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QuickNoteDialog;
