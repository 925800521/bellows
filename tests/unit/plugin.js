define([
    'text!fixtures/bellows.html',
    'text!fixtures/items.html',
    'text!fixtures/item.html',
    'text!fixtures/disableditem.html',
    '$',
    'velocity',
    'bellows'
], function(fixture, items, item, disabledItem, $) {
    var $element;

    describe('Bellows plugin', function() {
        beforeEach(function() {
            $element = $(fixture).appendTo('#container');
        });

        describe('binding to Zepto\'s fn', function() {
            it('defines bellows in Zepto', function() {
                var bellows = $.fn.bellows;

                assert.isDefined(bellows);
            });

            it('defines bellows as a function', function() {
                var bellows = $.fn.bellows;

                assert.isFunction(bellows);
            });
        });

        describe('invoking bellows', function() {
            afterEach(function() {
                $element.bellows('destroy');
            });

            it('creates bellows instance on $element', function() {
                $element.bellows();

                assert.isDefined($element.data('bellows'));
            });

            it('stores $element inside instance', function() {
                $element.bellows();

                assert.isDefined($element.data('bellows').$bellows);
            });

            it('wraps each content section with correct CSS class', function() {
                $element.bellows();

                assert.lengthOf($element.find('.bellows__content-wrapper'), 2);
            });
        });

        describe('invoking bellows methods before plugin is initialized', function() {
            it('throws when not initialized', function() {
                assert.throws(function() { $element.bellows('open'); });
            });
        });

        describe('invoking bellows methods using the plugin interface', function() {
            afterEach(function() {
                $element.bellows('destroy');
            });

            it('opens a bellows item using the open method', function(done) {
                $element.bellows({
                    opened: function(e, ui) {
                        assert.isTrue(ui.item.hasClass('bellows--is-open'));
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
                        assert.isFalse(ui.item.hasClass('bellows--is-open'));
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('opens all bellows items using the openAll method', function(done) {

                var openCount = 0;

                $element.bellows({
                    opened: function(e, ui) {
                        assert.isTrue(ui.item.hasClass('bellows--is-open'));
                        openCount++;

                        if (openCount === 2) {
                            done();
                        }
                    }
                });

                $element.bellows('openAll');
            });

            it('closes all bellows items using the closeAll method', function(done) {

                var openCount = 0;
                var closeCount = 0;

                $element.bellows({
                    opened: function(e, ui) {
                        openCount++;
                        if (openCount === 2) {
                            $element.bellows('closeAll');
                        }
                    },
                    closed: function(e, ui) {
                        assert.isFalse(ui.item.hasClass('bellows--is-open'));
                        closeCount++;

                        if (closeCount === 2) {
                            done();
                        }
                    }
                });

                $element.bellows('openAll');
            });

            it('opens all bellows items when not all are open', function(done) {

                var openedSingle = false;

                $element.bellows({
                    opened: function(e, ui) {
                        if (!openedSingle) {
                            openedSingle = true;
                            $element.bellows('openAll');
                            return;
                        }

                        assert.equal($element.find('.bellows--is-open').length, 2);
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('closes all bellows items when not all are closed', function(done) {

                $element.bellows({
                    opened: function(e, ui) {
                        $element.bellows('closeAll');
                    },
                    closed: function(e, ui) {
                        assert.equal($element.find('.bellows__item:not(.bellows--is-open)').length, 2);
                        done();
                    }
                });

                $element.bellows('open', 0);
            });

            it('toggles all bellows items', function(done) {

                var openCount = 0;
                var closeCount = 0;

                $element.bellows({
                    opened: function(e, ui) {
                        openCount++;
                        if (openCount === 2) {
                            $element.bellows('toggleAll');
                        }
                    },
                    closed: function(e, ui) {
                        closeCount++;
                        
                        if (closeCount === 2) {
                            assert.equal($element.find('.bellows__item:not(.bellows--is-open)').length, 2);
                            done();
                        }
                    }
                });

                $element.bellows('toggleAll');
            });

            it('removes aria-hidden attribute when open', function(done) {
                $element.bellows({
                    opened: function(e, ui) {
                        assert.isFalse(!!ui.item.find('.bellows__content-wrapper').attr('aria-hidden'));
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
                        assert.isTrue(!!ui.item.find('.bellows__content-wrapper').attr('aria-hidden'));
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

                assert.equal($element.find('.bellows__item').length, 1);
            });

            it('throws for method calls that don\'t exist', function() {
                assert.throws(function() { $element.bellows().bellows('noMethod'); });
            });

            it('throws when attempting to invoke private methods', function() {
                assert.throws(function() { $element.bellows().bellows('_init'); });
            });

            it('throws when attempting to invoke methods that aren\'t functions', function() {
                assert.throws(function() { $element.bellows().bellows('singleItemOpen'); });
            });
        });

        describe('disabling a bellows item', function() {
            afterEach(function() {
                $element.bellows('destroy');
            });

            it('does not open item when header clicked', function(done) {
                $element.bellows();

                var $disabledItem = $(disabledItem);

                $element.bellows('add', $disabledItem);

                $disabledItem
                    .find('.bellows__header')
                    .trigger('click');

                setTimeout(function() {
                    assert.isTrue($disabledItem.hasClass('bellows--is-disabled'));
                    assert.isFalse($disabledItem.hasClass('bellows--is-open'));
                    done();
                });
            });
        });
    });
});