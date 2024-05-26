type ErrorResponse = { msg: string; error: any } | null;

export default class ResponseRequest {
  public status: number;
  public error: ErrorResponse | null;
  public data: any;

  constructor({
    status = 200,
    error = null,
    data = null,
  }: {
    status: number;
    error: ErrorResponse | null;
    data: any;
  }) {
    this.status = status;
    this.error = error;
    this.data = data;
  }
}
