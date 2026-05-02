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
import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { generatePlan } from "@/lib/workoutData";
import DayCard from "@/components/workout/DayCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Flame, Clock, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export default function Progress() {
  const { data: progress = [], isLoading } = useQuery({
    queryKey: ["workout-progress"],
    queryFn: () => base44.entities.WorkoutProgress.list(),
  });

  // Load plan from localStorage
  let difficulty = "medium", duration = 30;
  try {
    const raw = localStorage.getItem("abs_plan");
    if (raw) { const p = JSON.parse(raw); difficulty = p.difficulty; duration = p.duration; }
  } catch {}
  const workoutPlan = generatePlan(difficulty, duration);

  const completedDays = progress.filter((p) => p.completed).map((p) => p.day);
  const totalCompleted = completedDays.length;
  const currentStreak = calculateStreak(completedDays);
  const totalTime = progress.reduce((sum, p) => sum + (p.duration_seconds || 0), 0);
  const totalMins = Math.round(totalTime / 60);

  function isUnlocked(day) {
    if (day === 1) return true;
    return completedDays.includes(day - 1) || completedDays.includes(day);
  }

  // Build week groups dynamically
  const weeks = [];
  for (let i = 0; i < workoutPlan.length; i += 7) {
    const weekNum = Math.floor(i / 7) + 1;
    const labels = ["Foundation", "Build", "Intensity", "Peak"];
    weeks.push({
      label: `Week ${weekNum} — ${labels[weekNum - 1] || "Final Push"}`,
      days: workoutPlan.slice(i, i + 7),
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-muted-foreground border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-extrabold text-sm tracking-widest uppercase">Progress</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Stats row */}
      <div className="px-6 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon={<Trophy className="w-4 h-4" />} label="Completed" value={totalCompleted} suffix="/30" />
          <StatCard icon={<Flame className="w-4 h-4" />} label="Streak" value={currentStreak} suffix=" days" />
          <StatCard icon={<Clock className="w-4 h-4" />} label="Total Time" value={totalMins} suffix=" min" />
          <StatCard icon={<Zap className="w-4 h-4" />} label="Progress" value={Math.round((totalCompleted / duration) * 100)} suffix="%" />
        </div>
      </div>

      {/* Weeks */}
      <div className="px-6 md:px-12 space-y-10">
        {weeks.map((week, wi) => (
          <motion.div
            key={wi}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: wi * 0.1 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-extrabold text-lg tracking-tight">{week.label}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {week.days.map((dayData, i) => (
                <DayCard
                  key={dayData.day}
                  dayData={dayData}
                  isCompleted={completedDays.includes(dayData.day)}
                  isUnlocked={isUnlocked(dayData.day)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, suffix }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{label}</span>
      </div>
      <p className="text-2xl font-extrabold tracking-tight">
        {value}<span className="text-sm font-normal text-muted-foreground">{suffix}</span>
      </p>
    </div>
  );
}

function calculateStreak(completedDays) {
  if (completedDays.length === 0) return 0;
  const sorted = [...completedDays].sort((a, b) => b - a);
  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i] - sorted[i + 1] <= 2) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Settings() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      // Delete all workout progress records for this user
      const records = await base44.entities.WorkoutProgress.list();
      await Promise.all(records.map((r) => base44.entities.WorkoutProgress.delete(r.id)));
      // Clear local plan
      localStorage.removeItem("abs_plan");
      // Log out
      base44.auth.logout("/");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen pb-24" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      {/* Header */}
      <div className="border-b border-border/50 px-4 py-4 flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="w-10 h-10 select-none">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="font-extrabold text-sm tracking-widest uppercase">Settings</h1>
      </div>

      <div className="px-6 py-8 max-w-lg mx-auto space-y-6">
        {/* Change Plan */}
        <section className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Workout Plan</p>
          <button
            className="w-full text-left bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/40 transition-colors select-none"
            onClick={() => { localStorage.removeItem("abs_plan"); navigate("/"); }}
          >
            <p className="font-semibold">Change Plan</p>
            <p className="text-sm text-muted-foreground mt-0.5">Reset and pick a new difficulty or duration</p>
          </button>
        </section>

        {/* Account */}
        <section className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Account</p>
          <button
            className="w-full text-left bg-card border border-destructive/30 rounded-lg px-5 py-4 hover:border-destructive/60 transition-colors select-none"
            onClick={() => setShowConfirm(true)}
          >
            <div className="flex items-center gap-3 text-destructive">
              <Trash2 className="w-4 h-4" />
              <p className="font-semibold">Delete Account</p>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Permanently delete your data and account</p>
          </button>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-40"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl p-6 space-y-5"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)" }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <p className="font-extrabold text-base">Delete Account?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will permanently delete all your workout data and sign you out. This action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  variant="destructive"
                  className="w-full h-12 rounded-full font-bold select-none"
                  disabled={deleting}
                  onClick={handleDeleteAccount}
                >
                  {deleting ? "Deleting…" : "Yes, Delete My Account"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-full font-bold select-none"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
import React, { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getDayData } from "@/lib/workoutData";
import Timer from "@/components/workout/Timer";
import ExerciseInfo from "@/components/workout/ExerciseInfo";
import RestOverlay from "@/components/workout/RestOverlay";
import WorkoutComplete from "@/components/workout/WorkoutComplete";
import { Button } from "@/components/ui/button";
import { ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PHASE = { READY: "ready", EXERCISE: "exercise", REST: "rest", DONE: "done" };

export default function Workout() {
  const urlParams = new URLSearchParams(window.location.search);
  const dayNum = parseInt(urlParams.get("day") || "1");
  const difficulty = urlParams.get("difficulty") || "medium";
  const duration = parseInt(urlParams.get("duration") || "30");
  const dayData = getDayData(dayNum, difficulty, duration);
  const queryClient = useQueryClient();
  const startTimeRef = useRef(Date.now());

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setIndex, setSetIndex] = useState(0);
  const [phase, setPhase] = useState(PHASE.READY);

  const currentExercise = dayData?.exercises[exerciseIndex];
  const totalSets = currentExercise?.sets || 1;
  const timerKey = `${exerciseIndex}-${setIndex}-${phase}`;

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.WorkoutProgress.create(data),
    onMutate: async (newRecord) => {
      await queryClient.cancelQueries({ queryKey: ["workout-progress"] });
      const prev = queryClient.getQueryData(["workout-progress"]);
      queryClient.setQueryData(["workout-progress"], (old = []) => [
        ...old,
        { ...newRecord, id: `optimistic-${Date.now()}` },
      ]);
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["workout-progress"], ctx.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["workout-progress"] }),
  });

  const getNextExerciseInfo = useCallback(() => {
    if (setIndex + 1 < totalSets) return currentExercise;
    if (exerciseIndex + 1 < dayData.exercises.length) return dayData.exercises[exerciseIndex + 1];
    return null;
  }, [setIndex, totalSets, exerciseIndex, dayData, currentExercise]);

  const advanceWorkout = useCallback(() => {
    if (setIndex + 1 < totalSets) {
      // More sets of current exercise
      setSetIndex((prev) => prev + 1);
      setPhase(PHASE.REST);
    } else if (exerciseIndex + 1 < dayData.exercises.length) {
      // Next exercise
      setExerciseIndex((prev) => prev + 1);
      setSetIndex(0);
      setPhase(PHASE.REST);
    } else {
      // Workout complete
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      saveMutation.mutate({
        day: dayNum,
        completed: true,
        completed_date: new Date().toISOString().split("T")[0],
        duration_seconds: Math.floor((Date.now() - startTimeRef.current) / 1000),
      });
      setPhase(PHASE.DONE);
    }
  }, [setIndex, totalSets, exerciseIndex, dayData, dayNum, saveMutation]);

  const handleTimerComplete = useCallback(() => {
    if (phase === PHASE.EXERCISE) {
      advanceWorkout();
    } else if (phase === PHASE.REST) {
      setPhase(PHASE.EXERCISE);
    }
  }, [phase, advanceWorkout]);

  const handleSkip = useCallback(() => {
    handleTimerComplete();
  }, [handleTimerComplete]);

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Day not found</p>
      </div>
    );
  }

  if (dayData.isRestDay) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
        <p className="text-6xl font-extrabold tracking-tighter">REST DAY</p>
        <p className="text-muted-foreground max-w-sm">Let your muscles rebuild. Hydrate, stretch gently, and come back stronger tomorrow.</p>
        <Link to="/">
          <Button variant="outline" className="mt-4">Back to Home</Button>
        </Link>
      </div>
    );
  }

  if (phase === PHASE.DONE) {
    const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return <WorkoutComplete day={dayNum} duration={duration} />;
  }

  const isRest = phase === PHASE.REST;
  const exerciseDuration = currentExercise?.holdSeconds || 30;
  const restDuration = currentExercise?.restAfter || 15;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-700 ${
        isRest ? "bg-primary" : "bg-background"
      }`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-full ${isRest ? "text-primary-foreground hover:bg-primary-foreground/10" : ""}`}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <span className={`font-mono text-xs tracking-[0.3em] uppercase ${isRest ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
          DAY {String(dayNum).padStart(2, "0")} · {exerciseIndex + 1}/{dayData.exercises.length}
        </span>
        <Link to="/">
          <Button
            variant="ghost"
            size="icon"
            className={`w-12 h-12 rounded-full ${isRest ? "text-primary-foreground hover:bg-primary-foreground/10" : ""}`}
          >
            <X className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8">
        <AnimatePresence mode="wait">
          {phase === PHASE.READY && (
            <motion.div
              key="ready"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-8"
            >
              <div>
                <p className="font-mono text-xs tracking-[0.4em] text-muted-foreground mb-4">GET READY</p>
                <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wide">
                  {currentExercise.name}
                </h2>
                <p className="text-muted-foreground mt-3 max-w-md mx-auto">
                  {currentExercise.instruction}
                </p>
              </div>
              <Button
                size="lg"
                className="h-16 px-12 rounded-full text-base font-bold tracking-wide"
                onClick={() => setPhase(PHASE.EXERCISE)}
              >
                BEGIN
              </Button>
            </motion.div>
          )}

          {phase === PHASE.EXERCISE && (
            <motion.div
              key={`exercise-${timerKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-8"
            >
              {/* Breathing pulse background */}
              <div className="fixed inset-0 bg-primary/5 animate-pulse-bg pointer-events-none" />

              <Timer
                key={timerKey}
                duration={exerciseDuration}
                onComplete={handleTimerComplete}
                onSkip={handleSkip}
                label={currentExercise.holdSeconds ? "Hold" : "Go!"}
                isRest={false}
              />
              <ExerciseInfo
                exercise={currentExercise}
                currentSet={setIndex + 1}
                totalSets={totalSets}
              />
            </motion.div>
          )}

          {phase === PHASE.REST && (
            <motion.div
              key={`rest-${timerKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <Timer
                key={timerKey}
                duration={restDuration}
                onComplete={handleTimerComplete}
                onSkip={handleSkip}
                label="Rest"
                isRest={true}
              />
              <RestOverlay nextExercise={getNextExerciseInfo()} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom progress bar */}
      <div className="px-6 pb-6">
        <div className={`h-1 rounded-full overflow-hidden ${isRest ? "bg-primary-foreground/10" : "bg-secondary"}`}>
          <motion.div
            className={`h-full rounded-full ${isRest ? "bg-primary-foreground/40" : "bg-primary"}`}
            initial={{ width: 0 }}
            animate={{
              width: `${((exerciseIndex * totalSets + setIndex) / (dayData.exercises.length * totalSets)) * 100}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
