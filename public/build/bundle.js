
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const nbrLig = writable(10);
    const nbrCol = writable(10);

    const tableau = writable([]);

    const  ligHero = writable(1);
    const  colHero = writable(1);

    /* src/components/tableau/Tableau.svelte generated by Svelte v3.24.1 */
    const file = "src/components/tableau/Tableau.svelte";

    function create_fragment(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			add_location(div, file, 23, 0, 536);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[0], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $tableau;
    	let $nbrLig;
    	let $nbrCol;
    	let $ligHero;
    	let $colHero;
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(2, $tableau = $$value));
    	validate_store(nbrLig, "nbrLig");
    	component_subscribe($$self, nbrLig, $$value => $$invalidate(3, $nbrLig = $$value));
    	validate_store(nbrCol, "nbrCol");
    	component_subscribe($$self, nbrCol, $$value => $$invalidate(4, $nbrCol = $$value));
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(5, $ligHero = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(6, $colHero = $$value));

    	const createTab = (lig, col, car = 0) => {
    		let tab = [];

    		for (let i = 0; i <= lig; i++) {
    			const ligne = [];

    			for (let y = 0; y <= col; y++) {
    				ligne.push(car);
    			}

    			tab.push(ligne);
    		}

    		return tab;
    	};

    	set_store_value(tableau, $tableau = createTab($nbrLig, $nbrCol));
    	set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tableau> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tableau", $$slots, ['default']);

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tableau,
    		nbrLig,
    		nbrCol,
    		ligHero,
    		colHero,
    		createTab,
    		$tableau,
    		$nbrLig,
    		$nbrCol,
    		$ligHero,
    		$colHero
    	});

    	return [$$scope, $$slots];
    }

    class Tableau extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tableau",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/components/characters/Hero.svelte generated by Svelte v3.24.1 */

    const { console: console_1 } = globals;
    const file$1 = "src/components/characters/Hero.svelte";

    function create_fragment$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "id", "hero");
    			if (img.src !== (img_src_value = "./img/Heroe.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "character");
    			add_location(img, file$1, 116, 18, 2703);
    			attr_dev(div, "class", "hero");
    			add_location(div, file$1, 116, 0, 2685);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $ligHero;
    	let $tableau;
    	let $colHero;
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(0, $ligHero = $$value));
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(1, $tableau = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(2, $colHero = $$value));
    	let down = false;
    	let up = false;
    	let right = false;
    	let left = false;

    	const mooveHero = e => {
    		if (e.key === "ArrowDown") {
    			const interval = setInterval(stopFunction, 1000);

    			function stopFunction() {
    				if (down === false) {
    					clearInterval(interval);
    					console.log($ligHero);
    				} else {
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(ligHero, $ligHero++, $ligHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    					console.log($ligHero);
    					console.log("coucou");
    				}
    			}
    		}

    		if (e.key === "ArrowUp") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (up === false) {
    					clearInterval(interval);
    				} else {
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					ligHero.update(n => n - 1);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    				}
    			}
    		}

    		if (e.key === "ArrowLeft") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (left === false) {
    					clearInterval(interval);
    				} else {
    					set_store_value(tableau, $tableau[lig][col] = 0, $tableau);
    					col--;
    					set_store_value(tableau, $tableau[lig][col] = "p", $tableau);
    					colHero.set(col);
    				}
    			}
    		}

    		if (e.key === "ArrowRight") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (right === false) {
    					clearInterval(interval);
    				} else {
    					set_store_value(tableau, $tableau[lig][col] = 0, $tableau);
    					col++;
    					set_store_value(tableau, $tableau[lig][col] = "p", $tableau);
    					colHero.set(col);
    				}
    			}
    		}
    	};

    	// document.addEventListener(
    	//   'keydown',
    	//   event => {
    	//     switch (event.key) {
    	//       case 'ArrowDown':
    	//         if (down) return;
    	//         down = true;
    	//         break;
    	//       case 'ArrowUp':
    	//         if (up) return;
    	//         up = true;
    	//         break;
    	//       case 'ArrowLeft':
    	//         if (left) return;
    	//         left = true;
    	//         break;
    	//       case 'ArrowRight':
    	//         if (right) return;
    	//         right = true;
    	//         break;
    	//     }
    	//     mooveHero(event);
    	//   },
    	//   false
    	// );
    	document.addEventListener("keyup", event => {
    		switch (event.key) {
    		} // case 'ArrowDown':
    	}); //   down = false;
    	//   break;
    	// case 'ArrowUp':
    	//   up = false;

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Hero", $$slots, []);

    	$$self.$capture_state = () => ({
    		tableau,
    		ligHero,
    		colHero,
    		down,
    		up,
    		right,
    		left,
    		mooveHero,
    		$ligHero,
    		$tableau,
    		$colHero
    	});

    	$$self.$inject_state = $$props => {
    		if ("down" in $$props) down = $$props.down;
    		if ("up" in $$props) up = $$props.up;
    		if ("right" in $$props) right = $$props.right;
    		if ("left" in $$props) left = $$props.left;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/tableau/Case.svelte generated by Svelte v3.24.1 */

    const { console: console_1$1 } = globals;
    const file$2 = "src/components/tableau/Case.svelte";

    // (16:2) {#if idCase === 'p'}
    function create_if_block(ctx) {
    	let hero;
    	let current;
    	hero = new Hero({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(hero.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(hero, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hero.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hero.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(hero, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:2) {#if idCase === 'p'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let td;
    	let td_class_value;
    	let current;
    	let if_block = /*idCase*/ ctx[0] === "p" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block) if_block.c();
    			attr_dev(td, "class", td_class_value = "border cel " + /*idCase*/ ctx[0]);
    			add_location(td, file$2, 14, 0, 312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block) if_block.m(td, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*idCase*/ ctx[0] === "p") {
    				if (if_block) {
    					if (dirty & /*idCase*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(td, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*idCase*/ 1 && td_class_value !== (td_class_value = "border cel " + /*idCase*/ ctx[0])) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { idCase } = $$props;

    	onMount(async () => {
    		console.log("didMount Case.svelte");
    	});

    	const writable_props = ["idCase"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Case> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Case", $$slots, []);

    	$$self.$$set = $$props => {
    		if ("idCase" in $$props) $$invalidate(0, idCase = $$props.idCase);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Hero,
    		tableau,
    		ligHero,
    		colHero,
    		idCase
    	});

    	$$self.$inject_state = $$props => {
    		if ("idCase" in $$props) $$invalidate(0, idCase = $$props.idCase);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idCase];
    }

    class Case extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { idCase: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Case",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idCase*/ ctx[0] === undefined && !("idCase" in props)) {
    			console_1$1.warn("<Case> was created without expected prop 'idCase'");
    		}
    	}

    	get idCase() {
    		throw new Error("<Case>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idCase(value) {
    		throw new Error("<Case>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/tableau/Level.svelte generated by Svelte v3.24.1 */

    const { console: console_1$2 } = globals;
    const file$3 = "src/components/tableau/Level.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (131:6) {#each lig as col}
    function create_each_block_1(ctx) {
    	let case_1;
    	let current;

    	case_1 = new Case({
    			props: { idCase: /*col*/ ctx[11] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(case_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(case_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const case_1_changes = {};
    			if (dirty & /*$tableau*/ 1) case_1_changes.idCase = /*col*/ ctx[11];
    			case_1.$set(case_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(case_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(case_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(case_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(131:6) {#each lig as col}",
    		ctx
    	});

    	return block;
    }

    // (129:2) {#each $tableau as lig}
    function create_each_block(ctx) {
    	let tr;
    	let t;
    	let current;
    	let each_value_1 = /*lig*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "ligne");
    			add_location(tr, file$3, 129, 4, 2936);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tableau*/ 1) {
    				each_value_1 = /*lig*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(129:2) {#each $tableau as lig}",
    		ctx
    	});

    	return block;
    }

    // (128:0) <Tableau>
    function create_default_slot(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*$tableau*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$tableau*/ 1) {
    				each_value = /*$tableau*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(128:0) <Tableau>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let tableau_1;
    	let t;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	tableau_1 = new Tableau({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tableau_1.$$.fragment);
    			t = space();
    			button = element("button");
    			add_location(button, file$3, 136, 0, 3055);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tableau_1, target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", parseFile, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const tableau_1_changes = {};

    			if (dirty & /*$$scope, $tableau*/ 16385) {
    				tableau_1_changes.$$scope = { dirty, ctx };
    			}

    			tableau_1.$set(tableau_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tableau_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tableau_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tableau_1, detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function parseFile() {
    	var fileobj = event.target.files[0];
    	var fr = new FileReader();

    	fr.onload = function (event) {
    		index.push(fr.result);
    	};

    	fr.readAsText(fileobj);
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $ligHero;
    	let $tableau;
    	let $colHero;
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(5, $ligHero = $$value));
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(0, $tableau = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(6, $colHero = $$value));
    	let down = false;
    	let up = false;
    	let right = false;
    	let left = false;

    	onMount(async () => {
    		console.log("didMount Level");
    	}); // $tableau[$ligHero][$colHero] = 'p';

    	const mooveHero = e => {
    		if (e.key === "ArrowDown") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (down === false) {
    					clearInterval(interval);
    					console.log($ligHero);
    				} else {
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(ligHero, $ligHero++, $ligHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    				}
    			}
    		}

    		if (e.key === "ArrowUp") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (up === false) {
    					clearInterval(interval);
    				} else {
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(ligHero, $ligHero--, $ligHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    				}
    			}
    		}

    		if (e.key === "ArrowLeft") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (left === false) {
    					clearInterval(interval);
    				} else {
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(colHero, $colHero--, $colHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    				}
    			}
    		}

    		if (e.key === "ArrowRight") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (right === false) {
    					clearInterval(interval);
    				} else {
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = 0, $tableau);
    					set_store_value(colHero, $colHero++, $colHero);
    					set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    				}
    			}
    		}
    	};

    	document.addEventListener(
    		"keydown",
    		event => {
    			switch (event.key) {
    				case "ArrowDown":
    					if (down) return;
    					down = true;
    					break;
    				case "ArrowUp":
    					if (up) return;
    					up = true;
    					break;
    				case "ArrowLeft":
    					if (left) return;
    					left = true;
    					break;
    				case "ArrowRight":
    					if (right) return;
    					right = true;
    					break;
    			}

    			mooveHero(event);
    		},
    		false
    	);

    	document.addEventListener("keyup", event => {
    		switch (event.key) {
    			case "ArrowDown":
    				down = false;
    				break;
    			case "ArrowUp":
    				up = false;
    				break;
    			case "ArrowLeft":
    				left = false;
    				break;
    			case "ArrowRight":
    				right = false;
    				break;
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Level> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Level", $$slots, []);

    	$$self.$capture_state = () => ({
    		Tableau,
    		Case,
    		onMount,
    		tableau,
    		ligHero,
    		colHero,
    		down,
    		up,
    		right,
    		left,
    		parseFile,
    		mooveHero,
    		$ligHero,
    		$tableau,
    		$colHero
    	});

    	$$self.$inject_state = $$props => {
    		if ("down" in $$props) down = $$props.down;
    		if ("up" in $$props) up = $$props.up;
    		if ("right" in $$props) right = $$props.right;
    		if ("left" in $$props) left = $$props.left;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$tableau];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.1 */

    function create_fragment$4(ctx) {
    	let level;
    	let current;
    	level = new Level({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(level.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(level, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(level.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(level.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(level, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Level });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    const app = new App({
    	target: document.querySelector(".divTab"),
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
