var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
chai.should();

var Kefir = require('kefir');
var KefirProxy = require('../kefir-proxy');

describe('buses', function () {
    it('should create object of busses from array of strings', function () {
        var buses = KefirProxy.buses([
            'foo',
            'bar'
        ]);
        buses.foo.should.be.an.instanceof(Kefir.Observable);
        buses.bar.should.be.an.instanceof(Kefir.Observable);
        buses.foo.emit.should.exist;
        buses.bar.emit.should.exist;
    });

    it('should create object with object property', function () {
        var buses = KefirProxy.buses([
            'foo', {
                bar: ['baz']
            }
        ]);
        buses.foo.emit.should.exist;
        buses.bar.baz.emit.should.exist;
    });
});
