export const ANGULAR_JSON = `{
    "version": 1,
    "newProjectRoot": "projects",
    "projects": {
        "demo": {
            "root": "",
            "sourceRoot": "src",
            "projectType": "application",
            "prefix": "app",
            "schematics": {},
            "architect": {
                "build": {
                    "builder": "@angular-devkit/build-angular:browser",
                    "options": {
                        "outputPath": "dist/demo",
                        "index": "src/index.html",
                        "main": "src/main.ts",
                        "polyfills": "src/polyfills.ts",
                        "tsConfig": "tsconfig.json",
                        "assets": [],
                        "styles": [
                            "src/styles.less",
                            "./node_modules/@nova-ui/bits/bundles/css/styles.css",
                            "./node_modules/@nova-ui/charts/bundles/css/styles.css"
                        ],
                        "scripts": []
                    },
                    "configurations": {
                        "production": {
                            "fileReplacements": [
                                {}
                            ],
                            "optimization": true,
                            "outputHashing": "all",
                            "sourceMap": false,
                            "extractCss": true,
                            "namedChunks": false,
                            "aot": true,
                            "extractLicenses": true,
                            "vendorChunk": false,
                            "buildOptimizer": true
                        }
                    }
                },
                "serve": {
                    "builder": "@angular-devkit/build-angular:dev-server",
                    "options": {
                        "browserTarget": "demo:build"
                    },
                    "configurations": {
                        "production": {
                            "browserTarget": "demo:build:production"
                        }
                    }
                },
                "extract-i18n": {
                    "builder": "@angular-devkit/build-angular:extract-i18n",
                    "options": {
                        "browserTarget": "demo:build"
                    }
                },
                "test": {
                    "builder": "@angular-devkit/build-angular:karma",
                    "options": {
                        "polyfills": "src/polyfills.ts",
                        "tsConfig": "tsconfig.json",
                        "styles": [],
                        "scripts": [],
                        "assets": []
                    }
                },
                "lint": {
                    "builder": "@angular-devkit/build-angular:tslint",
                    "options": {
                        "tsConfig": [
                            "tsconfig.json"
                        ],
                        "exclude": [
                            "**/node_modules/**"
                        ]
                    }
                }
            }
        }
    },
    "defaultProject": "demo"
}`;
