import { defaultColor } from './color'

type PieSeriesItem = {
  name: string
  value: number
}

type PieOpts = {
  seriesName?: string
  seriesCenter?: (string | number)[]
  seriesRadius?: (string | number)[]
  legendOrient?: 'horizontal' | 'vertical'
  legendPosition?: {
    top?: string | number
    right?: string | number
    bottom?: string | number
    left?: string | number
  }
}

export function parsePieOptions(
  seriesData: PieSeriesItem[],
  {
    seriesName = '',
    seriesCenter = ['50%', '50%'],
    seriesRadius = [0, '75%'],
    legendOrient = 'horizontal',
    legendPosition = {
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
    },
  }: PieOpts,
  unit: string
) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}' + unit + ' ({d}%)',
    },
    legend: {
      orient: legendOrient,
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle',
      data: seriesData.map((item) => item.name),
      formatter: function (name: any) {
        const index = seriesData.findIndex((item) => item.name === name)
        const value = seriesData[index].value
        return `${name}  ${value}`
      },
      ...legendPosition,
    },
    series: [
      {
        name: seriesName,
        type: 'pie',
        // roseType: 'radius',
        center: seriesCenter,
        radius: seriesRadius,
        label: {
          show: false,
          position: 'center',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
          },
        },
        labelLine: {
          show: false,
        },
        color: defaultColor,
        data: seriesData,
      },
    ],
  }
}
