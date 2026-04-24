"use client";

import { motion } from "framer-motion";
import { Settings, DollarSign, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCurrencyStore, CURRENCIES } from "@/lib/store/currencyStore";
import { fmtCompact, fmtFull } from "@/lib/currency";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function SettingsPage() {
  const { currencyCode, setCurrency } = useCurrencyStore();

  // preview numbers re-render whenever currencyCode changes because we read the store
  const preview1 = fmtFull(1234567);
  const preview2 = fmtCompact(1234567);
  const preview3 = fmtFull(9999);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto space-y-6 pb-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Settings className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">App-wide preferences</p>
        </div>
      </motion.div>

      {/* Currency section */}
      <motion.div variants={itemVariants}>
        <Card className="border-border/50 bg-card/80">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Currency
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose the currency displayed throughout the app — on reports, payments, courses, and revenue charts.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">

            {/* Currency grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CURRENCIES.map((c) => {
                const active = c.code === currencyCode;
                return (
                  <motion.button
                    key={c.code}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setCurrency(c.code)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-150",
                      active
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border/50 bg-card hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <div className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base font-bold",
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}>
                      {c.symbol.trim()}
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-xs font-semibold truncate", active ? "text-primary" : "text-foreground")}>
                        {c.code}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate leading-tight">
                        {c.label.split(" (")[0]}
                      </p>
                    </div>
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                      >
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Live preview */}
            <motion.div
              key={currencyCode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-border/40 bg-muted/20 p-4"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-3">
                Preview
              </p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="space-y-0.5">
                  <p className="text-lg font-bold text-foreground tabular-nums">{preview2}</p>
                  <p className="text-[10px] text-muted-foreground">Compact</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base font-bold text-foreground tabular-nums">{preview1}</p>
                  <p className="text-[10px] text-muted-foreground">Full</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base font-bold text-foreground tabular-nums">{preview3}</p>
                  <p className="text-[10px] text-muted-foreground">Small</p>
                </div>
              </div>
            </motion.div>

          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
