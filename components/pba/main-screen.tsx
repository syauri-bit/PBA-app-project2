"use client"

import { useState } from "react"
import { Settings, User, Users, RotateCcw, Sparkles } from "lucide-react"
import type { GameMode, MatchConfig } from "@/lib/pba/types"
import { MODE_LABELS } from "@/lib/pba/types"
import type { MatchDraft } from "@/lib/pba/draft"
import { useTheme } from "./theme-context"
import { SetupScreen } from "./setup-screen"
import { ScoringScreen } from "./scoring-screen"

interface MainScreenProps {
  onSelect?: (mode: GameMode) => void
  draft?: MatchDraft | null
  onResume?: () => void
  onDiscardDraft?: () => void
}

export function MainScreen({
  onSelect,
  draft,
  onResume,
  onDiscardDraft,
}: MainScreenProps) {
  const { theme } = useTheme()
  const [screen, setScreen] = useState<"main" | "setup" | "scoring">("main")
  const [mode, setMode] = useState<GameMode>("pba")
  const [config, setConfig] = useState<MatchConfig>({
    matchType: "singles",
    targetPoints: 15,
    maxTimeoutsPerSet: 1,
    firstServiceSide: "away",
    ballAssignment: "away",
    away: { name: "어웨이팀", players: ["선수 1"] },
    home: { name: "홈팀", players: ["선수 1"] },
    referees: {
      main: "",
      sub: "",
      scorer: "",
      official1: "",
      official2: "",
    },
    notes: "",
  })

  const handleSelectMode = (selectedMode: GameMode) => {
    setMode(selectedMode)
    setScreen("setup")
    if (onSelect) onSelect(selectedMode)
  }

  if (screen === "setup") {
    return (
      <SetupScreen
        config={config}
        onChangeConfig={(newConfig) => {
          setConfig(newConfig)
        }}
        onStart={() => {
          setScreen("scoring")
        }}
        onBack={() => setScreen("main")}
      />
    )
  }

  if (screen === "scoring") {
    return (
      <ScoringScreen
        mode={mode}
        config={config}
        onBack={() => setScreen("setup")}
      />
    )
  }

  const draftSummary = draft
    ? `${draft.config.away.name} vs ${draft.config.home.name} · ${
        draft.completedSets.length + 1
      }세트 진행 중`
    : ""

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between px-5 pt-5">
        <span className="text-sm font-semibold opacity-70">PBA</span>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
        <h1 className="mb-1 text-3xl font-black tracking-tight text-balance">
          PBA 경기 기록지
        </h1>
        <p className="mb-8 text-sm opacity-70">경기 모드를 선택하세요</p>

        {draft && (
          <div
            className="mb-5 flex w-full max-w-md flex-col gap-2 rounded-2xl border-2 p-4"
            style={{
              borderColor: theme.fg,
              backgroundColor: theme.fg,
              color: theme.bg,
            }}
          >
            <div className="flex items-center gap-2 text-sm font-bold">
              <RotateCcw className="h-4 w-4" />
              <span>진행 중인 경기가 있습니다</span>
            </div>
            <p className="text-xs opacity-80">{draftSummary}</p>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={onResume}
                className="flex-1 rounded-xl py-2 text-xs font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: theme.bg, color: theme.fg }}
              >
                이어서 하기
              </button>
              <button
                type="button"
                onClick={onDiscardDraft}
                className="rounded-xl border px-3 py-2 text-xs font-bold opacity-70 hover:opacity-100"
                style={{ borderColor: theme.bg }}
              >
                새 경기
              </button>
            </div>
          </div>
        )}

        <div className="grid w-full max-w-md gap-3">
          {(["pba", "lpba", "team"] as GameMode[]).map((m) => {
            const Icon = m === "pba" ? User : m === "lpba" ? Sparkles : Users
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleSelectMode(m)}
                className="flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-all hover:scale-[1.01]"
                style={{ borderColor: theme.fg }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: theme.fg,
                      color: theme.bg,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-extrabold">{MODE_LABELS[m]}</div>
                    <div className="text-xs opacity-60">
                      {m === "team" ? "팀리그 방식" : "개인전 방식"}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-bold opacity-40">&rarr;</span>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
