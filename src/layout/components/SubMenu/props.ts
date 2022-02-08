import { PropType } from 'vue'
import { MenuRaw } from '@/router/menus'

export const props = {
  menuRaw: {
    type: Object as PropType<MenuRaw>,
  },
}
