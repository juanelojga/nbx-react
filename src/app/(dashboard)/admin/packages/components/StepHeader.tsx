import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface StepHeaderProps {
  currentStep: number;
  steps: Step[];
}

export function StepHeader({ currentStep, steps }: StepHeaderProps) {
  return (
    <div className="w-full">
      <nav aria-label="Progress" className="px-4 py-6">
        <ol
          role="list"
          className="flex items-center justify-between gap-2 sm:gap-4"
        >
          {steps.map((step, index) => {
            const isActive = step.number === currentStep;
            const isCompleted = step.number < currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <li
                key={step.number}
                className={cn(
                  "flex flex-col items-center flex-1 relative",
                  index !== steps.length - 1 &&
                    "after:content-[''] after:absolute after:top-5 after:left-[calc(50%+1.5rem)] after:w-[calc(100%-3rem)] after:h-[2px] after:bg-border sm:after:left-[calc(50%+2rem)] sm:after:w-[calc(100%-4rem)]",
                  index !== steps.length - 1 &&
                    isCompleted &&
                    "after:bg-primary"
                )}
              >
                <div className="flex flex-col items-center gap-2 relative z-10">
                  {/* Step Circle */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all duration-200",
                      isActive &&
                        "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                      isCompleted &&
                        "border-primary bg-primary text-primary-foreground",
                      isUpcoming &&
                        "border-border bg-background text-muted-foreground"
                    )}
                    aria-current={isActive ? "step" : undefined}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <span className="text-sm sm:text-base font-semibold">
                        {step.number}
                      </span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={cn(
                      "text-xs sm:text-sm font-medium text-center max-w-[80px] sm:max-w-none transition-colors",
                      isActive && "text-primary font-semibold",
                      isCompleted && "text-foreground",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
