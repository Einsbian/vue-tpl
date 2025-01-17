/*
 * @Description: 和dom结构相关的工具 测试
 * @Author: 毛瑞
 * @Date: 2019-07-04 15:23:29
 */
import { getInfoByHtml, escapeHTML } from '@/utils/utils/dom'

const HTML: string = `
<article class="post-content toc-container">
  <h4 class="post-title">标题</h4>
  <img src="https://image.com/a.png?w=1&h=1">
  <script type="TypeScript">
  // do someThing
  </script>
</article>
`

test('escapeHTML', () => {
  expect(escapeHTML(HTML)).toBe(
    `<article class="post-content toc-container">
  <h4 class="post-title">标题</h4>
  <img src="https://image.com/a.png?w=1&h=1">
  &lt;script type="TypeScript"&gt;
  // do someThing
  &lt;/script&gt;
</article>`
  )
})

test('getInfoByHtml', () => {
  expect(getInfoByHtml(HTML).get('script', 'type', 'TypeScript')).toEqual({
    tagName: 'script',
    type: 'TypeScript',
  })
})
