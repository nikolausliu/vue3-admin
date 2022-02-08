import { ref } from 'vue'

export function useSms(validator: () => Promise<any>, requestFn: () => void) {
  type Timer = ReturnType<typeof setInterval>
  const text = ref('获取验证码')
  const disabled = ref(false)
  let countdown = 60
  let timer: Timer

  const handleClick = () => {
    validator()
      .then(start)
      .catch(() => {})
  }
  const start = () => {
    text.value = `剩余${countdown}s`
    disabled.value = true
    requestFn()
    timer = setInterval(() => {
      if (countdown < 1) {
        reset()
      } else {
        --countdown
        text.value = `剩余${countdown}s`
        disabled.value = true
      }
    }, 1000)
  }
  const reset = () => {
    clearInterval(timer)
    countdown = 60
    text.value = '获取验证码'
    disabled.value = false
  }

  return {
    text,
    disabled,
    handleClick,
  }
}
