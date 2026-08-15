"use client"

import { useRef } from "react"
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

  // 리렌더링 시 포커스가 풀리지 않도록 DOM Ref로 제어
  const awayNameRef = useRef<HTMLInputElement>(null)
  const homeNameRef = useRef<HTMLInputElement>(null)
  const awayPlayerRefs = useRef<(HTMLInputElement | null)[]>([])
  const homePlayerRefs = useRef<(HTMLInputElement | null)[]>([])

  const refereeMainRef = useRef<HTMLInputElement>(null)
  const refereeSubRef = useRef<HTMLInputElement>(null)
  const refereeScorerRef = useRef<HTMLInputElement>(null)
  const refereeOfficial1Ref = useRef<HTMLInputElement>(null)
  const refereeOfficial2Ref = useRef<HTMLInputElement>(null)
  const notesRef = useRef<HTMLTextAreaElement>(null)

  // 상위 Config로 한 번에 수집해 전달하는 함수
  const syncAndSave = () => {
    const updatedAwayPlayers = config.away.players.map((p, idx) => {
      const el = awayPlayerRefs.current[idx]
      return el ? el.value : p
    })

    const updatedHomePlayers = config.home.players.map((p, idx) => {
      const el = homePlayerRefs.current[idx]
      return el ? el.value : p
    })

    onChangeConfig({
      ...config,
      away: {
        ...config.away,
        name: awayNameRef.current?.value ?? config.away.name,
        players: updatedAwayPlayers,
      },
      home: {
        ...config.home,
        name: homeNameRef.current?.value ?? config.home.name,
        players: updatedHomePlayers,
      },
      referees: {
        main: refereeMainRef.current?.value ?? config.referees.main,
        sub: refereeSubRef.current?.value ?? config.referees.sub,
        scorer: refereeScorerRef.current?.value ?? config.referees.scorer,
        official1: refereeOfficial1Ref.current?.value ?? config.referees.official1,
        official2: refereeOfficial2Ref.current?.value ?? config.referees.official2,
      },
      notes: notesRef.current?.value ?? config.notes,
    })
  }

  const handleMatchTypeChange = (matchType: MatchType) => {
    syncAndSave()
    const defaults = defaultPlayerNames(matchType)
    onChangeConfig({
      ...config,
      matchType,
      away: { ...config.away, players: defaults.away },
      home: { ...config.home, players: defaults.home },
    })
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
            defaultValue={config.targetPoints}
            onBlur={(e) =>
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
            defaultValue={config.maxTimeoutsPerSet}
            onBlur={(e) =>
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
              onClick={() => {
                syncAndSave()
                onChangeConfig({ ...config, firstServiceSide: "away" })
              }}
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
              onClick={() => {
                syncAndSave()
                onChangeConfig({ ...config, firstServiceSide: "home" })
              }}
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
              onClick={() => {
                syncAndSave()
                onChangeConfig({ ...config, ballAssignment: "away" })
              }}
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
              onClick={() => {
                syncAndSave()
                onChangeConfig({ ...config, ballAssignment: "home" })
              }}
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
            ref={awayNameRef}
            type="text"
            defaultValue={config.away.name}
            placeholder="어웨이 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {config.away.players.map((p, idx) => (
            <input
              key={`away-player-${idx}`}
              ref={(el) => { awayPlayerRefs.current[idx] = el }}
              type="text"
              defaultValue={p}
              placeholder={`선수 ${idx + 1}`}
              className="w-full rounded border p-1.5 text-xs focus:outline-none"
            />
          ))}
        </div>

        {/* 홈 */}
        <div className="space-y-3 rounded-lg border p-3">
          <label className="text-xs font-bold opacity-70">홈 (오른쪽)</label>
          <input
            ref={homeNameRef}
            type="text"
            defaultValue={config.home.name}
            placeholder="홈 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {config.home.players.map((p, idx) => (
            <input
              key={`home-player-${idx}`}
              ref={(el) => { homePlayerRefs.current[idx] = el }}
              type="text"
              defaultValue={p}
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
            ref={refereeMainRef}
            type="text"
            defaultValue={config.referees.main}
            placeholder="주심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            ref={refereeSubRef}
            type="text"
            defaultValue={config.referees.sub}
            placeholder="부심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            ref={refereeScorerRef}
            type="text"
            defaultValue={config.referees.scorer}
            placeholder="기록심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            ref={refereeOfficial1Ref}
            type="text"
            defaultValue={config.referees.official1}
            placeholder="경기원 1"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            ref={refereeOfficial2Ref}
            type="text"
            defaultValue={config.referees.official2}
            placeholder="경기원 2"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* 메모 */}
      <div className="space-y-2">
        <label className="text-xs font-bold opacity-70">메모</label>
        <textarea
          ref={notesRef}
          defaultValue={config.notes}
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
            syncAndSave()
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
