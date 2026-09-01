function addRowLockOnFlights(flightId){
    return `SELECT * from flights WHERE Flights.id=${flightId} FOR UPDATE;`
}

module.exports={
    addRowLockOnFlights
}