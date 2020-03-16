function displayStringMonth(value, lang, type) {
    switch (lang) {
        case 'th':
            switch (type) {
                case 'short':
                    switch (value) {
                        case '01':
                            return "ม.ค."
            
                        case '02':
                            return "ก.พ."
            
                        case '03':
                            return "มี.ค."
            
                        case '04':
                            return "เม.ย."
            
                        case '05':
                            return "พ.ค."
            
                        case '06':
                            return "มิ.ย."
            
                        case '07':
                            return "ก.ค."
            
                        case '08':
                            return "ส.ค."
            
                        case '09':
                            return "ก.ย."
            
                        case '10':
                            return "ต.ค."
            
                        case '11':
                            return "พ.ย."
            
                        case '12':
                            return "ธ.ค."
            
                        default:
                            break
                    }
                    break
    
                case 'long':
                    switch (value) {
                        case '01':
                            return "มกราคม"
            
                        case '02':
                            return "กุมภาพันธ์"
            
                        case '03':
                            return "มีนาคม"
            
                        case '04':
                            return "เมษายน"
            
                        case '05':
                            return "พฤษภาคม"
            
                        case '06':
                            return "มิถุนายน"
            
                        case '07':
                            return "กรกฎาคม"
            
                        case '08':
                            return "สิงหาคม"
            
                        case '09':
                            return "กันยายน"
            
                        case '10':
                            return "ตุลาคม"
            
                        case '11':
                            return "พฤศจิกายน"
            
                        case '12':
                            return "ธันวาคม"
            
                        default:
                            break
                    }
                    break
            
                default:
                    break
            }
            break

        case 'en':
            switch (type) {
                case 'short':
                    switch (value) {
                        case '01':
                            return "Jan"
            
                        case '02':
                            return "Feb"
            
                        case '03':
                            return "Mar"
            
                        case '04':
                            return "Apr"
            
                        case '05':
                            return "May"
            
                        case '06':
                            return "Jun"
            
                        case '07':
                            return "Jul"
            
                        case '08':
                            return "Aug"
            
                        case '09':
                            return "Sep"
            
                        case '10':
                            return "Oct"
            
                        case '11':
                            return "Nov"
            
                        case '12':
                            return "Dec"
            
                        default:
                            break
                    }
                    break
    
                case 'long':
                    switch (value) {
                        case '01':
                            return "January"
            
                        case '02':
                            return "February"
            
                        case '03':
                            return "March"
            
                        case '04':
                            return "April"
            
                        case '05':
                            return "May"
            
                        case '06':
                            return "June"
            
                        case '07':
                            return "July"
            
                        case '08':
                            return "August"
            
                        case '09':
                            return "September"
            
                        case '10':
                            return "October"
            
                        case '11':
                            return "November"
            
                        case '12':
                            return "December"
            
                        default:
                            break
                    }
                    break
            
                default:
                    break
            }
            break
    
        default:
            break
    }
}

export default displayStringMonth