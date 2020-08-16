function getRamdom(max, min) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.splice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRamdom(0, 1)
    let t = arr[i]
    _arr[j] = arr[i]
    _arr[i] = t
  }
  return _arr
}