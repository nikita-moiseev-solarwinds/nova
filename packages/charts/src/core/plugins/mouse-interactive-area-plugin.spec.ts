import { select } from "d3-selection";
import { Subscription } from "rxjs";

import {
    INTERACTION_VALUES_ACTIVE_EVENT,
    INTERACTION_VALUES_EVENT,
} from "../../constants";
import { LineAccessors } from "../../renderers/line/line-accessors";
import { LineRenderer } from "../../renderers/line/line-renderer";
import { Chart } from "../chart";
import { MouseInteractiveArea } from "../common/mouse-interactive-area";
import { LinearScale } from "../common/scales/linear-scale";
import { IChartEvent, InteractionType } from "../common/types";
import { XYGrid } from "../grid/xy-grid";
import { MouseInteractiveAreaPlugin } from "./mouse-interactive-area-plugin";

describe("MouseInteractiveAreaPlugin >", () => {
    let plugin: MouseInteractiveAreaPlugin;
    let mouseInteractiveArea: MouseInteractiveArea;
    let xScale: LinearScale;
    let yScale: LinearScale;

    beforeEach(() => {
        const target = select(document.createElement("div"))
            .append("svg")
            .append("g");
        const interactiveArea = select(document.createElement("div"))
            .append("svg")
            .append("g")
            .append("rect");
        mouseInteractiveArea = new MouseInteractiveArea(
            // @ts-ignore: Disabled for testing purposes
            target,
            interactiveArea,
            "crosshair"
        );
        plugin = new MouseInteractiveAreaPlugin(mouseInteractiveArea);
        plugin.chart = new Chart(new XYGrid());
        // @ts-ignore: Disabled for testing purposes
        plugin.chart.build(null);
        plugin.initialize();
        xScale = new LinearScale();
        yScale = new LinearScale();
        const renderer = new LineRenderer();

        const seriesSet = [
            {
                id: "series1",
                name: "Series 1",
                data: [
                    {
                        x: 0,
                        y: 0,
                    },
                ],
                renderer,
                accessors: new LineAccessors(),
                scales: {
                    x: xScale,
                    y: yScale,
                },
            },
        ];

        plugin.chart.update(seriesSet);
    });

    describe("mouseInteractionSubscription observer >", () => {
        let eventPayload: IChartEvent | undefined;
        let subscription: Subscription;

        beforeEach(() => {
            eventPayload = undefined;
            subscription = plugin.chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_EVENT)
                .subscribe((event: IChartEvent) => {
                    eventPayload = event;
                });
        });

        afterEach(() => {
            subscription.unsubscribe();
        });

        it("should emit an INTERACTION_VALUES_EVENT", () => {
            mouseInteractiveArea.interaction.next({
                type: InteractionType.MouseMove,
                coordinates: { x: 0, y: 0 },
            });
            expect(eventPayload).toBeDefined();
        });

        it("should not emit an INTERACTION_VALUES_EVENT if the grid's scales are empty", () => {
            plugin.chart.getGrid().scales = {};
            mouseInteractiveArea.interaction.next({
                type: InteractionType.MouseMove,
                coordinates: { x: 0, y: 0 },
            });
            expect(eventPayload).not.toBeDefined();
        });

        it("should not emit an INTERACTION_VALUES_EVENT if interaction values events are inactive", () => {
            plugin.chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_ACTIVE_EVENT)
                .next({ data: false });
            mouseInteractiveArea.interaction.next({
                type: InteractionType.MouseMove,
                coordinates: { x: 0, y: 0 },
            });
            expect(eventPayload).not.toBeDefined();
        });

        it("should resume emitting an INTERACTION_VALUES_EVENT if interaction values events are active", () => {
            plugin.chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_ACTIVE_EVENT)
                .next({ data: false });
            plugin.chart
                .getEventBus()
                .getStream(INTERACTION_VALUES_ACTIVE_EVENT)
                .next({ data: true });
            mouseInteractiveArea.interaction.next({
                type: InteractionType.MouseMove,
                coordinates: { x: 0, y: 0 },
            });
            expect(eventPayload).toBeDefined();
        });

        it("should omit the x value from the INTERACTION_VALUES_EVENT if the x scale inversion returns undefined", () => {
            // @ts-ignore: Disabled for testing purposes
            spyOn(xScale, "invert").and.returnValue(undefined);
            mouseInteractiveArea.interaction.next({
                type: InteractionType.MouseMove,
                coordinates: { x: 0, y: 0 },
            });
            expect(eventPayload?.data.values.x).not.toBeDefined();
            expect(eventPayload?.data.values.y).toBeDefined();
        });

        it("should omit the y value from the INTERACTION_VALUES_EVENT if the y scale inversion returns undefined", () => {
            // @ts-ignore: Disabled for testing purposes
            spyOn(yScale, "invert").and.returnValue(undefined);
            mouseInteractiveArea.interaction.next({
                type: InteractionType.MouseMove,
                coordinates: { x: 0, y: 0 },
            });
            expect(eventPayload?.data.values.y).not.toBeDefined();
            expect(eventPayload?.data.values.x).toBeDefined();
        });
    });
});
