import { useFlashlightStore } from '../../store/useFlashlightStore'

export function BatteryIndicator() {
  const batteryLevel = useFlashlightStore((s) => s.batteryLevel)
  const maxBattery = useFlashlightStore((s) => s.maxBattery)
  const percentage = (batteryLevel / maxBattery) * 100

  const barColor =
    percentage > 40 ? '#8fdc8f' : percentage > 15 ? '#dcc98f' : '#dc6e6e'

  return (
    <div className="battery-indicator">
      <div className="battery-indicator__label">BATERÍA</div>
      <div className="battery-indicator__track">
        <div
          className="battery-indicator__fill"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  )
}