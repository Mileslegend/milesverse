'use client'
import TimeAgoComponent from 'react-timeago'

function TimeAgo({date}: { date: Date}) {
  return (
    <TimeAgoComponent date={date} />
  )
}

export default TimeAgo