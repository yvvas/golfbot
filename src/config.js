module.exports = {
    /**
     * Maxmimum days out for card holders is 9
     * and 7 days for non-card holders
     * Uncomment the appropriate line if you are a card holder
     * and remember to comment out the old line
     */ 
    // daysOut: 9, 
    daysOut: 7,
    
    /**
     * Times need to fall between these hours
     * You must use whole integers and military time
     */ 
    after: 17,
    before: 18,
    
    /**
     * Course list
     * Tries to reserve in ORDER!
     * 5997 Harding
     * 5998 Wilson
     * 5995 Hansen Dam
     * 23128 Hansen Dam (Back 9)
     * 5996 Harbor Park
     */
    courses: [
        5998,
        5997,
    ],
    
    /**
     * Don't touch!
     */ 
    holes: 18,
    players: 4,
    sponsor: 13358,
    tz: 'America/Los Angeles',
    u: process.env.USERNAME,
    p: process.env.PASSWORD,
    cc: process.env.CC,
}
