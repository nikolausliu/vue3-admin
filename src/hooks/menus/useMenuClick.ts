import { useRouter } from 'vue-router'

export default function useMenuClick() {
  const { push } = useRouter()
  // TODO:any
  function handleMenuClick(ctx: any) {
    const { key } = ctx
    push({
      path: key,
    })
  }
  return {
    handleMenuClick,
  }
}
