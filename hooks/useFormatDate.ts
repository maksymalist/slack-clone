const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0')
}
const formatDate = (date: Date) => {
  return [
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    date.getFullYear(),
  ].join('/')
}

export default formatDate
