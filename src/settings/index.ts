import { MenuThemeEnum } from '@/enums/menuEnums'
import { HeaderThemeEnum } from '@/enums/headerEnums'

export interface Setting {
  menu: {
    theme: MenuThemeEnum
  }
  header: {
    theme: HeaderThemeEnum
  }
  panel: {
    autoFold: boolean
  }
}

const setting: Setting = {
  menu: {
    theme: MenuThemeEnum.DARK,
  },
  header: {
    theme: HeaderThemeEnum.LIGHT,
  },
  panel: {
    autoFold: false,
  },
}

export default setting
