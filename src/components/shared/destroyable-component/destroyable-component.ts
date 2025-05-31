import { Injectable, OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Observable, Subject, map, shareReplay, startWith, takeUntil } from 'rxjs';

@Injectable()
export class DestroyableComponent implements OnDestroy {
    protected readonly _destroyed$ = new Subject<void>();
    protected readonly _isDestroyed$ = this._destroyed$.pipe(
        map(() => true),
        startWith(false)
    );

    public ngOnDestroy(): void {
        this._destroyed$.next();
        this._destroyed$.complete();
    }

    /**
     * Returns a takeUntil operator based the _destroyed$ observable
     * @protected
     */
    protected untilDestroyed<TData>() {
        return takeUntil<TData>(this._destroyed$);
    }

    protected replayUntilDestroyed<TData>(): MonoTypeOperatorFunction<TData> {
        return (obs: Observable<TData>): Observable<TData> => {
            return obs.pipe(shareReplay(1), takeUntil(this._destroyed$));
        };
    }

    protected sideEffect<TData>(obs: Observable<TData>, callback: (data: TData) => void) {
        return obs.pipe(this.untilDestroyed()).subscribe(callback);
    }
}
