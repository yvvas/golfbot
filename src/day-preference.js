const {
    setHours,
    subHours,
    differenceInHours,
    isBefore,
    isAfter,
    format
} = require('date-fns')

const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz')

class DayPreference {
    constructor(dateObj, config) {  
        this.date = dateObj
        this.dateString = format(dateObj, 'MM/dd/yyyy')
        this.tz = config.tz
        
        // Get the hours of offset from your timezone
        const today = utcToZonedTime(new Date(), config.tz)
        const tzOffset = differenceInHours(today, new Date())
        
        // Set the time to our preferred hour
        const afterHour = setHours(this.date, config.after)
        const beforeHour = setHours(this.date, config.before)

        this.teeAfter = subHours(afterHour, tzOffset)
        this.teeBefore = subHours(beforeHour, tzOffset)
    }
    doesTeetimeFit(teetimeObj) {
        const zoned = zonedTimeToUtc(teetimeObj, this.tz)
        return isBefore(zoned, this.teeBefore) && isAfter(zoned, this.teeAfter) ? zoned : false
    }
}

module.exports = { DayPreference }
