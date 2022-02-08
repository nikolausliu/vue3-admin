import { useTimeoutFn, useDebounceFn } from '@vueuse/core'

import { unref, Ref, nextTick, onUnmounted } from 'vue'
import type { EChartOption, ECharts } from 'echarts'
import echarts from 'echarts'

export type { EChartOption, ECharts }
export function useECharts(
  elRef: Ref<HTMLDivElement>,
  theme: 'light' | 'dark' | 'default' = 'light'
) {
  let chartInstance: ECharts = null as unknown as ECharts
  const debouncedResize = useDebounceFn(resize, 200)

  function init() {
    nextTick(() => {
      useTimeoutFn(() => {
        const el = unref(elRef)
        if (!el || !unref(el)) {
          return
        }
        chartInstance = echarts.init(el, theme)
        window.addEventListener('resize', debouncedResize)
      }, 30)
    })
  }

  function setOptions(options: EChartOption, clear = true) {
    if (!chartInstance) return
    clear && chartInstance.clear()
    chartInstance && chartInstance.setOption(options)
  }

  // https://echarts.apache.org/zh/api.html#echartsInstance.showLoading
  interface ShowLoadingOpts {
    text?: string
    color?: string
    textColor?: string
    maskColor?: string
    zlevel?: number
    fontSize?: number
    showSpinner?: boolean
    spinnerRadius?: number
    lineWidth?: number
  }
  const defaultShowLoadingOpts: ShowLoadingOpts = {
    text: 'loading...',
    color: '#1890ff',
    textColor: '#1890ff',
    maskColor: 'rgba(255, 255, 255, 0.8)',
    zlevel: 0,
    fontSize: 16,
    showSpinner: true,
    spinnerRadius: 14,
    lineWidth: 2,
  }
  function showLoading(opts: ShowLoadingOpts = defaultShowLoadingOpts) {
    if (!chartInstance) return
    chartInstance.showLoading('default', opts)
  }

  function hideLoading() {
    if (!chartInstance) return
    chartInstance.hideLoading()
  }

  function resize() {
    if (!chartInstance) return
    chartInstance.resize()
  }

  onUnmounted(() => {
    console.log('onUnmounted')
    if (!chartInstance) return
    window.removeEventListener('resize', debouncedResize)
    chartInstance.dispose()
    chartInstance = null as unknown as ECharts
  })

  return {
    init,
    setOptions,
    resize,
    showLoading,
    hideLoading,
  }
}
