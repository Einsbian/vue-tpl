/*
 * @Description: 格式化数字
 * @Author: 毛瑞
 * @Date: 2019-06-27 13:05:04
 */

/** 单位设置
 */
interface INumberUnit {
  /** 位数，比如千=3 万=4
   */
  len: number
  /** 末尾单位文字
   */
  unit?: string
  /** 位数超过该值才处理单位,比如:len=4,limit=5,unit=万 时:12345 => 12345;123456 => 12.3456万
   */
  limit?: number
}

/** 匹配后面有三个数字的数字
 */
const REG_NUMBER: RegExp = /(\d)(?=(\d{3})+$)/g

/** 格式化数字 每三位数字增加个逗号 （小数点后的除外）
 * @test true
 *
 * @param {Number|String} num
 * @param {Number} digit Number:保留小数位数
 * @param {String|INumberUnit} unit String 单位 默认按万计算
 *
 * @returns {String} 格式化后的数字
 */
function formatNumber(
  num: string | number,
  digit?: any,
  unit?: string | INumberUnit
): string {
  !unit && typeof digit !== 'number' && (unit = digit)

  const numSplit: string[] = String(num || 0).split('.')
  let decimal: string = numSplit[1] || '' // 小数部分
  num = numSplit[0] // 整数部分

  // 处理单位
  if (typeof unit === 'object') {
    const len: number = num.length
    const limit: number = unit.limit || unit.len

    if (limit && len > limit) {
      const index: number = len - unit.len
      decimal = num.slice(index) + decimal
      num = num.slice(0, index)
      unit = unit.unit
    } else {
      unit = ''
    }
  }

  // 小数四舍五入
  if (decimal) {
    if (isNaN(digit)) {
      decimal = '.' + decimal
    } else {
      decimal = parseFloat('0.' + decimal).toFixed(Math.abs(digit))
      if (parseFloat(decimal) >= 1) {
        num = String(parseInt(num) + 1)
        decimal = ''
      } else {
        decimal = decimal.replace('0.', '.')
      }
    }
  }

  // 每三位加逗号
  return num.replace(REG_NUMBER, '$1,') + decimal + (unit || '')
}

export default formatNumber
