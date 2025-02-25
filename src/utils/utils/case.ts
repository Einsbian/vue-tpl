/*
 * @Description: 词语风格转换
 * @Author: 毛瑞
 * @Date: 2019-07-04 11:26:26
 */

/** 匹配大写字母
 */
const REG_UPPER = /([A-Z])/g
const REPLACE_C2K = (match: string): string => '-' + match.toLowerCase()
/** camelCase 转 kebab-case，如: camelCase -> camel-case
 * @test true
 *
 * @param {String} str
 *
 * @returns {String}
 */
function camelToKebab(str: string): string {
  return str.replace(REG_UPPER, REPLACE_C2K)
}

/** 返回大写的第二个匹配字符
 */
const REPLACE_2U = (match: string): string => match[1].toUpperCase()
/** 匹配短横小写字母
 */
const REG_KEBAB = /-([a-z])/g

/** kebab-case 转 camelCase 如: kebab-case -> kebabCase
 * @test true
 *
 * @param {String} str
 *
 * @returns {String}
 */
function kebabToCamel(str: string): string {
  return str.replace(REG_KEBAB, REPLACE_2U)
}

/** camelCase 转 UPPER_CASE, 如: camelCase -> CAMEL_CASE
 * @test true
 *
 * @param {String} str
 *
 * @returns {String}
 */
function camelToUpper(str: string): string {
  return str.replace(REG_UPPER, '_$1').toUpperCase()
}

const REG_LOWER = /_([a-z])/g
/** UPPER_CASE 转 camelCase, 如: UPPER_CASE -> upperCase
 * @test true
 *
 * @param {String} str
 *
 * @returns {String}
 */
function upperToCamel(str: string): string {
  return str.toLowerCase().replace(REG_LOWER, REPLACE_2U)
}

/** kebab-case 转 UPPER_CASE, 如: kebab-case -> KEBAB_CASE
 * @test true
 *
 * @param {String} str
 *
 * @returns {String}
 */
function kebabToUpper(str: string): string {
  return str.replace(REG_KEBAB, '_$1').toUpperCase()
}

/** UPPER_CASE 转 kebab-case, 如: UPPER_CASE -> upper-case
 * @test true
 *
 * @param {String} str
 *
 * @returns {String}
 */
function UpperTokebab(str: string): string {
  return str.toLowerCase().replace(REG_LOWER, '-$1')
}

export {
  camelToKebab,
  camelToUpper,
  kebabToCamel,
  kebabToUpper,
  upperToCamel,
  UpperTokebab,
}
