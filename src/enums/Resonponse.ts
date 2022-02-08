export enum ResponseCode {
  Success = '0',
  Fail = '-1',
  InvalidToken = '401',
}

export interface ResponseData {
  code: ResponseCode
  data: any
  msg: string
}
