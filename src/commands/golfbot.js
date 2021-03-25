const fs = require('fs')
const fsPromises = fs.promises
const dotenv = require("dotenv")
dotenv.config()
const { printIntro, printLine, printDouble } = require('../gfx')
const { format } = require('date-fns')
const { utcToZonedTime } = require('date-fns-tz')

const { DayPreference } = require('../day-preference')
const { Scanner } = require('../scanner')

const { makeDateRangeWithTz } = require('../date-helpers')

const config = require('../config')


// Monkeys
Date.prototype.stdTimezoneOffset = function () {
  const jan = new Date(this.getFullYear(), 0, 1)
  const jul = new Date(this.getFullYear(), 6, 1)
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
}
Date.prototype.isDst = function () { return this.getTimezoneOffset() < this.stdTimezoneOffset() }


const command = {
  name: 'golfbot',
  run: async toolbox => {
    const { print } = toolbox

    printIntro('Welcome to GOLFBOT', print)

    const myPreferedRange = makeDateRangeWithTz(config.daysOut, config.tz).map(date => new DayPreference(date, config))
    const preferedTimesLookup = myPreferedRange.reduce((byDateString, dayTimePreference) => {
      byDateString[dayTimePreference.dateString.split('/').join('').toString()] = dayTimePreference
      return byDateString
    }, {})

    // Start up the API
    const apiParams = { 
      baseURL: 'https://cityofla.ezlinksgolf.com/api',
      headers: { 
        Accept: 'application/vnd.github.v3+json',
      },
      withCredentials: true
    }
    const cx = new Scanner(toolbox.http.create(apiParams))

    // Scan that actutally works
    const res = await cx.api.post('/login/login', {
      'Login': config.u,
      'Password': config.p,
      'SessionID': '',
      'MasterSponsorID': config.sponsor.toString()
    })
        
    if(!res.ok) return

    await cx.storeSessionInfo(res)
    
    if(!cx.session) return // Session not started
    
    const results = await cx.api.get('search/init') 
    
    cx.storeSearch(results)
    
    // Fire off a bunch of search requests
    let scansInProgress = []
    for(dateToCheck of myPreferedRange.map(date => date.dateString)) {
      // Use the date without slashes as for your key
      // Save DayPreference objects under this string
      const dateKey = dateToCheck.split('/').join('').toString()
      const prefsForDate = preferedTimesLookup[dateKey]
      const zonedStart = utcToZonedTime(prefsForDate.teeAfter, prefsForDate.tz)
      const zonedEnd = utcToZonedTime(prefsForDate.teeBefore, prefsForDate.tz)

      print.info(`Checking: ${prefsForDate.dateString} ${format(zonedStart, 'h:mm aa')}-${format(zonedEnd, 'h:mm aa')}`)

      const matchingTimesForDate = cx.scanFor({
          'date': dateToCheck,
          'numHoles': config.holes,
          'numPlayers': config.players,
          'startTime': format(zonedStart, 'h:mm aa'),
          'endTime': format(zonedEnd, 'h:mm aa'),
          'courseIDs': config.courses,
          'holdAndReturnOne': false
      })
      scansInProgress.push(matchingTimesForDate)
    }

    // Store anything that matches our
    // prefs to use later
    const searchScans = async () => Promise.all(scansInProgress)
    // Block the rest of the program until promises
    // are fulfilled
    const searchResults = await searchScans()
    // Flatten results into a nice array
    const availableReservations = searchResults.flat()
    
    // Make a nice timeline of reservations available per course
    if(availableReservations.length > 0) {
      printLine(false, print)
      print.info(`FOUND: ${availableReservations.length} available times`)
      
      // Create a lookup tabel by course ID so we can
      // weigh our preferences by config list order
      const matchingTimesByCourse = availableReservations.reduce((byCourse, res) => {
        if(!byCourse[res.CourseID]) byCourse[res.CourseID] = []
        byCourse[res.CourseID].push(res)
        return byCourse
      }, {})
      
      print.info(`\nSelecting best time...`)
      print.info(`----------------------`)
      print.info(`SUCCESS!`)
      
      let bestTeetime = null
      let courses = config.courses
      courses.forEach(courseId => {

        // Use the latest possible match
        const teetimesInReverseOrder = matchingTimesByCourse[courseId].reverse()

        // Make only ONE reservation
        // preferring the first course in the list
        if(teetimesInReverseOrder.length && !bestTeetime) bestTeetime = teetimesInReverseOrder[0]
      })

      if(!bestTeetime) return
      printLine(true, print)
      printDouble(false, true, print)
      print.info('          Making reservation for:')
      print.info('          -----------------------\n')
      print.info(`  @${bestTeetime.CourseName} for ${bestTeetime.PlayersAvailable} Players`)
      print.info(`  ${bestTeetime.TeeDateDisplay} - ${bestTeetime.TeeTimeDisplay}`)
      print.info(`  Total Cost: ${bestTeetime.CurrencyDisplay}${bestTeetime.PriceWindowPrices} x ${bestTeetime.PlayersAvailable}\n\n`)
      printDouble(false, false, print)
      printLine(false, print)
      
      const confirmRes = await cx.makeReservationFor(bestTeetime, config.cc)

      // Print a helpful message
      if(confirmRes.ok) {
        printDouble(true, true, print)
        print.info('           Teetime reserved for:')
        print.info('          ----------------------\n')
        print.info(`  @${confirmRes.data.Location} for ${confirmRes.data.NumberOfPlayers} Players`)
        print.info(`  ${confirmRes.data.ScheduledTime}`)
        print.info(`  Total Cost: ${confirmRes.data.TotalPrice}\n\n`)
        printDouble(false, false, print)
        printLine(false, print)
      } else {
        printDouble(true, true, print)
        print.info('           RESERVATION FAILED')
        print.info('           ------------------\n')
        print.info('  Unexpected error encountered\n')
        printDouble(false, false, print)
        printLine(false, print)
      }
    }

    // No matches for your search preferences (see line: 101)
    else {
      printLine(false, print)
      print.info(`NO RESULTS FOUND`)
    }
    
    print.info('\n*****\n')
    // - scan - END
  },
}

module.exports = command
