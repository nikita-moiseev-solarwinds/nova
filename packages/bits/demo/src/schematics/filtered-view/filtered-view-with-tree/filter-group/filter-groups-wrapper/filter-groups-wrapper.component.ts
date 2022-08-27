import {
    AfterViewInit,
    Component,
    ContentChildren,
    Inject,
    QueryList,
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";

import { DataSourceService, IFilteringParticipants } from "@nova-ui/bits";

import { FilterGroupComponent } from "../filter-group.component";

@Component({
    selector: "app-filter-groups-wrapper",
    templateUrl: "filter-groups-wrapper.component.html",
    styleUrls: ["filter-groups-wrapper.component.less"],
})
export class FilterGroupsWrapperComponent implements AfterViewInit {
    @ContentChildren(FilterGroupComponent)
    filterGroups: QueryList<FilterGroupComponent>;

    public i18nHiddenFiltersMapping: { [k: string]: string } = {
        "=1": $localize`1 hidden filter.`,
        other: $localize`# hidden filters.`,
    };

    constructor(
        @Inject(DataSourceService)
        private dataSourceService: DataSourceService<any>
    ) {}

    ngAfterViewInit() {
        this.dataSourceService.registerComponent(this.getFilterComponents());
        this.filterGroups.changes.subscribe(() => {
            this.dataSourceService.registerComponent(
                this.getFilterComponents()
            );
        });
    }

    public emptyFilterGroupsTitles(): string {
        return this.filterGroups
            .filter((filterGroup) =>
                _isEmpty(filterGroup.filterGroupItem.allFilterOptions)
            )
            .map((filterGroup) => filterGroup.filterGroupItem.title)
            .join(", ");
    }

    public emptyFilterGroupsExist(): boolean {
        return this.emptyFilterGroupsCount() > 0;
    }

    public emptyFilterGroupsCount(): number {
        return this.filterGroups.filter((filterGroup) =>
            _isEmpty(filterGroup.filterGroupItem.allFilterOptions)
        ).length;
    }

    private getFilterComponents(): IFilteringParticipants {
        return this.filterGroups.reduce(
            (obj: IFilteringParticipants, item: FilterGroupComponent) => {
                obj[item.filterGroupItem.id] = { componentInstance: item };
                return obj;
            },
            {}
        );
    }
}
