"use client"

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const awayName = (formData.get("awayName") as string) || config.away.name
    const homeName = (formData.get("homeName") as string) || config.home.name

    const awayPlayers = config.away.players.map(
      (_, i) => (formData.get(`awayPlayer_${i}`) as string) || `선수 ${i + 1}`
    )
    const homePlayers = config.home.players.map(
      (_, i) => (formData.get(`homePlayer_${i}`) as string) || `선수 ${i + 1}`
    )

    const targetPoints = Number(formData.get("targetPoints")) || config.targetPoints
    const maxTimeoutsPerSet = Math.min(
      5,
      Math.max(1, Number(formData.get("maxTimeoutsPerSet")) || config.maxTimeoutsPerSet)
    )

    const main = (formData.get("refereeMain") as string) || ""
    const sub = (formData.get("refereeSub") as string) || ""
    const scorer = (formData.get("refereeScorer") as string) || ""
    const official1 = (formData.get("refereeOfficial1") as string) || ""
    const official2 = (formData.get("refereeOfficial2") as string) || ""
    const notes = (formData.get("notes") as string) || ""

    onChangeConfig({
      ...config,
      targetPoints,
      maxTimeoutsPerSet,
      away: { ...config.away, name: awayName, players: awayPlayers },
      home: { ...config.home, name: homeName, players: homePlayers },
      referees: { main, sub, scorer, official1, official2 },
      notes,
    })

    onStart()
  }

  const handleMatchTypeChange = (matchType: MatchType) => {
    const defaults = defaultPlayerNames(matchType)
    onChangeConfig({
      ...config,
      matchType,
      away: { ...config.away, players: defaults.away },
      home: { ...config.home, players: defaults.home },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl space-y-6 pb-12">
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
            name="targetPoints"
            type="number"
            defaultValue={config.targetPoints}
            className="w-full rounded-lg border p-2 text-center text-sm font-bold focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold opacity-70">
            타임아웃 (1~5) / 세트당 최대 2회
          </label>
          <input
            name="maxTimeoutsPerSet"
            type="number"
            defaultValue={config.maxTimeoutsPerSet}
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
              onClick={() => onChangeConfig({ ...config, firstServiceSide: "away" })}
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
              onClick={() => onChangeConfig({ ...config, firstServiceSide: "home" })}
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
              onClick={() => onChangeConfig({ ...config, ballAssignment: "away" })}
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
              onClick={() => onChangeConfig({ ...config, ballAssignment: "home" })}
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
            name="awayName"
            type="text"
            defaultValue={config.away.name}
            placeholder="어웨이 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {config.away.players.map((p, idx) => (
            <input
              key={`away-p-${idx}`}
              name={`awayPlayer_${idx}`}
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
            name="homeName"
            type="text"
            defaultValue={config.home.name}
            placeholder="홈 팀명"
            className="w-full rounded border p-2 text-sm font-bold focus:outline-none"
          />
          {config.home.players.map((p, idx) => (
            <input
              key={`home-p-${idx}`}
              name={`homePlayer_${idx}`}
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
            name="refereeMain"
            type="text"
            defaultValue={config.referees.main}
            placeholder="주심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            name="refereeSub"
            type="text"
            defaultValue={config.referees.sub}
            placeholder="부심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            name="refereeScorer"
            type="text"
            defaultValue={config.referees.scorer}
            placeholder="기록심"
            className="rounded border p-2 text-xs focus:outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            name="refereeOfficial1"
            type="text"
            defaultValue={config.referees.official1}
            placeholder="경기원 1"
            className="rounded border p-2 text-xs focus:outline-none"
          />
          <input
            name="refereeOfficial2"
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
          name="notes"
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
          type="submit"
          className="rounded-lg bg-black text-white dark:bg-white dark:text-black py-3 text-sm font-bold"
        >
          경기 시작
        </button>
      </div>
    </form>
  )
}
