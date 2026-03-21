export type ResponseCode = {
  responseCode: number;
  responseKey: string;
  responseMessage: string;
};

export type ResponseState = {
  code: number;
  message: string;
  reference: string;
};

export type ApiResponse<T> = {
  success: boolean;
  responseCodes: ResponseCode[];
  data: {
    state: ResponseState;
  } & T;
};
