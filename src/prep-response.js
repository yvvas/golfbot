const iconList = [
    {
        'IconId': 15,
        'IconName': 'Alert',
        'SmallIcon': 'assets/images/icons/icon_alert_red.png',
        'LargeIcon': 'assets/images/icons/icon_super_alert_red.png',
        'Title': 'A valid credit card will be required to secure your reservation. Your credit card will not be charged at the time of booking. Payment will be required upon check-in.\nIf you are booking as a single, two-some or three-some you may be paired with others. You will be expected to play with those booked with you.\n\n'
    },
    {
        'IconId': 1,
        'IconName': '18 holes',
        'SmallIcon': 'assets/images/icons/icon_18.png',
        'LargeIcon': 'assets/images/icons/icon_super_9.png',
        'Title': ''
    },
    {
        'IconId': -1,
        'IconName': 'Walking',
        'SmallIcon': 'assets/images/icons/icon_walk.png',
        'LargeIcon': 'assets/images/icons/icon_super_walk.png'
    }
]
function prepResponseReservation(teetime, session) {
    return {
        'CourseID': teetime.CourseID,
        'TeeTime': teetime.TeeTime,
        'ReservationDate': teetime.ReservationDate,
        'Sponsors': [
            {
                'SponsorID': teetime.SponsorID,
                'FlatRateIcons': teetime.FlatRateIcons,
                'ReservationTypeID': teetime.FlatRateReservationTypeID,
                'FeeID': teetime.FeeID,
                'FlatRate': -1,
                'FlatRateFeeID': teetime.FlatRateFeeID,
                'ValueIconString': teetime.ValueIconString
            }
        ],
        'SessionID': session
    }
}

function prepResponseAdd(reservation, package, contactId, session, token) {
    return {
        'Reservation': {
            'CancellationPeriod': reservation.CancellationPeriod,
            'CancellationPeriodActive': reservation.CancellationPeriodActive,
            'CourseID': reservation.CourseID,
            'CourseName': reservation.CourseName,
            'CourseLocation': reservation.CourseLocation,
            'CurrencyDisplay': '$',
            'CurrencyLocaleID': reservation.CurrencyLocaleID,
            'FeeID': reservation.FeeID,
            'FinishRotationName': reservation.FinishRotationName,
            'FlatRate': reservation.FlatRate,
            'FlatRateFeeID': reservation.FlatRateFeeID,
            'FlatRateIcons': reservation.FlatRateIcons,
            'FlatRateIconsList': reservation.FlatRateIconsList,
            'FlatRateReservationTypeID': reservation.FlatRateReservationTypeID,
            'IconsList': iconList,
            'IsBookable': reservation.IsBookable,
            'NumberOfPriceWindows': reservation.FlatRateFeeID,
            'OriginalPlayersAvailable': reservation.OriginalPlayersAvailable,
            'PlayerDisplayText': reservation.PlayerDisplayText,
            'PlayersAvailable': reservation.PlayersAvailable,
            'PostCurrencyDisplay': reservation.PostCurrencyDisplay,
            'Price': reservation.Price,
            'PriceMax': reservation.PriceMax,
            'PriceMin': reservation.PriceMin,
            'PriceWindowIDs': reservation.PriceWindowIDs,
            'PriceWindowPrices': reservation.PriceWindowPrices,
            'Rackrate': reservation.Rackrate,
            'RateIcons': reservation.RateIcons,
            'RateIconsList': reservation.RateIconsList,
            'RecNo': reservation.RecNo,
            'RegularPrice': reservation.RegularPrice,
            'ReservationDate': reservation.ReservationDate,
            'ReservationTypeID': reservation.ReservationTypeID,
            'SavingsDisplay': reservation.SavingsDisplay,
            'SKURegular': reservation.SKURegular,
            'SKUs': reservation.SKUs,
            'SKUSpecial': reservation.SKUSpecial,
            'SponsorID': reservation.SponsorID,
            'SponsorIds': reservation.SponsorIds,
            'StartRotationName': reservation.StartRotationName,
            'TeeDateDisplay': reservation.TeeDateDisplay,
            'TeeTime': reservation.TeeTime,
            'TeeTimeDisplay': reservation.TeeTimeDisplay,
            'TotalRecords': reservation.TotalRecords,
            'TurnCourseID': reservation.TurnCourseID,
            'Utilization': reservation.Utilization,
            'ValueIconString': reservation.ValueIconString,
        },
        'NumberOfPlayers': reservation.PlayersAvailable.toString(), // '4'
        'Package': {
            // Not in the package return
            'AvailablePlayers': [1,2,3,4],
            'CancellationPeriod': reservation.CancellationPeriod,
            'CurrencyDisplay': '$',
            'Discount': reservation.SavingsDisplay,

            'DisplayOrder': package.DisplayOrder,
            'FeeID': package.FeeID,
            'HoleText': package.HoleText,
            'Icons': package.Icons,
            // Not in the package return
            'IconsList': reservation.IconsList,
            
            'IconValue': package.IconValue, 
            'IsPrePaymentRequired': package.IsPrePaymentRequired,
            'PackageDescription': package.PackageDescription,
            'PackageName': package.PackageName,
            'PostCurrencyDisplay': reservation.PostCurrencyDisplay,
            // Not in the package return
            'Price': reservation.Price,
            'TeeTimeMessage': package.TeeTimeMessage,
            'ReservationFee': package.ReservationFee,
            'ReservationFeeMessage': package.ReservationFeeMessage,
            // Not in the package return
            'SelectedPlayerCount': reservation.PlayersAvailable,
            'SponsorID': package.SponsorID
        },
        'IsResetPassword': false,
        'ContactID': contactId.toString(),
        'IsiOS': false,
        'SessionID': session,
        'MasterSponsorID': package.SponsorID.toString(),
        'CsrfToken': token
    }
}

module.exports = { prepResponseReservation, prepResponseAdd }

