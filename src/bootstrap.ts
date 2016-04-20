/// <reference path="../typings/winjs/winjs.d.ts" />
///<reference path="../node_modules/angular2/typings/browser.d.ts"/>

import {enableProdMode, provide} from "angular2/core";
import {bootstrap} from 'angular2/platform/browser';
//import {bootstrap, ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, HashLocationStrategy, LocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {Application} from 'winjs';

declare var Windows;

const ENV_PROVIDERS = [];

/*
 * App Component
 * our top level component that holds all of our components
 */
import {App} from './app/app';

var app = Application;
var activation = Windows.ApplicationModel.Activation;

app.onactivated = args => {
    if (args.detail.kind === activation.ActivationKind.launch) {
        if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {

            // The Windows app has been initialized, let's start Angular 2
            bootstrap(App, [
                    // These are dependencies of our App
                    ...HTTP_PROVIDERS,
                    ...ROUTER_PROVIDERS,
                    ...ENV_PROVIDERS,
                    provide(LocationStrategy, { useClass: HashLocationStrategy }) // use #/ routes, remove this for HTML5 mode
                ])
                .catch(err => console.error(err));

        } else {
            // TODO: cette application a été suspendue, puis terminée.
            // Pour créer une expérience utilisateur fluide, restaurez l'état de l'application ici afin de donner l'impression que l'application n'a jamais cessé de fonctionner.
        }
        args.setPromise(WinJS.UI.processAll());
    }
};

app.oncheckpoint = args => {
    // TODO: cette application va être suspendue. Enregistrez ici tous les états qui doivent être conservés entre les suspensions.
    // Vous utilisez l'objet WinJS.Application.sessionState, qui est automatiquement enregistré et restauré entre les suspensions.
    // Si vous devez effectuer une opération asynchrone avant la suspension de votre application, appelez args.setPromise().
};

app.start();
