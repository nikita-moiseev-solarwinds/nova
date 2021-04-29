import { $, ProtractorBrowser } from "protractor";
import { ICameraSettings, ILens, PercyLensSnapshotOptions, PERCY_DEFAULT_CONFIG } from "./types";

export class PercyLens implements ILens {
    private percySnapshot = require("@percy/protractor");
    private percyConfig: PercyLensSnapshotOptions;

    constructor(private browser: ProtractorBrowser, private settings: ICameraSettings) {
        this.percyConfig = { ...PERCY_DEFAULT_CONFIG };
    }

    public async takeSnapshot(label: string): Promise<void> {
        this.checkSettings();

        await this.percySnapshot(`${this.settings.currentTestName} - ${label}`, { ...this.percyConfig });
    }

    public async takeFullScreenSnapshot(label: string): Promise<void> {
        await this.takeSnapshot(label);
    }

    public async cameraON() {
        if (this.browser.params["snapshotsUpload"] === "manual") {
            await this.setManualFullpage();
        }
    }

    public async cameraOFF() {}

    public toolConfig() { console.warn("No config is available for Percy"); }

    private checkSettings() {
        this.percyConfig.widths = [...this.settings.responsiveWidths];
    }

    private async setManualFullpage(): Promise<void> {
        const win: number = (await this.browser.manage().window().getSize()).height;
        const body: number = (await $("body").getSize()).height;
        await this.browser.manage().window().setSize(1920, body > win ? body : win);
    }

}
