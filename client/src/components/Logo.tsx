import { Sparkles } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-3 group">
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/60 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
        <div className="relative p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-none">
          AURA
        </h1>
        <p className="text-[12px] text-muted-foreground font-medium tracking-wide mt-1">
          AI Analytics Platform
        </p>
      </div>
    </div>
  );
}
