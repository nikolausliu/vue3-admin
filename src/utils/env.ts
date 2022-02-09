export const isProd = (): boolean => {
  return import.meta.env.MODE !== 'development'
}
