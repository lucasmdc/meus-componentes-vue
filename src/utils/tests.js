export function testValueIs (value, type) {
  const result = Object.prototype.toString.call(value).toLowerCase()

  return result.substring(1, result.length - 1).split(' ')[1] === type
}
