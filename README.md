import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { generatePlan } from "@/lib/workoutData";
import { motion } from "framer-motion";
import { Play, Zap, Calendar, TrendingUp, Quote, Settings } from "lucide-react";
import PlanSelector from "@/components/workout/PlanSelector";

const QUOTES = [
  { text: "The body achieves what the mind believes.", author: "Unknown" },
  { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
  { text: "Your body can stand almost anything. It's your mind you have to convince.", author: "Unknown" },
  { text: "Strength does not come from the body. It comes from the will.", author: "Gandhi" },
  { text: "The only bad workout is the one that didn't happen.", author: "Unknown" },
  { text: "Take care of your body. It's the only place you have to live.", author: "Jim Rohn" },
  { text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown" },
  { text: "Don't wish for it. Work for it.", author: "Unknown" },
  { text: "Sweat is just fat crying.", author: "Unknown" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Success starts with self-discipline.", author: "Unknown" },
  { text: "Push yourself because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never came from comfort zones.", author: "Unknown" },
  { text: "It never gets easier. You just get stronger.", author: "Unknown" },
  { text: "Your health is an investment, not an expense.", author: "Unknown" },
  { text: "Be stronger than your strongest excuse.", author: "Unknown" },
  { text: "The difference between try and triumph is a little umph.", author: "Marvin Phillips" },
  { text: "Every champion was once a contender that refused to give up.", author: "Rocky Balboa" },
  { text: "You are one workout away from a good mood.", author: "Unknown" },
  { text: "Results happen over time, not overnight. Work hard, stay consistent.", author: "Unknown" },
  { text: "Fall in love with taking care of your body.", author: "Unknown" },
  { text: "Discipline is doing what needs to be done, even when you don't want to.", author: "Unknown" },
  { text: "The hard days are the best days because that's when champions are made.", author: "Gabby Douglas" },
  { text: "If it doesn't challenge you, it doesn't change you.", author: "Fred DeVito" },
  { text: "Once you see results, it becomes an addiction.", author: "Unknown" },
  { text: "Stop wishing. Start doing.", author: "Unknown" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
  { text: "Today's pain is tomorrow's power.", author: "Unknown" },
];

const DIFFICULTY_LABELS = { beginner: "Beginner", medium: "Medium", advanced: "Advanced" };

function loadPlan() {
  try {
    const raw = localStorage.getItem("abs_plan");
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function savePlan(difficulty, duration) {
  localStorage.setItem("abs_plan", JSON.stringify({ difficulty, duration }));
}

export default function Home() {
  const stored = loadPlan();
  const [plan, setPlan] = useState(stored);

  const { data: progress = [] } = useQuery({
    queryKey: ["workout-progress"],
    queryFn: () => base44.entities.WorkoutProgress.list(),
  });

  if (!plan) {
    return (
      <PlanSelector
        onSelect={(difficulty, duration) => {
          savePlan(difficulty, duration);
          setPlan({ difficulty, duration });
        }}
      />
    );
  }

  const { difficulty, duration } = plan;
  const workoutPlan = generatePlan(difficulty, duration);
  const completedDays = progress.filter((p) => p.completed).map((p) => p.day);
  const todayIndex = new Date().getDate() % QUOTES.length;
  const quote = QUOTES[todayIndex];
  const nextDay = completedDays.length === 0 ? 1 : Math.min(Math.max(...completedDays) + 1, duration);
  const nextDayData = workoutPlan.find((d) => d.day === nextDay);
  const totalCompleted = completedDays.length;
  const percentComplete = Math.round((totalCompleted / duration) * 100);

  function handleChangePlan() {
    localStorage.removeItem("abs_plan");
    setPlan(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-extrabold text-sm tracking-widest uppercase">ABS Challenge</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/progress" className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors uppercase">
            Progress
          </Link>
          <button
            onClick={handleChangePlan}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Change plan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Daily Quote */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="border-b border-border/50 px-6 md:px-12 lg:px-20 py-4 flex items-center gap-4"
      >
        <Quote className="w-4 h-4 text-primary shrink-0" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="text-foreground font-medium italic">"{quote.text}"</span>
          {quote.author !== "Unknown" && (
            <span className="ml-2 font-mono text-xs tracking-widest text-primary not-italic">— {quote.author}</span>
          )}
        </p>
      </motion.div>

      {/* Hero */}
      <div className="flex-1 flex flex-col lg:flex-row relative">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10 lg:opacity-[0.07]">
          <img
            src="https://media.base44.com/images/public/69f592086640baecdab1fdfe/1ba22906e_generated_b7c7073b.png"
            alt="Anatomical abs muscle rendering"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Left: Day indicator */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 lg:py-0">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Plan badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground border border-border px-3 py-1 rounded-full">
                {DIFFICULTY_LABELS[difficulty]}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary border border-primary/30 px-3 py-1 rounded-full">
                {duration} Days
              </span>
            </div>

            <p className="font-mono text-xs tracking-[0.4em] text-muted-foreground uppercase mb-4">
              {totalCompleted > 0 ? "Continue your journey" : "Begin your transformation"}
            </p>
            <h1 className="text-[15vw] lg:text-[10vw] font-extrabold leading-none tracking-tighter text-foreground">
              DAY
            </h1>
            <h1 className="text-[15vw] lg:text-[10vw] font-extrabold leading-none tracking-tighter text-primary">
              {String(nextDay).padStart(2, "0")}
            </h1>

            {nextDayData && !nextDayData.isRestDay && (
              <div className="mt-6 space-y-1">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                  {nextDayData.exercises.length} exercises · {nextDayData.focus}
                </p>
              </div>
            )}

            {nextDayData?.isRestDay ? (
              <div className="mt-8 px-6 py-4 bg-card border border-border rounded-lg inline-block">
                <p className="font-mono text-sm text-muted-foreground">Today is a rest day. Your muscles rebuild during recovery.</p>
              </div>
            ) : (
              <Link to={`/workout?day=${nextDay}&difficulty=${difficulty}&duration=${duration}`}>
                <Button
                  size="lg"
                  className="mt-8 h-16 px-10 rounded-full text-base font-bold tracking-wide gap-3"
                >
                  <Play className="w-5 h-5" />
                  Start Session
                </Button>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Right: Stats */}
        <div className="lg:w-96 border-t lg:border-t-0 lg:border-l border-border/50 p-6 md:p-12 flex flex-col justify-center gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <StatBlock
              icon={<Calendar className="w-4 h-4" />}
              label="Days Completed"
              value={`${totalCompleted}/${duration}`}
            />
            <StatBlock
              icon={<TrendingUp className="w-4 h-4" />}
              label="Progress"
              value={`${percentComplete}%`}
            />

            {/* Progress bar */}
            <div className="space-y-3">
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentComplete}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-primary rounded-full"
                />
              </div>
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground tracking-widest">
                <span>START</span>
                <span>HALFWAY</span>
                <span>DONE</span>
              </div>
            </div>

            {/* Quick day grid */}
            <div className="grid grid-cols-10 gap-1">
              {workoutPlan.map((d) => (
                <div
                  key={d.day}
                  className={`aspect-square rounded-sm transition-all ${
                    completedDays.includes(d.day)
                      ? "bg-primary"
                      : d.day === nextDay
                      ? "bg-primary/30 ring-1 ring-primary"
                      : "bg-secondary"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">{label}</span>
      </div>
      <p className="text-3xl font-extrabold tracking-tight">{value}</p>
    </div>
  );
}
