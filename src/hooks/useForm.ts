import { Ref, unref } from 'vue'

export function useForm() {
  function validate(formRef: Ref<any>): Promise<boolean> {
    const form = unref(formRef)
    // TODO:any
    return new Promise<boolean>((resolve) => {
      form
        .validate()
        .then(() => {})
        .catch((err: any) => {
          if ((err.errorFields as Array<any>).length) {
            resolve(false)
          } else {
            resolve(true)
          }
        })
    })
  }
  function clearValidate(formRef: Ref<any>) {
    const form = unref(formRef)
    form.clearValidate()
  }

  return {
    validate,
    clearValidate,
  }
}
