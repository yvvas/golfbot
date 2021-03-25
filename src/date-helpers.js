const { addDays, set, differenceInHours } = require('date-fns')
const { utcToZonedTime } = require('date-fns-tz')

function makeDateRangeWithTz(endOfRange, tz) {
    const today = utcToZonedTime(new Date(), tz)
    const daysInRange = []
    for(let i = 0; i < endOfRange; i++) {
      const todayPlus = addDays(today, i)
      const timeCleared = set(todayPlus, {
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      })
      daysInRange.push(timeCleared)
    }
    return daysInRange
}

module.exports = { makeDateRangeWithTz }