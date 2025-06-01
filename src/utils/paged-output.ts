import { map, Observable } from 'rxjs';

export interface PagedOutputSet<T> {
    data: T[];
    totalRecords: number;
}

export const extractRecords = () => {
    return <TData>(obs: Observable<PagedOutputSet<TData>>): Observable<TData[]> => {
        return obs.pipe(map(data => data.data));
    };
};

export const extractTotalRecords = () => {
    return <TData>(obs: Observable<PagedOutputSet<TData>>): Observable<number> => {
        return obs.pipe(map(data => data.totalRecords));
    };
};

export const isPaginationAvailable = (size: number = 5) => {
    return (obs: Observable<number>): Observable<boolean> => {
        return obs.pipe(map(count => count > size));
    };
};
