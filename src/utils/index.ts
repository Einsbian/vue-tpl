/*
 * @Description: 工具函数库
 * @Author: 毛瑞
 * @Date: 2019-06-19 16:10:48
 */

import sort from './utils/sort'
import clone from './utils/clone'
import formatNumber from './utils/formatNumber'
import formatDate, { getDateByString } from './utils/formatDate'
import {
  camelToKebab,
  camelToUpper,
  kebabToCamel,
  kebabToUpper,
  upperToCamel,
  UpperTokebab,
} from './utils/case'
import {
  getStyleByName,
  styleToObject,
  objectToStyle,
  updateStyle,
} from './utils/style'

export {
  sort,
  clone,
  formatNumber,
  formatDate,
  getDateByString,
  camelToKebab,
  camelToUpper,
  kebabToCamel,
  kebabToUpper,
  upperToCamel,
  UpperTokebab,
  getStyleByName,
  styleToObject,
  objectToStyle,
  updateStyle,
}
