import React from "react"
import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"

function MoodCalendar({ timeline }) {
  const heatmapData = timeline
    .filter(entry => entry.date && entry.emotion)
    .map(entry => ({
      date: entry.date.slice(0, 10),
      emotion: entry.emotion
    }))

  const startDate = new Date(Math.min(...timeline.map(e => new Date(e.date))))
  const endDate = new Date(Math.max(...timeline.map(e => new Date(e.date))))

  return (
    <div className="bg-white p-6 rounded-xl shadow border mt-10">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Mood Calendar
      </h3>

      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={heatmapData}
        classForValue={(value) => {
          if (!value) return "color-empty"
          return `color-${value.emotion}`
        }}
        titleForValue={(value) => {
          if (!value) return "No entry"
          return `${value.date} — ${value.emotion}`
        }}
        showWeekdayLabels={true}
      />
    </div>
  )
}

export default MoodCalendar
