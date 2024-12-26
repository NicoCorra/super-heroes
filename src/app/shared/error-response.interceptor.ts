import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const ErroResponseInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError(handleErrorResponse));

function handleErrorResponse(error: HttpErrorResponse) {
  console.error("Mi error: " + error);
  return throwError(() => error);
}

