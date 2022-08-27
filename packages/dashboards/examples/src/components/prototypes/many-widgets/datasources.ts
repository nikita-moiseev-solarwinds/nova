import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";

import {
    DataSourceService,
    IDataSource,
    IFilteringOutputs,
} from "@nova-ui/bits";
import { IKpiData } from "@nova-ui/dashboards";

@Injectable()
export class AcmeKpiDataSource
    extends DataSourceService<IKpiData>
    implements IDataSource, OnDestroy
{
    public static providerId = "AcmeKpiDataSource";
    public static mockError = false;

    public busy = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        super();
    }

    public async getFilteredData(): Promise<IFilteringOutputs> {
        this.busy.next(true);
        const randomId = Math.floor(Math.random() * Math.floor(99)) + 1;
        return new Promise((resolve) => {
            this.http
                .get(`https://jsonplaceholder.typicode.com/todos/${randomId}`)
                .pipe(finalize(() => this.busy.next(false)))
                .subscribe({
                    next: (data: any) => {
                        resolve({
                            result: {
                                value: data.id,
                                label: data.title,
                            },
                        });
                    },
                    error: (error: HttpErrorResponse) => {
                        resolve({
                            result: null,
                            error: {
                                type: error.status,
                            },
                        });
                    },
                });
        });
    }

    public ngOnDestroy(): void {
        this.outputsSubject.complete();
    }
}
