define([
    'text!fixtures/bellows.html',
    'zepto',
    'velocity-shim',
    'velocity',
    'bellows'
], function(fixture, $) {
    var Bellows;
    var element;

    describe('Bellows constructor', function() {
        beforeEach(function() {
            Bellows = $.fn.bellows.Constructor;
            element = $(fixture);
        });

        it('creates a bellows instance', function() {
            var bellows = new Bellows(element);

            assert.isDefined(bellows);
        });
    });
});