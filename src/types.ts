export interface BreadOrCakeRequest {
  ingredients: string;
}

export interface BreadOrCakeResponse {
  result: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
