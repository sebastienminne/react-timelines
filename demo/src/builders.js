import {
  START_YEAR,
  NUM_OF_YEARS,
  MONTH_NAMES,
  MONTHS_PER_YEAR,
  DAYS_PER_YEAR,
  QUARTERS_PER_YEAR,
  MONTHS_PER_QUARTER,
  NUM_OF_MONTHS,
  MAX_TRACK_START_GAP,
  MAX_ELEMENT_GAP,
  MAX_MONTH_SPAN,
  MIN_MONTH_SPAN,
  MAX_NUM_OF_SUBTRACKS,
} from './constants'

import {
  fill,
  hexToRgb,
  colourIsLight,
  addMonthsToYear,
  addMonthsToYearAsDate,
  nextColor,
  randomTitle,
} from './utils'
import PointerMarker from '../../src/components/Timeline/Marker/Pointer'

export const buildQuarterCells = () => {
  const v = []
  for (let i = 0; i < QUARTERS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const quarter = (i % 4) + 1
    const startMonth = i * MONTHS_PER_QUARTER
    const s = addMonthsToYear(START_YEAR, startMonth)
    const e = addMonthsToYear(START_YEAR, startMonth + MONTHS_PER_QUARTER)
    v.push({

      id: `${s.year}-q${quarter}`,
      title: `Q${quarter} ${s.year}`,
      start: new Date(`${s.year}-${s.month}-01`),
      end: new Date(`${e.year}-${e.month}-01`),
    })
  }
  return v
}

export const buildMonthCells = () => {
  const v = []
  for (let i = 0; i < MONTHS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const startMonth = i
    const start = addMonthsToYearAsDate(START_YEAR, startMonth)
    const end = addMonthsToYearAsDate(START_YEAR, startMonth + 1)
    v.push({
      id: `m${startMonth}`,
      title: MONTH_NAMES[i % 12],
      start,
      end,
    })
  }
  return v
}

export const buildDaysCells = () => {
  const v = []
  for (let year = START_YEAR; year < START_YEAR+NUM_OF_YEARS; year += 1) {
    for (let month = 0; month < MONTHS_PER_YEAR; month += 1) {
       for (let day = 0; day <= daysInMonth(year, month); day ++) {
        const start = new Date(year,month,day+1,0,0,0)
        const end = new Date(year,month,day+1,23,59,59)
        v.push({
          id: `d${day}-m${month}-y${year}`,
          title: ''+(day+1),
          start,
          end,
        })
      }
    }
  }

  console.log(v);
  return v
}

export const buildWeekNumberCells = () => {
  const v = []
  for (let year = START_YEAR; year < START_YEAR+NUM_OF_YEARS; year += 1) {
    for (let month = 0; month < MONTHS_PER_YEAR; month += 1) {
      for (let day = 0; day <= daysInMonth(year, month); day ++) {
        const start = new Date(year,month,day+1)
        const end = new Date(year,month,day+1+7)
        v.push({
          id: `d${day}-m${month}-y${year}`,
          title: ''+ISO8601_week_no(start),
          start,
          end,
        })
      }
    }
  }

  console.log(v);
  return v
}


export const ISO8601_week_no = (dt) =>
{
  var tdt = new Date(dt.valueOf());
  var dayn = (dt.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  var firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4)
  {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

export const buildTimebar = () => [
  {
    id: 'quarters',
    title: 'Quarters',
    cells: buildQuarterCells(),
    style: {
    },
  },
  {
    id: 'months',
    title: 'Months',
    cells: buildMonthCells(),
    useAsGrid: true,
    style: {
    },
  }/*,
  {
    id: 'days',
    title: 'Days',
    cells: buildDaysCells(),
    useAsGrid: true,
    style: {
    },
  },
  {
    id: 'weeks',
    title: 'Weeks',
    cells: buildWeekNumberCells(),
    useAsGrid: true,
    style: {
    },
  },*/
]

export const buildElement = ({
  trackId, start, end, i,
}) => {
  const bgColor = nextColor()
  const color = colourIsLight(...hexToRgb(bgColor)) ? '#000000' : '#ffffff'
  return (
    {
      id: `t-${trackId}-el-${i}`,
      title: randomTitle(),
      start,
      end,
      style: {
        backgroundColor: `#${bgColor}`,
        color,
        borderRadius: '4px',
        boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
        textTransform: 'capitalize',
      },
    }
  )
}

export const buildTrackStartGap = () => Math.floor(Math.random() * MAX_TRACK_START_GAP)
export const buildElementGap = () => Math.floor(Math.random() * MAX_ELEMENT_GAP)

export const buildElements = (trackId) => {
  const v = []
  let i = 1
  let month = buildTrackStartGap()

  while (month < NUM_OF_MONTHS) {
    let monthSpan = Math.floor(Math.random() * (MAX_MONTH_SPAN - (MIN_MONTH_SPAN - 1)))
      + MIN_MONTH_SPAN

    if (month + monthSpan > NUM_OF_MONTHS) {
      monthSpan = NUM_OF_MONTHS - month
    }

    const start = addMonthsToYearAsDate(START_YEAR, month)
    const end = addMonthsToYearAsDate(START_YEAR, month + monthSpan)
    v.push(buildElement({
      trackId, start, end, i,
    }))
    const gap = buildElementGap()
    month += monthSpan + gap
    i += 1
  }

  return v
}

export const daysInMonth = (year, month) => {
  var now = new Date(year, month, 1);
  return new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
}


export const buildSubtrack = (trackId, subtrackId) => (
  {
    id: `track-${trackId}-${subtrackId}`,
    title: `Subtrack ${subtrackId}`,
    elements: buildElements(subtrackId),
  }
)


/*
export const buildTracks = (trackId) => {
  const tracks = fill(Math.floor(Math.random() * MAX_NUM_OF_SUBTRACKS) + 1)
    .map(i => buildSubtrack(trackId, i + 1))
  return (
    {
      id: `track-${trackId}`,
      title: `Track ${trackId}`,
      elements: buildElements(trackId),
      tracks,
      // hasButton: true,
      // link: 'www.google.com',
      isOpen: false,
    }
  )

    return fetch("http://localhost:8082/timelines/boulanger")
      .then(res => res.json())
      .then(
        (result) => {
          result.timelines;
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log("error occured when fetching timelines");
        }
      )




}
*/
