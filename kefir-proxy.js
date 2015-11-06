(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        /* global define */
        define(['kefir', 'kefir-bus'], factory);
    } else if (typeof exports === 'object') {
        /* global module, require */
        module.exports = factory(require('kefir'), require('kefir-bus'));
    } else {
        root.KefirProxy = factory(root.Kefir, root.KefirBus);
    }
}(this, function (Kefir, KefirBus) {
    function isObs(v) {
        return v instanceof Kefir.Observable;
    }

    function isArray(v) {
        return Array.isArray(v);
    }

    function isObj(v) {
        return v instanceof Object;
    }

    function isString(v) {
        return typeof v === 'string';
    }

    function proxyOne(obs, bus) {
        bus.plug(obs);
        obs.onEnd(function () {
            bus.end();
        });
    }

    return {
        proxy: function proxy(obss, buses) {
            if (isObs(obss)) {
                proxyOne(obss, buses);
                return;
            }
            if (isArray(obss)) {
                obss.forEach(function (obs, i) {
                    proxy(obs, buses[i]);
                });
                return;
            }
            if (isObj(obss)) {
                Object.keys(obss).forEach(function (key) {
                    proxy(obss[key], buses[key]);
                });
                return;
            }
            throw new Error('invalid arguments');
        },
        buses: function buses(list, config) {
            return list.reduce(function (result, v) {
                if (isString(v)) {
                    result[v] = KefirBus(config);
                    return result;
                }
                if (isObj(v)) {
                    return Object.keys(v).reduce(function (objResult, key) {
                        objResult[key] = buses(v[key]);
                        return objResult;
                    }, result);
                }
                throw new Error('invalid arguments');
            }, {});
        }
    };
}));
