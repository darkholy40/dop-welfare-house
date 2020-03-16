import displayStringMonth from './displayStringMonth'

function displayDateFotmat(date, lang, type) {
  const res = date.split("T");
  const dateOnly = res[0]
  const splittedDate = dateOnly.split("-")
  const day = parseInt(splittedDate[2])
  const month = splittedDate[1]
  let year = lang === 'th' ? parseInt(splittedDate[0]) + 543 : splittedDate[0]
  
  return `${day} ${displayStringMonth(month, lang, type)} ${year}`
}

export default displayDateFotmat