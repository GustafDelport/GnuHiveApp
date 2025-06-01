import { HttpErrorResponse, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { catchError, filter, map, Observable, of, OperatorFunction, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { ProblemDetailsModel } from 'src/models/common/problem-details.model';

export enum ApiRequestStatus {
    loading = 'ApiRequestStatus.loading',
    success = 'ApiRequestStatus.success',
    error = 'ApiRequestStatus.error',
    notStarted = 'ApiRequestStatus.notStarted'
}

export interface NotStartedApiRequest {
    status: ApiRequestStatus.notStarted;
}

export interface LoadingApiRequest {
    status: ApiRequestStatus.loading;
}

export interface SuccessApiRequest<TData = unknown> {
    status: ApiRequestStatus.success;
    data: TData;
}

export interface ErrorApiRequest<TError = unknown> {
    status: ApiRequestStatus.error;
    error: TError;
}

export type ApiRequest<TData = unknown, TError = unknown> =
    | NotStartedApiRequest //
    | LoadingApiRequest
    | SuccessApiRequest<TData>
    | ErrorApiRequest<TError>;

export const buildNotStartedApiRequest = (): NotStartedApiRequest => ({ status: ApiRequestStatus.notStarted });

export const buildLoadingApiRequest = (): LoadingApiRequest => ({ status: ApiRequestStatus.loading });

export const buildSuccessApiRequest = <TData>(data: TData): SuccessApiRequest<TData> => ({
    status: ApiRequestStatus.success,
    data
});

export const buildErrorApiRequest = <TError>(error: TError = undefined): ErrorApiRequest<TError> => ({
    status: ApiRequestStatus.error,
    error
});

//#region type-checks
export const isNotStarted = (req: ApiRequest): req is NotStartedApiRequest => req.status === ApiRequestStatus.notStarted;
export const isLoading = (req: ApiRequest): req is LoadingApiRequest => req.status === ApiRequestStatus.loading;
export const isSuccess = <TData>(req: ApiRequest<TData>): req is SuccessApiRequest<TData> => req.status === ApiRequestStatus.success;
export const isError = <TError>(req: ApiRequest<any, TError>): req is ErrorApiRequest<TError> => req.status === ApiRequestStatus.error;
export const isHttpError = (req: ApiRequest<any, unknown>): req is ErrorApiRequest<HttpErrorResponse> => req.status === ApiRequestStatus.error && req.error instanceof HttpErrorResponse;
export const isHttpErrorNotFound = (httpError: HttpErrorResponse) => httpError.status === 404;
//#endregion

//#region mutation
export const transformApiRequestData = <TData, TResult>(request: ApiRequest<TData>, mapper: (data: TData) => TResult): ApiRequest<TResult> =>
    isSuccess(request) ? buildSuccessApiRequest(mapper(request.data)) : request;
//#endregion

//#region filter operators
export const filterLoading = () => filter((req: ApiRequest<unknown> | undefined | null): req is LoadingApiRequest => req.status === ApiRequestStatus.loading);
export const filterSuccess = <TData, TError>(): OperatorFunction<ApiRequest<TData, TError>, SuccessApiRequest<TData>> =>
    filter((req: ApiRequest<TData, TError> | undefined | null): req is SuccessApiRequest<TData> => req?.status === ApiRequestStatus.success);
export const filterError = () => filter(<TData, TError>(req: ApiRequest<TData, TError>): req is ErrorApiRequest<TError> => req.status === ApiRequestStatus.error);

//#region mapping operators
const filterTrue = () => filter((x): x is true => !!x);
export const mapToIsLoading = () => map(isLoading);
export const mapToIsSuccess = () => map(isSuccess);
export const mapToIsError = () => map(isError);
export const mapToIsNotStarted = () => map(isNotStarted);
export const mapToData = () => map(<TData>(req: SuccessApiRequest<TData>) => req.data);
export const mapToStatus = () => map((req: ApiRequest) => req.status);
export const mapToSuccess = () => map(buildSuccessApiRequest);
export const mapSuccessData = <TData = unknown, TError = unknown, TNewData = unknown>(callback: (data: TData) => TNewData) =>
    map((req: ApiRequest<TData, TError>): ApiRequest<TNewData, TError> => (isSuccess(req) ? buildSuccessApiRequest(callback(req.data)) : req));
export const mapToIsCompleted = () => map((req: ApiRequest) => isError(req) || isSuccess(req));
export const mapToIsHttpErrorNotFound = () => map(<TData, TError>(req: ApiRequest<TData, TError>): boolean => isHttpError(req) && isHttpErrorNotFound(req.error));
export const mapToErrorApi = <T>() => map((errorReq: ErrorApiRequest<T>) => errorReq);
//#endregion

//#region start-with operators
export const startWithLoading = <TData, TError = unknown>() => startWith<ApiRequest<TData, TError>>({ status: ApiRequestStatus.loading as const });
export const startWithNotStarted = <TData, TError = unknown>() => startWith<ApiRequest<TData, TError>>({ status: ApiRequestStatus.notStarted as const });
//#endregion

//#region misc operators
export const extractHttpProblemDetailsMessage = () => {
    return <TData>(obs: Observable<ApiRequest<TData, HttpErrorResponse>>): Observable<string> => {
        return obs.pipe(
            filterError(),
            map((errorReq: ErrorApiRequest<HttpErrorResponse>) => {
                if ((<ProblemDetailsModel>errorReq?.error?.error)?.status === 403) {
                    return 'You are not allowed to perform this action.';
                }
                if ((<ProblemDetailsModel>errorReq?.error?.error)?.status > 0) {
                    return (<ProblemDetailsModel>errorReq.error.error).detail ?? (<ProblemDetailsModel>errorReq.error.error).title;
                }

                return 'A generic error occurred';
            })
        );
    };
};

export const extractSuccessData = () => {
    return <TData, TError>(obs: Observable<ApiRequest<TData, TError>>): Observable<TData> => {
        return obs.pipe(filterSuccess(), mapToData());
    };
};

export const catchApiError = <TData, TError>() => {
    return catchError<TData, Observable<ErrorApiRequest<TError>>>((error: TError) => {
        return of(buildErrorApiRequest(error));
    });
};

export const takeUntilRequestCompletes = <TData, TError>() => {
    return takeWhile<ApiRequest<TData, TError>>(
        (req: ApiRequest<TData, TError>) => isLoading(req) || isNotStarted(req), //
        true
    );
};

export const transformToApiRequest = <TData, TError = unknown>() => {
    return (obs: Observable<TData>): Observable<ApiRequest<TData, TError>> => {
        return obs.pipe(
            map((data): ApiRequest<TData, TError> => ({ status: ApiRequestStatus.success, data })), // Look at checking for the http event
            startWith<ApiRequest<TData, TError>>({ status: ApiRequestStatus.loading }),
            catchError((error: TError): Observable<ApiRequest<TData, TError>> => of({ status: ApiRequestStatus.error, error }))
        );
    };
};
//#endregion

//#region tapping operators
type TapSuccessCallback<TData> = (req: SuccessApiRequest<TData>) => void;
export const tapSuccess = <TData, TError>(callback: TapSuccessCallback<TData>) => {
    return tap((req: ApiRequest<TData, TError>) => {
        if (isSuccess(req)) {
            callback(req);
        }
    });
};

type TapFailureCallback<TError> = (req: ErrorApiRequest<TError>) => void;
export const tapError = <TData, TError>(callback: TapFailureCallback<TError>) => {
    return tap((req: ApiRequest<TData, TError>) => {
        if (isError(req)) {
            callback(req);
        }
    });
};

type TapCompleteCallback<TData, TError> = (req: SuccessApiRequest<TData> | ErrorApiRequest<TError>) => void;
export const tapCompleted = <TData, TError>(callback: TapCompleteCallback<TData, TError>) => {
    return tap((req: ApiRequest<TData, TError>) => {
        if (isSuccess(req) || isError(req)) {
            callback(req);
        }
    });
};

type TapLoadingCallback = (req: LoadingApiRequest) => void;
export const tapLoading = <TData, TError>(callback: TapLoadingCallback) => {
    return tap((req: ApiRequest<TData, TError>) => {
        if (isLoading(req)) {
            callback(req);
        }
    });
};

export const successOf = <TData>(data: TData): SuccessApiRequest<TData> => ({ status: ApiRequestStatus.success, data });
