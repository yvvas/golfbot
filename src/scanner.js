
const { prepResponseReservation, prepResponseAdd } = require('./prep-response')

class Scanner {
  constructor(api) {
    // The apisauce axios instance
    this.api = api
    
    // Convenient place to store some session info
    this.session = null
    this.token = null
    
    // All the course info we need
    this.searchResults = null
    this.courses = null
    this.startDate = null
    this.endDate = null
    this.startTime = null
    this.endTime = null

    // The teetime we want to reserve
    this.hasReservation = null
  }
  // Unsure if this is needed but the webpage does it
  async clearCart() {
    try {
      return await this.api.post('/cart/removeall', { SessionID: this.session })
    } catch (error) {
      console.error(error)
    }
  }
  // Just a connection message
  onSuccess() {
    console.log('\n          Connection: SUCCESSFUL')
    console.log('------------------------------------------')
    console.log(`    session: ${this.session}`)
    console.log('------------------------------------------\n')
  }
  // Set the cookies for future responses
  async storeSessionInfo(res) {
    if(!res.ok) return

    const cookieMap = res.headers['set-cookie'].join('; ').split('; ').reduce((byKey, val) => {
      const keyVal = val.split('=')
      if(keyVal[1]) byKey[keyVal[0]] = keyVal[1]
      return byKey
    }, {})

    this.token = res.data.CsrfToken
    this.session = cookieMap['EZBookPro.SessionId']
    this.authorizationCode = res.data.AuthorizationCode
    this.contactId = res.data.ContactID
    this.cfduid = cookieMap.__cfduid
    this.cfruid = cookieMap.__cfruid

    const Cookie = `AuthorizationCode=${this.authorizationCode}; ContactID=${this.contactId}; EZBookPro.SessionId=${this.session}; __cfduid=${this.cfduid}; __cfruid=${this.cfruid};`
    this.api.setHeaders({ Cookie })
    
    const afterClearCart = await this.clearCart()
    if(afterClearCart.ok && afterClearCart.data.IsSuccessful) this.onSuccess()
  }
  // Storing our search results
  storeSearch(res) {
    if(!res.ok) return

    this.searchResults = res.data
    this.courses = this.searchResults.Courses
    this.startDate = this.searchResults.SearchMinDate
    this.endDate = this.searchResults.SearchMinDate
    this.startTime = this.searchResults.StartTimeSet
    this.endTime = this.searchResults.EndTimeSet
  }
  // Handy map to grab course info by id
  // Careful. The keys are Strings that look like numbers
  coursesById() {
    if(!this.courses) return
    return this.courses.reduce((byId, course) => {
      byId[course.CourseID] = course
      return byId
    }, {})
  }
  // Passing our parameters to the search endpoint
  async scanFor(params) {
    try {
      const res = await this.api.post('/search/search', params)
      return res.ok ? res.data['Reservations'] : null
    } catch (error) {
      console.error(error)
    }
  }
  // Adding our reservation to your cart
  async addToCart(res) {
    if(!res.ok) return
    console.log('\nAdding to cart...')
    console.log('-----------------')
    try {
      const availableTimes = res.data.ReservationPackages
      const addReq = prepResponseAdd(this.hasReservation, availableTimes[0], this.contactId, this.session, this.token)
      return await this.api.post('/cart/add', addReq)
    } catch (error) {
      console.error(error) // from creation or business logic
    }
  }
  // Initiated a search to find the groupId (needed for checkout)
  async getGroupId(added) {
    if(!added.data.IsSuccessful) return
    console.log('Getting group id...')
    console.log('-------------------')
    try {
      return await this.api.get('/search/init')
    } catch (error) {
      console.error(error)
    }
  }
  // Linking our credit card to our cart
  // Using the default or passing in a known number
  async linkCard(cc, group) {
    if(!group.ok) return
    try {
      let cardId = parseInt(cc)
      const allCards = await this.api.get('/card/all')
      if(!cc && allCards && allCards.ok && allCards.data.CreditCards.length) {
        cardId = allCards.data.CreditCards.filter(card => card.IsDefault)[0].CardId
      }
      if(!cardId) return 

      console.log(`Linking card: ${cardId}`)
      console.log('---------------------')
      return await this.api.post('/card/link', {
        'CardOnFileID': cardId,
        'SessionID': this.session,
        'SponsorID': this.hasReservation.SponsorID.toString(),
        'ContactID': this.contactId.toString(),
        'CourseID': this.hasReservation.CourseID.toString(),
        'MasterSponsorID': this.hasReservation.SponsorID.toString()
      })
    } catch (error) {
      console.error(error)
    }
  }
  // Unsure if this is needed but the website does it
  async crosscheck(link) {
    if(!link.ok || !link.data.Successful) return
    console.log('Performing cross check...')
    console.log('-------------------------')
    try {
      return await this.api.post('/cart/checkteetimeconflicts', {
        'CourseID': this.hasReservation.CourseID.toString(),
        'ContactID': this.contactId.toString(),
        'SponsorID': this.hasReservation.SponsorID.toString(),
        'TeeTime': this.hasReservation.TeeTime
      })
    } catch (error) {
      console.error(error)
    }
  }
  // Finalizing our order
  async checkout(crosscheck, groupId) {
    if(!crosscheck.ok) return
    console.log('Checking out...')
    console.log('---------------')
    try {
      return await this.api.post('/cart/finish', {
        'ContinueOnPartnerTeeTimeConflict': true,
        'Email1': null,
        'Email2': null,
        'Email3': null,
        'SponsorID': this.hasReservation.SponsorID.toString(),
        'CourseID': this.hasReservation.CourseID.toString(),
        'ReservationTypeID': this.hasReservation.ReservationTypeID.toString(),
        'SessionID': this.session,
        'ContactID': this.contactId.toString(),
        'MasterSponsorID': this.hasReservation.SponsorID.toString(),
        'GroupID': groupId.toString()
      })
    } catch (error) {
      console.error(error)
    }
  }
  // Our main lifecycle
  async makeReservationFor(teetime, cc) {
    if(this.hasReservation) return
    
    // Save the teetime we want
    this.hasReservation = teetime

    // Prepare message to send and get reservation information
    let res
    try {
      const resReq = prepResponseReservation(this.hasReservation, this.session)
      res = await this.api.post('/search/reservation', resReq)
    } catch (error) {
        console.error(error) // from creation or business logic
    }
    
    // Add returned matching reservations to our cart
    const added = await this.addToCart(res)
    // Get our group id
    const group = await this.getGroupId(added)
    // Link our credit card to our cart
    const link = await this.linkCard(cc, group)
    // Check for reservation conflicts
    const crosscheck = await this.crosscheck(link)
    return await this.checkout(crosscheck, group.data.GroupID)
  }
}

module.exports = { Scanner }