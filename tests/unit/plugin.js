define([
    'test-sandbox',
    'text!fixtures/bellows.html',
    'text!fixtures/items.html',
    'text!fixtures/item.html',
    'text!fixtures/disableditem.html'
], function(testSandbox, fixture, items, item, disabledItem) {
    var Bellows;
    var $element;
    var $;

    describe('Bellows plugin', function() {
        beforeEach(function(done) {
            var setUpComplete = function(iFrame$) {
                $ = iFrame$;
                Bellows = $.fn.bellows.Constructor;
                $element = $(fixture).appendTo('#container');

                done();
            };

            testSandbox.setUp('sandbox', setUpComplete);
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines bellows in Zepto', function() {
                var bellows = $.fn.bellows;

                expect(bellows).to.be.defined;
            });

            it('defines bellows as a function', function() {
                var bellows = $.fn.bellows;

                expect(bellows).to.be.a('function');
            });
        });

        describe('invoking bellows', function() {
            it('creates bellows instance on $element', function() {
                $element.bellows();

                expect($element.data('bellows')).to.be.defined;
            });

            it('stores $element inside instance', function() {
                $element.bellows();

                expect($element.data('bellows').$bellows).to.be.defined;
            });

            it('wraps each content section with correct CSS class', function() {
                $element.bellows();

                expect($element.find('.bellows__content-wrapper')).to.have.length(2);
            });
        });

        describe('invoking bellows methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                expect(function() { $element.bellows('open'); }).to.throw;
            });
        });

        describe('invoking bellows methods using the plugin interface', function() {
            it('opens a bellows item using the open method', function(done) {
                $element.bellows({
                    opened: function(e, ui) {
                        expect(ui.item.hasClass('bellows--is-open')).to.be.true;
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('closes a bellows item using the close method', function(done) {
                $element.bellows({
                    opened: function() {
                        $element.bellows('close', 0);
                    },
                    closed: function(e, ui) {
                        expect(ui.item.hasClass('bellows--is-open')).to.be.false;
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('removes aria-hidden attribute when open', function(done) {
                $element.bellows({
                    opened: function(e, ui) {
                        expect(!!ui.item.find('.bellows__content-wrapper').attr('aria-hidden')).to.be.false;
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('adds aria-hidden attribute when closed', function(done) {
                $element.bellows({
                    opened: function() {
                        $element.bellows('close', 0);
                    },
                    closed: function(e, ui) {
                        expect(!!ui.item.find('.bellows__content-wrapper').attr('aria-hidden')).to.be.true;
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('enables handlers for dynamically added items', function(done) {
                $element.bellows({
                    open: function() {
                        done();
                    }
                });

                $element.bellows('add', items);
                $element
                    .find('.bellows__header:eq(3)')
                    .trigger('click');
            });

            it('replaces items when adding with replace', function() {
                $element.bellows();

                $element.bellows('add', item, true);

                expect($element.find('.bellows__item')).to.have.length(1);
            });

            it('throws for method calls that don\'t exist', function() {
                expect(function() { $element.bellows().bellows('noMethod'); }).to.throw;
            });

            it('throws when attempting to invoke private methods', function() {
                expect(function() { $element.bellows().bellows('_init'); }).to.throw;
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                expect(function() { $element.bellows().bellows('singleItemOpen'); }).to.throw;
            });
        });

        describe('disabling a bellows item', function() {
            it('does not open item when header clicked', function(done) {
                $element.bellows();

                var $disabledItem = $(disabledItem);

                $element.bellows('add', $disabledItem);

                $disabledItem
                    .find('.bellows__header')
                    .trigger('click');

                setTimeout(function() {
                    expect($disabledItem.hasClass('bellows--is-disabled')).to.be.true;
                    expect($disabledItem.hasClass('bellows--is-open')).to.be.false;
                    done();
                });
            });
        });
    });
});