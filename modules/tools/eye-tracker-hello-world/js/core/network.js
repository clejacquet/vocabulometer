const url = 'http://localhost:8080/signalr';
const hubName = 'chatHub';

function screenToWindow(x, y) {
    const yoffset = window.outerHeight - window.innerHeight;

    return [(x - window.screenX) / window.devicePixelRatio, (y - yoffset - window.screenY) / window.devicePixelRatio];
}

function start(connection, hub, cb) {
    connection.hub.start().done(function () {
        cb(hub);
    });
}

function waitAndRetry(time_ms, func) {
    setTimeout(function() {
        if (!func()) {
            waitAndRetry(time_ms, func);
        }
    }, time_ms);
}

function build(events, cb) {
    const connection = $.connection;
    connection.hub.url = url;

    const hub = connection[hubName];

    if (hub) {
        hub.client = events;

        connection.hub.error(function (err) {
            console.error(err);
            waitAndRetry(5000, function () {
                start(connection, hub, cb);
            });
        });

        start(connection, hub, cb);
    } else {
        console.error('Could not access the hub \'' + hubName + '\'');
    }
}

function startNetwork(target) {
    build({
        'onGazePoint': (x, y) => {
            [x, y] = screenToWindow(x, y);
            target.onGazePoint({ x: x, y: y });
        },
        'onFixation': (x, y) => {
            [x, y] = screenToWindow(x, y);
            target.onFixation({ x: x, y: y });
        }
    }, (hub) => {
        const updateRoutine = () => {
            hub.server.updateRequest();
            setTimeout(updateRoutine, 8);
        };

        updateRoutine();
    });
}
