"use client"

import { useState } from "react"
import type { MatchConfig, MatchType } from "@/lib/pba/types"
import { matchTypeLabels, defaultPlayerNames } from "@/lib/pba/game"
import { useTheme } from "./theme-context"

interface SetupScreenProps {
  config: MatchConfig
  onChangeConfig: (config: MatchConfig) => void
  onStart: () => void
  onBack: () => void
}

export function SetupScreen({
  config: initialConfig,
  onChangeConfig,
  onStart,
  onBack,
}: SetupScreenProps) {
  const { theme } = useTheme()
  const [formData, setFormData] = useState<MatchConfig>(initialConfig)

  const handleMatchTypeChange = (matchType: MatchType) => {
    const defaults = defaultPlayerNames(matchType)
    setFormData((prev) => ({
      ...prev,
      matchType,
      away: { ...prev.away, players: defaults.away },
      home: { ...prev.home, players: defaults.home },
    }))
  }

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault()
    onChangeConfig(formData)
    onStart()
  }

  return (
    <form onSubmit={handleStart} className="mx-auto w-full max-w-2xl space-y-6 pb-12">
      {/* 경기 유형 선택 */}
      <div className="space-y-2">
        <label className="text-xs font-bold opacity-70">방식</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(matchTypeLabels) as Array<keyof typeof matchTypeLabels>).map((type) => {
            const active = formData.matchType === type
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleMatchTypeChange(type)}
                className={`rounded-lg py-2 text-sm font-bold transition-all ${
                  active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border opacity-60"
                }`}
              >
                {matchTypeLabels[type]}
              </button>
            )
          })}
        </div>
      </div>

      {/* 승리 점수 & 타임아웃 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold opacity-70">승리 점수</label>
          <input
            type="number"
            value={formData.targetPoints}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                targetPoints: Number(e.target.value) || 15,
              }))
            }
            className="w-full rounded-lg border p-2 text-center text-sm font-bold focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold opacity-70">
            타임아웃 (1~5) / 세트당 최대 2회
          </label>
          <input
            type="number"
            value={formData.maxTimeoutsPerSet}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                maxTimeoutsPerSet: Math.min(
                  5,
                  Math.max(1, Number(e.target.value) || 1)
                ),
              }))
            }
            className="w-full rounded-lg border p-2 text-center text-sm font-bold focus:outline-none"
          />
        </div>
      </div>

      {/* 초구(선공) & 볼 배정 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold opacity-70">초구 (선공)</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, firstServiceSide: "away" }))}
              className={`rounded-lg py-2 text-xs font-bold ${
                formData.firstServiceSide === "away"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border opacity-60"
              }`}
            >
              어웨이
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, firstServiceSide: "home" }))}
              className={`rounded-lg py-2 text-xs font-bold ${
                formData.firstServiceSide === "home"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border opacity-60"
              }`}
            >
              홈
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold opacity-70">공 (볼 배정)</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, ballAssignment: "away" }))}
              className={`rounded-lg py-2 text-xs font-bold ${
                formData.ballAssignment === "away"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border opacity-60"
              }`}
            >
              어웨이
            </button>
            <button
              type="button"
              onClick={() => setFormData((prev) => ({ ...prev, ballAssignment: "home" }))}
              className={`rounded-lg py-2 text-xs font-bold ${
                formData.ballAssignment === "home"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border opacity-60"
              }`}
            >
              홈
            </button>
          </div>
        </div>
      </div>

      {/* 팀 및 선수명 설정 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 어웨이 */}
        <div className="space-y-3 rounded-lg border p-3">
          <label className="text-xs font-bold opacity-70">어웨이 (왼쪽)</label>
          <input
            type="text"
            value={formData.away.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                away: { ...prev.away, name: e.target.value },
              }))
            }
            placeholder="어웨이 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {formData.away.players.map((p, idx) => (
            <input
              key={`away-p-${idx}`}
              type="text"
              value={p}
              onChange={(e) => {
                const nextPlayers = [...formData.away.players]
                nextPlayers[idx] = e.target.value
                setFormData((prev) => ({
                  ...prev,
                  away: { ...prev.away, players: nextPlayers },
                }))
              }}
              placeholder={`선수 ${idx + 1}`}
              className="w-full rounded border p-1.5 text-xs focus:outline-none"
            />
          ))}
        </div>

        {/* 홈 */}
        <div className="space-y-3 rounded-lg border p-3">
          <label className="text-xs font-bold opacity-70">홈 (오른쪽)</label>
          <input
            type="text"
            value={formData.home.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                home: { ...prev.home, name: e.target.value },
              }))
            }
            placeholder="홈 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {formData.home.players.map((p, idx) => (
            <input
              key={`home-p-${idx}`}
              type="text"
              value={p}
              onChange={(e) => {
                const nextPlayers = [...formData.home.players]
                nextPlayers[idx] = e.target.value
                setFormData((prev) => ({
                  ...prev,
                  home: { ...prev.home, players: nextPlayers },
                }))
              }}
              placeholder={`선수 ${idx + 1}`}
              className="w-full rounded border p-1.5 text-xs focus:outline-none"
            />
          ))}
        </div>
      </div>

      {/* 심판 정보 입력 */}
      <div className="space-y-3">
        <label className="text-xs font-bold opacity-70">심판진 설정</label>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={formData.referees.main}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                referees: { ...prev.referees, main: e.target.value },
              }))
            }
            placeholder="주심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={formData.referees.sub}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                referees: { ...prev.referees, sub: e.target.value },
              }))
            }
            placeholder="부심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={formData.referees.scorer}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                referees: { ...prev.referees, scorer: e.target.value },
              }))
            }
            placeholder="기록심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={formData.referees.official1}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                referees: { ...prev.referees, official1: e.target.value },
              }))
            }
            placeholder="경기원 1"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={formData.referees.official2}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                referees: { ...prev.referees, official2: e.target.value },
              }))
            }
            placeholder="경기원 2"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 메모 */}
      <div className="space-y-2">
        <label className="text-xs font-bold opacity-70">메모</label>
        <textarea
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="메모 작성..."
          className="w-full rounded-lg border p-2 text-xs focus:outline-none"
          rows={3}
        />
      </div>

      {/* 하단 버튼 */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border py-3 text-sm font-bold"
        >
          &lt; 뒤로
        </button>
        <button
          type="submit"
          className="rounded-lg bg-black text-white dark:bg-white dark:text-black py-3 text-sm font-bold"
        >
          경기 시작
        </button>
      </div>
    </form>
  )
}
