var chai = require('chai');
var spies = require('chai-spies');
chai.use(spies);
chai.should();

var KefirProxy = require('../kefir-proxy');
var KefirBus = require('kefir-bus');
var KefirBusProperty = require('kefir-bus-property');

describe('proxy one bus to another', function () {
    var input = KefirBus();
    var output = KefirBus();
    KefirProxy.proxy(input, output);

    it('should proxy emitted value', function () {
        var outputSpy = chai.spy();
        output.onValue(outputSpy);
        input.emit('foo');
        outputSpy.should.have.been.called.with('foo');
    });

    it('should proxy emitter error', function () {
        var outputSpy = chai.spy();
        output.onError(outputSpy);
        input.error('foo');
        outputSpy.should.have.been.called.with('foo');
    });

    it('should end on original end', function () {
        var outputSpy = chai.spy();
        output.onEnd(outputSpy);
        input.end();
        outputSpy.should.have.been.called.exactly(1);
    });
});

describe('proxy object of buses to object of buses', function () {
    var inputs = {
        a: KefirBus(),
        b: KefirBus()
    };
    var outputs = {
        a: KefirBus(),
        b: KefirBus()
    };
    KefirProxy.proxy(inputs, outputs);

    it('should proxy emitted value to same property', function () {
        var outputSpy = chai.spy();
        var passiveOutputSpy = chai.spy();
        outputs.a.onValue(outputSpy);
        outputs.b.onValue(passiveOutputSpy);
        inputs.a.emit('foo');
        outputSpy.should.have.been.called.with('foo');
        passiveOutputSpy.should.not.have.been.called;
    });
});

describe('proxy array of buses to array of buses', function () {
    var inputs = [KefirBus(), KefirBus()];
    var outputs = [KefirBus(), KefirBus()];
    KefirProxy.proxy(inputs, outputs);

    it('should proxy emitted value at same index', function () {
        var outputSpy = chai.spy();
        var passiveOutputSpy = chai.spy();
        outputs[0].onValue(outputSpy);
        outputs[1].onValue(passiveOutputSpy);
        inputs[0].emit('foo');
        outputSpy.should.have.been.called.with('foo');
        passiveOutputSpy.should.not.have.been.called;
    });
});

describe('proxy property', function () {
    var input = KefirBusProperty();
    var output = KefirBusProperty();
    KefirProxy.proxy(input, output);

    it('should emit last value to new subscriber', function () {
        var outputSpy = chai.spy();
        output.onValue(outputSpy);
        input.emit('foo');
        outputSpy.should.have.been.called.with('foo');
        var newSubscriberSpy = chai.spy();
        output.onValue(newSubscriberSpy);
        newSubscriberSpy.should.have.been.called.with('foo');
    });
});
