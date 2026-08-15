"use client"

import { useState } from "react"
import type { MatchConfig, MatchType, Side } from "@/lib/pba/types"
import { matchTypeLabels, defaultPlayerNames } from "@/lib/pba/game"
import { useTheme } from "./theme-context"

interface SetupScreenProps {
  config: MatchConfig
  onChangeConfig: (config: MatchConfig) => void
  onStart: () => void
  onBack: () => void
}

export function SetupScreen({
  config,
  onChangeConfig,
  onStart,
  onBack,
}: SetupScreenProps) {
  const { theme } = useTheme()

  // 독립 Local State로 포커스 유지
  const [awayName, setAwayName] = useState(config.away.name)
  const [homeName, setHomeName] = useState(config.home.name)
  const [awayPlayers, setAwayPlayers] = useState(config.away.players)
  const [homePlayers, setHomePlayers] = useState(config.home.players)

  const [refereeMain, setRefereeMain] = useState(config.referees.main)
  const [refereeSub, setRefereeSub] = useState(config.referees.sub)
  const [refereeScorer, setRefereeScorer] = useState(config.referees.scorer)
  const [refereeOfficial1, setRefereeOfficial1] = useState(config.referees.official1)
  const [refereeOfficial2, setRefereeOfficial2] = useState(config.referees.official2)
  const [notes, setNotes] = useState(config.notes)

  // 입력 완료(onBlur) 시에만 상위 Config 갱신
  const saveTeamNames = () => {
    onChangeConfig({
      ...config,
      away: { ...config.away, name: awayName, players: awayPlayers },
      home: { ...config.home, name: homeName, players: homePlayers },
    })
  }

  const saveRefereesAndNotes = () => {
    onChangeConfig({
      ...config,
      referees: {
        main: refereeMain,
        sub: refereeSub,
        scorer: refereeScorer,
        official1: refereeOfficial1,
        official2: refereeOfficial2,
      },
      notes,
    })
  }

  const handleMatchTypeChange = (matchType: MatchType) => {
    const defaults = defaultPlayerNames(matchType)
    setAwayPlayers(defaults.away)
    setHomePlayers(defaults.home)
    onChangeConfig({
      ...config,
      matchType,
      away: { ...config.away, players: defaults.away },
      home: { ...config.home, players: defaults.home },
    })
  }

  const handleFirstServiceSideChange = (side: Side) => {
    onChangeConfig({ ...config, firstServiceSide: side })
  }

  const handleBallAssignmentChange = (side: Side) => {
    onChangeConfig({ ...config, ballAssignment: side })
  }

  const handleAwayPlayerChange = (index: number, val: string) => {
    const next = [...awayPlayers]
    next[index] = val
    setAwayPlayers(next)
  }

  const handleHomePlayerChange = (index: number, val: string) => {
    const next = [...homePlayers]
    next[index] = val
    setHomePlayers(next)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6 pb-12">
      {/* 경기 유형 선택 */}
      <div className="space-y-2">
        <label className="text-xs font-bold opacity-70">방식</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(matchTypeLabels) as Array<keyof typeof matchTypeLabels>).map((type) => {
            const active = config.matchType === type
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
            value={config.targetPoints}
            onChange={(e) =>
              onChangeConfig({
                ...config,
                targetPoints: Number(e.target.value) || 15,
              })
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
            value={config.maxTimeoutsPerSet}
            onChange={(e) =>
              onChangeConfig({
                ...config,
                maxTimeoutsPerSet: Math.min(
                  5,
                  Math.max(1, Number(e.target.value) || 1)
                ),
              })
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
              onClick={() => handleFirstServiceSideChange("away")}
              className={`rounded-lg py-2 text-xs font-bold ${
                config.firstServiceSide === "away"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border opacity-60"
              }`}
            >
              어웨이
            </button>
            <button
              type="button"
              onClick={() => handleFirstServiceSideChange("home")}
              className={`rounded-lg py-2 text-xs font-bold ${
                config.firstServiceSide === "home"
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
              onClick={() => handleBallAssignmentChange("away")}
              className={`rounded-lg py-2 text-xs font-bold ${
                config.ballAssignment === "away"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "border opacity-60"
              }`}
            >
              어웨이
            </button>
            <button
              type="button"
              onClick={() => handleBallAssignmentChange("home")}
              className={`rounded-lg py-2 text-xs font-bold ${
                config.ballAssignment === "home"
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
            value={awayName}
            onChange={(e) => setAwayName(e.target.value)}
            onBlur={saveTeamNames}
            placeholder="어웨이 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {awayPlayers.map((p, idx) => (
            <input
              key={`away-player-input-${idx}`}
              type="text"
              value={p}
              onChange={(e) => handleAwayPlayerChange(idx, e.target.value)}
              onBlur={saveTeamNames}
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
            value={homeName}
            onChange={(e) => setHomeName(e.target.value)}
            onBlur={saveTeamNames}
            placeholder="홈 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {homePlayers.map((p, idx) => (
            <input
              key={`home-player-input-${idx}`}
              type="text"
              value={p}
              onChange={(e) => handleHomePlayerChange(idx, e.target.value)}
              onBlur={saveTeamNames}
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
            value={refereeMain}
            onChange={(e) => setRefereeMain(e.target.value)}
            onBlur={saveRefereesAndNotes}
            placeholder="주심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={refereeSub}
            onChange={(e) => setRefereeSub(e.target.value)}
            onBlur={saveRefereesAndNotes}
            placeholder="부심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={refereeScorer}
            onChange={(e) => setRefereeScorer(e.target.value)}
            onBlur={saveRefereesAndNotes}
            placeholder="기록심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="text"
            value={refereeOfficial1}
            onChange={(e) => setRefereeOfficial1(e.target.value)}
            onBlur={saveRefereesAndNotes}
            placeholder="경기원 1"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={refereeOfficial2}
            onChange={(e) => setRefereeOfficial2(e.target.value)}
            onBlur={saveRefereesAndNotes}
            placeholder="경기원 2"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 메모 */}
      <div className="space-y-2">
        <label className="text-xs font-bold opacity-70">메모</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={saveRefereesAndNotes}
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
          type="button"
          onClick={() => {
            saveTeamNames()
            saveRefereesAndNotes()
            onStart()
          }}
          className="rounded-lg bg-black text-white dark:bg-white dark:text-black py-3 text-sm font-bold"
        >
          경기 시작
        </button>
      </div>
    </div>
  )
}
