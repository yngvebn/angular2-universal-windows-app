import {Http} from 'angular2/http';
import {Injectable} from 'angular2/core';

export interface ISonosRequestOptions {
    action: string;
    values: string;
    player: any;
}

@Injectable()
export class HttpAPI {
    webroot: string;
    port: number;
    webhook: any;
    discovery: any;
    actions: any;

    constructor(discovery, settings, public http: Http) {
        this.port = settings.port;
        this.webroot = settings.webroot;
        this.webhook = settings.webhook;
        discovery.on('transport-state', function (player) {
            this.invokeWebhook('transport-state', player);
        });

        discovery.on('topology-change', function (topology) {
            this.invokeWebhook('topology-change', topology);
        });

        //load modularized actions

    }

    getWebRoot() {
        return this.webroot;
    }

    getPort() {
        return this.port;
    }

    registerAction(action, handler) {
        this.actions[action] = handler;
    }

    handleAction(options: ISonosRequestOptions, callback) {
        var player = options.player;

        if (!this.actions[options.action]) {
            return callback({ error: 'action \'' + options.action + '\' not found' });
        }

        this.actions[options.action](player, options.values, callback);
        if (!callback.invokeIntended) {
            callback();
        }
    }

    invokeWebhook(type, data) {
        if (!this.webhook) return;
        let webhook = this.webhook;
        this.http.post(this.webhook, `type=${type}&data=${data}`).map(res => res.json())
            .subscribe(
            data => { },
            err => {
                console.error('Could not reach webhook endpoint', webhook, 'for some reason. Verify that the receiving end is up and running.');
                console.error(err.message);
            },
            () => console.log('Authentication Complete'));
    }

    requestHandler(req, res) {
        if (this.discovery.zones.length === 0) {
            res.writeHead(500, 'No system has been found yet.');
            res.end();
            console.error('No system has yet been discovered. Please see https://github.com/jishi/node-sonos-http-api/issues/77 if it doesn\'t resolve itself in a few seconds.');
            return;
        }

        var params = req.url.substring(1).split('/');

        var player = this.discovery.getPlayer(decodeURIComponent(params[0]));

        let opt: ISonosRequestOptions = <ISonosRequestOptions>({});

        if (player) {
            opt.action = (params[1] || '').toLowerCase();
            opt.values = params.splice(2);
        } else {
            player = this.discovery.getAnyPlayer();
            opt.action = (params[0] || '').toLowerCase();
            opt.values = params.splice(1);
        }

        opt.player = player;
        this.handleAction(opt, response => {
            if (response) {
                console.log(response);
            }
        });
    }


}
