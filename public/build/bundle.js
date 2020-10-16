
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
    function null_to_empty(value) {
        return value == null ? '' : value;
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
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
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
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
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
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
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
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
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
            set_current_component(null);
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

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.0' }, detail)));
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
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

    /* src/Tailwindcss.svelte generated by Svelte v3.25.0 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment.name
    		});
    	}
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

    const sound = writable(true);

    /* src/components/Options.svelte generated by Svelte v3.25.0 */

    const { console: console_1 } = globals;
    const file = "src/components/Options.svelte";

    function create_fragment$1(ctx) {
    	let div3;
    	let p0;
    	let t1;
    	let div0;
    	let p1;
    	let t2;
    	let span;
    	let t4;
    	let div1;
    	let img0;
    	let img0_src_value;
    	let t5;
    	let p2;
    	let t6;
    	let t7;
    	let t8;
    	let img1;
    	let img1_src_value;
    	let t9;
    	let div2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			p0 = element("p");
    			p0.textContent = "OPTIONS";
    			t1 = space();
    			div0 = element("div");
    			p1 = element("p");
    			t2 = text("Sound : ");
    			span = element("span");
    			span.textContent = "OFF";
    			t4 = space();
    			div1 = element("div");
    			img0 = element("img");
    			t5 = space();
    			p2 = element("p");
    			t6 = text("Sky ");
    			t7 = text(/*i*/ ctx[0]);
    			t8 = space();
    			img1 = element("img");
    			t9 = space();
    			div2 = element("div");
    			div2.textContent = "^";
    			add_location(p0, file, 53, 50, 1435);
    			attr_dev(span, "id", "soundstate");
    			add_location(span, file, 54, 25, 1513);
    			add_location(p1, file, 54, 13, 1501);
    			add_location(div0, file, 54, 8, 1496);
    			if (img0.src !== (img0_src_value = "./img/previous.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "");
    			attr_dev(img0, "id", "previous");
    			attr_dev(img0, "class", "svelte-61h052");
    			add_location(img0, file, 56, 12, 1646);
    			attr_dev(p2, "class", "display-block align-middle");
    			add_location(p2, file, 57, 12, 1736);
    			if (img1.src !== (img1_src_value = "./img/next.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "");
    			attr_dev(img1, "id", "next");
    			attr_dev(img1, "class", "svelte-61h052");
    			add_location(img1, file, 58, 12, 1798);
    			attr_dev(div1, "class", "flex  space-x-3 justify-center ");
    			add_location(div1, file, 55, 8, 1588);
    			add_location(div2, file, 60, 8, 1900);
    			attr_dev(div3, "id", "options-button");
    			attr_dev(div3, "class", "opt-button svelte-61h052");
    			add_location(div3, file, 53, 4, 1389);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p0);
    			append_dev(div3, t1);
    			append_dev(div3, div0);
    			append_dev(div0, p1);
    			append_dev(p1, t2);
    			append_dev(p1, span);
    			append_dev(div3, t4);
    			append_dev(div3, div1);
    			append_dev(div1, img0);
    			append_dev(div1, t5);
    			append_dev(div1, p2);
    			append_dev(p2, t6);
    			append_dev(p2, t7);
    			append_dev(div1, t8);
    			append_dev(div1, img1);
    			append_dev(div3, t9);
    			append_dev(div3, div2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(p0, "click", prevent_default(/*showOptions*/ ctx[1]), false, true, false),
    					listen_dev(span, "click", /*handleSound*/ ctx[4], false, false, false),
    					listen_dev(img0, "click", self(/*handleBg*/ ctx[3]), false, false, false),
    					listen_dev(img1, "click", prevent_default(/*handleBg*/ ctx[3]), false, true, false),
    					listen_dev(div2, "click", self(/*unshowOptions*/ ctx[2]), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*i*/ 1) set_data_dev(t7, /*i*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
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
    	let $sound;
    	validate_store(sound, "sound");
    	component_subscribe($$self, sound, $$value => $$invalidate(6, $sound = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Options", slots, []);
    	var options = false;
    	let i = 3;

    	function showOptions() {
    		if (!options) {
    			let optbutton = document.querySelector("#options-button");
    			optbutton.style.height = 16 + "rem";
    			options = true;
    			console.log("show");
    		}
    	}

    	function unshowOptions() {
    		if (options) {
    			let optbutton = document.querySelector("#options-button");
    			optbutton.style.height = 5 + "rem";
    			options = false;
    			console.log("unshow");
    		}
    	}

    	function handleBg() {
    		console.log(this.className);
    		let body = document.body;

    		if (this.id === "previous") {
    			if (i === 1) {
    				return;
    			} else {
    				$$invalidate(0, i -= 1);
    			}

    			body.style.backgroundImage = "url('./img/sky" + i + ".jpg')";
    		} else {
    			if (i === 4) {
    				return;
    			} else {
    				$$invalidate(0, i += 1);
    			}

    			body.style.backgroundImage = "url('./img/sky" + i + ".jpg')";
    		}
    	}

    	function handleSound() {
    		console.log("handlesound");

    		if (this.innerHTML === "ON") {
    			set_store_value(sound, $sound = !$sound);
    			this.innerHTML = "OFF";
    		} else {
    			set_store_value(sound, $sound = !$sound);
    			this.innerHTML = "ON";
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Options> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		sound,
    		options,
    		i,
    		showOptions,
    		unshowOptions,
    		handleBg,
    		handleSound,
    		$sound
    	});

    	$$self.$inject_state = $$props => {
    		if ("options" in $$props) options = $$props.options;
    		if ("i" in $$props) $$invalidate(0, i = $$props.i);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [i, showOptions, unshowOptions, handleBg, handleSound];
    }

    class Options extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Options",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/components/Accueil.svelte generated by Svelte v3.25.0 */

    const { console: console_1$1 } = globals;

    const file$1 = "src/components/Accueil.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (54:2) {#each array as square}
    function create_each_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			attr_dev(img, "class", "grass");
    			if (img.src !== (img_src_value = "./img/grass.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "grass");
    			attr_dev(img, "height", "100px");
    			attr_dev(img, "width", "120px");
    			add_location(img, file$1, 55, 6, 1684);
    			attr_dev(div, "class", div_class_value = "sq-grass " + /*square*/ ctx[6] + " svelte-obcxm7");
    			add_location(div, file$1, 54, 4, 1646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(54:2) {#each array as square}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div13;
    	let div12;
    	let div8;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div7;
    	let t1;
    	let div0;
    	let t3;
    	let div1;
    	let t5;
    	let div2;
    	let t7;
    	let div3;
    	let t9;
    	let div4;
    	let t11;
    	let div5;
    	let t13;
    	let div6;
    	let t15;
    	let div10;
    	let img1;
    	let img1_src_value;
    	let t16;
    	let div9;
    	let t18;
    	let div11;
    	let img2;
    	let img2_src_value;
    	let t19;
    	let options;
    	let t20;
    	let button;
    	let t22;
    	let div14;
    	let t23;
    	let img3;
    	let img3_src_value;
    	let t24;
    	let img4;
    	let img4_src_value;
    	let t25;
    	let img5;
    	let img5_src_value;
    	let current;
    	let mounted;
    	let dispose;
    	options = new Options({ $$inline: true });
    	let each_value = /*array*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div13 = element("div");
    			div12 = element("div");
    			div8 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div7 = element("div");
    			t1 = text("HI SCORES\n            ");
    			div0 = element("div");
    			div0.textContent = "Rouky : 232";
    			t3 = space();
    			div1 = element("div");
    			div1.textContent = "Soso : 232";
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "Mamos : 232";
    			t7 = space();
    			div3 = element("div");
    			div3.textContent = "Soso : 232";
    			t9 = space();
    			div4 = element("div");
    			div4.textContent = "Rouky : 232";
    			t11 = space();
    			div5 = element("div");
    			div5.textContent = "Mamos : 232";
    			t13 = space();
    			div6 = element("div");
    			div6.textContent = "^";
    			t15 = space();
    			div10 = element("div");
    			img1 = element("img");
    			t16 = space();
    			div9 = element("div");
    			div9.textContent = "NEW GAME";
    			t18 = space();
    			div11 = element("div");
    			img2 = element("img");
    			t19 = space();
    			create_component(options.$$.fragment);
    			t20 = space();
    			button = element("button");
    			button.textContent = "activer le son";
    			t22 = space();
    			div14 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t23 = space();
    			img3 = element("img");
    			t24 = space();
    			img4 = element("img");
    			t25 = space();
    			img5 = element("img");
    			attr_dev(img0, "class", "img1 svelte-obcxm7");
    			if (img0.src !== (img0_src_value = "./img/ET3.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "ET1");
    			attr_dev(img0, "width", "200px");
    			add_location(img0, file$1, 26, 10, 662);
    			add_location(div0, file$1, 28, 12, 818);
    			add_location(div1, file$1, 29, 12, 854);
    			add_location(div2, file$1, 30, 12, 888);
    			add_location(div3, file$1, 31, 12, 924);
    			add_location(div4, file$1, 32, 12, 958);
    			add_location(div5, file$1, 33, 12, 994);
    			add_location(div6, file$1, 34, 12, 1029);
    			attr_dev(div7, "class", "m-auto hiscores-button  svelte-obcxm7");
    			add_location(div7, file$1, 27, 10, 735);
    			attr_dev(div8, "class", "animintro svelte-obcxm7");
    			add_location(div8, file$1, 25, 8, 628);
    			attr_dev(img1, "class", "img2 svelte-obcxm7");
    			if (img1.src !== (img1_src_value = "./img/ET1.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "ET2");
    			attr_dev(img1, "width", "300px");
    			add_location(img1, file$1, 38, 10, 1116);
    			attr_dev(div9, "class", "newg-button svelte-obcxm7");
    			add_location(div9, file$1, 39, 10, 1189);
    			attr_dev(div10, "class", "animintro svelte-obcxm7");
    			add_location(div10, file$1, 37, 8, 1082);
    			attr_dev(img2, "class", "img3 svelte-obcxm7");
    			if (img2.src !== (img2_src_value = "./img/ET2.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "ET3");
    			attr_dev(img2, "width", "200px");
    			add_location(img2, file$1, 43, 10, 1343);
    			add_location(button, file$1, 45, 10, 1437);
    			attr_dev(div11, "class", "animintro svelte-obcxm7");
    			add_location(div11, file$1, 42, 8, 1308);
    			attr_dev(div12, "class", "trio flex justify-center w-3/5 space-x-16 my-8 mx-auto svelte-obcxm7");
    			add_location(div12, file$1, 24, 6, 551);
    			attr_dev(div13, "class", "manette m-auto w-5/6");
    			add_location(div13, file$1, 23, 0, 509);
    			attr_dev(div14, "class", "flex floor");
    			add_location(div14, file$1, 52, 0, 1591);
    			if (img3.src !== (img3_src_value = "./img/deadtree.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "deadtree");
    			attr_dev(img3, "class", "deadtree");
    			add_location(img3, file$1, 67, 0, 1891);
    			if (img4.src !== (img4_src_value = "./img/bullet.svg")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "bullet1");
    			attr_dev(img4, "class", "bullet1");
    			add_location(img4, file$1, 68, 0, 1956);
    			if (img5.src !== (img5_src_value = "./img/bullet.svg")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "bullet1");
    			attr_dev(img5, "class", "bullet2");
    			add_location(img5, file$1, 69, 0, 2017);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div13, anchor);
    			append_dev(div13, div12);
    			append_dev(div12, div8);
    			append_dev(div8, img0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, t1);
    			append_dev(div7, div0);
    			append_dev(div7, t3);
    			append_dev(div7, div1);
    			append_dev(div7, t5);
    			append_dev(div7, div2);
    			append_dev(div7, t7);
    			append_dev(div7, div3);
    			append_dev(div7, t9);
    			append_dev(div7, div4);
    			append_dev(div7, t11);
    			append_dev(div7, div5);
    			append_dev(div7, t13);
    			append_dev(div7, div6);
    			append_dev(div12, t15);
    			append_dev(div12, div10);
    			append_dev(div10, img1);
    			append_dev(div10, t16);
    			append_dev(div10, div9);
    			append_dev(div12, t18);
    			append_dev(div12, div11);
    			append_dev(div11, img2);
    			append_dev(div11, t19);
    			mount_component(options, div11, null);
    			append_dev(div11, t20);
    			append_dev(div11, button);
    			insert_dev(target, t22, anchor);
    			insert_dev(target, div14, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div14, null);
    			}

    			insert_dev(target, t23, anchor);
    			insert_dev(target, img3, anchor);
    			insert_dev(target, t24, anchor);
    			insert_dev(target, img4, anchor);
    			insert_dev(target, t25, anchor);
    			insert_dev(target, img5, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div7, "click", showHiScores, false, false, false),
    					listen_dev(div9, "click", prevent_default(/*click_handler*/ ctx[3]), false, true, false),
    					listen_dev(button, "click", /*activateSound*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*array*/ 2) {
    				each_value = /*array*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div14, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(options.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(options.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div13);
    			destroy_component(options);
    			if (detaching) detach_dev(t22);
    			if (detaching) detach_dev(div14);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(img3);
    			if (detaching) detach_dev(t24);
    			if (detaching) detach_dev(img4);
    			if (detaching) detach_dev(t25);
    			if (detaching) detach_dev(img5);
    			mounted = false;
    			run_all(dispose);
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

    function showHiScores() {
    	console.log(this.className);
    	this.style.height = 16 + "rem";
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $sound;
    	validate_store(sound, "sound");
    	component_subscribe($$self, sound, $$value => $$invalidate(4, $sound = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Accueil", slots, []);
    	const dispatch = createEventDispatcher();

    	// variables
    	let array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    	let { newGame } = $$props;

    	function activateSound() {
    		set_store_value(sound, $sound = !$sound);
    	}

    	const writable_props = ["newGame"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Accueil> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, newGame = true);

    	$$self.$$set = $$props => {
    		if ("newGame" in $$props) $$invalidate(0, newGame = $$props.newGame);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		Options,
    		sound,
    		array,
    		newGame,
    		activateSound,
    		showHiScores,
    		$sound
    	});

    	$$self.$inject_state = $$props => {
    		if ("array" in $$props) $$invalidate(1, array = $$props.array);
    		if ("newGame" in $$props) $$invalidate(0, newGame = $$props.newGame);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [newGame, array, activateSound, click_handler];
    }

    class Accueil extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { newGame: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Accueil",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*newGame*/ ctx[0] === undefined && !("newGame" in props)) {
    			console_1$1.warn("<Accueil> was created without expected prop 'newGame'");
    		}
    	}

    	get newGame() {
    		throw new Error("<Accueil>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set newGame(value) {
    		throw new Error("<Accueil>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const nbrLig = writable(10);
    const nbrCol = writable(10);

    const tableau = writable([]);

    // HERO
    const ligHero = writable(5);
    const colHero = writable(5);
    const previousLigHero = writable(5);
    const previousColHero = writable(5);
    const step = writable(1);
    const direction = writable("down");
    const leftSide = writable(2);
    const bottomSide = writable(1);


    // ZOMBIE
    const ligAlien = writable(1);
    const colAlien = writable(1);
    const previousLigAlien = writable(1);
    const previousColAlien = writable(1);
    const leftAlien = writable(0); 
    const topAlien = writable(0); 
    const directionAlien = writable("down");

    /* src/components/tableau/Tableau.svelte generated by Svelte v3.25.0 */

    const { console: console_1$2 } = globals;

    const file$2 = "src/components/tableau/Tableau.svelte";

    function create_fragment$3(ctx) {
    	let p;
    	let t1;
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[1].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[0], null);

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Utlisez les touches directionnelles";
    			t1 = space();
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(p, "class", "text-center text-green-300");
    			add_location(p, file$2, 80, 0, 2174);
    			attr_dev(div0, "id", "tableau");
    			add_location(div0, file$2, 82, 2, 2277);
    			attr_dev(div1, "class", "tableau ");
    			add_location(div1, file$2, 81, 0, 2252);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
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
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let $tableau;
    	let $nbrLig;
    	let $nbrCol;
    	let $ligHero;
    	let $colHero;
    	let $ligAlien;
    	let $colAlien;
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(3, $tableau = $$value));
    	validate_store(nbrLig, "nbrLig");
    	component_subscribe($$self, nbrLig, $$value => $$invalidate(4, $nbrLig = $$value));
    	validate_store(nbrCol, "nbrCol");
    	component_subscribe($$self, nbrCol, $$value => $$invalidate(5, $nbrCol = $$value));
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(6, $ligHero = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(7, $colHero = $$value));
    	validate_store(ligAlien, "ligAlien");
    	component_subscribe($$self, ligAlien, $$value => $$invalidate(8, $ligAlien = $$value));
    	validate_store(colAlien, "colAlien");
    	component_subscribe($$self, colAlien, $$value => $$invalidate(9, $colAlien = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tableau", slots, ['default']);

    	onMount(() => {
    		console.log("Mount Tableau");
    	});

    	//onDestroy
    	onDestroy(() => {
    		console.log("Destroy Tableau");
    	}); // clearInterval(interval4);

    	let level = "";

    	const parseFile = () => {
    		let fr = new FileReader();
    		fetch("./resources/level1.txt").then(data => data.text()).then(response => level = response);
    	};

    	// INITIALISATION DU JEU
    	function init() {
    		parseFile();

    		// CREATE TAB
    		const createTab = (lig, col, car = 0) => {
    			let tab = [];
    			let index = 0;

    			for (let i = 0; i <= lig; i++) {
    				const ligne = [];

    				for (let y = 0; y <= col; y++) {
    					ligne.push(car);
    					console.log(index);
    					index++;
    				}

    				tab.push(ligne);
    			}

    			return tab;
    		};

    		set_store_value(tableau, $tableau = createTab($nbrLig, $nbrCol));

    		// ASSIGN VALUES TO TAB CELLS : 'p' for Hero, 'z' for Enemies
    		set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);

    		set_store_value(tableau, $tableau[$ligAlien][$colAlien] = "z", $tableau);
    		set_store_value(tableau, $tableau[10][1] = "fire", $tableau);
    		set_store_value(tableau, $tableau[10][2] = "fire", $tableau);
    		set_store_value(tableau, $tableau[10][3] = "fire", $tableau);
    		set_store_value(tableau, $tableau[10][9] = "fire", $tableau);
    		set_store_value(tableau, $tableau[10][8] = "fire", $tableau);
    		set_store_value(tableau, $tableau[10][7] = "fire", $tableau);
    		set_store_value(tableau, $tableau[10][4] = "empty", $tableau);
    		set_store_value(tableau, $tableau[10][5] = "empty", $tableau);
    		set_store_value(tableau, $tableau[10][6] = "empty", $tableau);
    		set_store_value(tableau, $tableau[0][0] = "empty", $tableau);
    		set_store_value(tableau, $tableau[10][0] = "empty", $tableau);
    		set_store_value(tableau, $tableau[10][10] = "empty", $tableau);
    		set_store_value(tableau, $tableau[0][10] = "empty", $tableau);

    		// CREATE SHIP
    		for (let i = 0; i < 1; i++) {
    			for (let y = 1; y <= 9; y++) {
    				set_store_value(tableau, $tableau[0][y] = "ship", $tableau);
    				set_store_value(tableau, $tableau[9][y] = "ship", $tableau);
    				set_store_value(tableau, $tableau[y][0] = "ship", $tableau);
    				set_store_value(tableau, $tableau[y][10] = "ship", $tableau);
    			}
    		}
    	}

    	init();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Tableau> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tableau,
    		nbrLig,
    		nbrCol,
    		ligHero,
    		colHero,
    		ligAlien,
    		colAlien,
    		leftAlien,
    		topAlien,
    		onDestroy,
    		onMount,
    		level,
    		parseFile,
    		init,
    		$tableau,
    		$nbrLig,
    		$nbrCol,
    		$ligHero,
    		$colHero,
    		$ligAlien,
    		$colAlien
    	});

    	$$self.$inject_state = $$props => {
    		if ("level" in $$props) level = $$props.level;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$$scope, slots];
    }

    class Tableau extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tableau",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/components/Hero.svelte generated by Svelte v3.25.0 */

    const { console: console_1$3 } = globals;

    const file$3 = "src/components/Hero.svelte";

    function create_fragment$4(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_class_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			attr_dev(img, "class", img_class_value = "" + (/*$direction*/ ctx[2] + " moove-hero" + " svelte-1lvn37d"));
    			attr_dev(img, "id", "hero1");
    			if (img.src !== (img_src_value = "./resources/space_hero.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$3, 20, 4, 526);
    			attr_dev(div0, "class", "hero svelte-1lvn37d");
    			set_style(div0, "bottom", /*$bottomSide*/ ctx[0] + "px");
    			set_style(div0, "left", /*$leftSide*/ ctx[1] + "px");
    			add_location(div0, file$3, 19, 2, 452);
    			attr_dev(div1, "class", "divHero svelte-1lvn37d");
    			add_location(div1, file$3, 18, 0, 428);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$direction*/ 4 && img_class_value !== (img_class_value = "" + (/*$direction*/ ctx[2] + " moove-hero" + " svelte-1lvn37d"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*$bottomSide*/ 1) {
    				set_style(div0, "bottom", /*$bottomSide*/ ctx[0] + "px");
    			}

    			if (dirty & /*$leftSide*/ 2) {
    				set_style(div0, "left", /*$leftSide*/ ctx[1] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
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
    	let $bottomSide;
    	let $leftSide;
    	let $direction;
    	validate_store(bottomSide, "bottomSide");
    	component_subscribe($$self, bottomSide, $$value => $$invalidate(0, $bottomSide = $$value));
    	validate_store(leftSide, "leftSide");
    	component_subscribe($$self, leftSide, $$value => $$invalidate(1, $leftSide = $$value));
    	validate_store(direction, "direction");
    	component_subscribe($$self, direction, $$value => $$invalidate(2, $direction = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Hero", slots, []);

    	onMount(() => {
    		console.log("Mount Hero");
    	});

    	// onDestroy
    	onDestroy(() => {
    		console.log("Destroy Hero");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Hero> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		step,
    		direction,
    		leftSide,
    		bottomSide,
    		onMount,
    		onDestroy,
    		$bottomSide,
    		$leftSide,
    		$direction
    	});

    	return [$bottomSide, $leftSide, $direction];
    }

    class Hero extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hero",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/textures/Fire.svelte generated by Svelte v3.25.0 */

    const { console: console_1$4 } = globals;
    const file$4 = "src/components/textures/Fire.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			attr_dev(img, "class", "fire-bomb svelte-101e7gu");
    			attr_dev(img, "id", "fire");
    			if (img.src !== (img_src_value = "./resources/texture1.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$4, 52, 4, 624);
    			attr_dev(div0, "class", "fire svelte-101e7gu");
    			add_location(div0, file$4, 51, 2, 601);
    			attr_dev(div1, "class", "tt svelte-101e7gu");
    			add_location(div1, file$4, 50, 0, 582);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Fire", slots, []);
    	console.log("je suis fire");
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<Fire> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Fire extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fire",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/textures/Ship.svelte generated by Svelte v3.25.0 */

    const { console: console_1$5 } = globals;
    const file$5 = "src/components/textures/Ship.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let img;
    	let img_class_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", img_class_value = "texture" + /*num*/ ctx[0] + " svelte-1nas02j");
    			attr_dev(img, "id", "ship");
    			if (img.src !== (img_src_value = "./resources/texture2.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$5, 41, 2, 520);
    			attr_dev(div, "class", "ship svelte-1nas02j");
    			add_location(div, file$5, 40, 0, 499);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*num*/ 1 && img_class_value !== (img_class_value = "texture" + /*num*/ ctx[0] + " svelte-1nas02j")) {
    				attr_dev(img, "class", img_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Ship", slots, []);
    	console.log("je suis ship");
    	let num = 1;

    	function number(number) {
    		$$invalidate(0, num = Math.floor(Math.random() * number));
    	}

    	number(4);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$5.warn(`<Ship> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ num, number });

    	$$self.$inject_state = $$props => {
    		if ("num" in $$props) $$invalidate(0, num = $$props.num);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [num];
    }

    class Ship extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ship",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/Enemies.svelte generated by Svelte v3.25.0 */

    const { console: console_1$6 } = globals;
    const file$6 = "src/components/Enemies.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let img;
    	let img_class_value;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			attr_dev(img, "class", img_class_value = "" + (null_to_empty(/*$directionAlien*/ ctx[2]) + " svelte-160gp37"));
    			attr_dev(img, "id", "alien1");
    			if (img.src !== (img_src_value = "./resources/enemy.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$6, 18, 2, 465);
    			attr_dev(div, "class", "alien1 svelte-160gp37");
    			set_style(div, "left", /*$leftAlien*/ ctx[0] + "px");
    			set_style(div, "top", /*$topAlien*/ ctx[1] + "px");
    			add_location(div, file$6, 17, 0, 395);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$directionAlien*/ 4 && img_class_value !== (img_class_value = "" + (null_to_empty(/*$directionAlien*/ ctx[2]) + " svelte-160gp37"))) {
    				attr_dev(img, "class", img_class_value);
    			}

    			if (dirty & /*$leftAlien*/ 1) {
    				set_style(div, "left", /*$leftAlien*/ ctx[0] + "px");
    			}

    			if (dirty & /*$topAlien*/ 2) {
    				set_style(div, "top", /*$topAlien*/ ctx[1] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $leftAlien;
    	let $topAlien;
    	let $directionAlien;
    	validate_store(leftAlien, "leftAlien");
    	component_subscribe($$self, leftAlien, $$value => $$invalidate(0, $leftAlien = $$value));
    	validate_store(topAlien, "topAlien");
    	component_subscribe($$self, topAlien, $$value => $$invalidate(1, $topAlien = $$value));
    	validate_store(directionAlien, "directionAlien");
    	component_subscribe($$self, directionAlien, $$value => $$invalidate(2, $directionAlien = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Enemies", slots, []);

    	onMount(() => {
    		console.log("Mount Enemy");
    	});

    	// onDestroy
    	onDestroy(() => {
    		console.log("Destroy Enemy");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$6.warn(`<Enemies> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		leftAlien,
    		topAlien,
    		directionAlien,
    		$leftAlien,
    		$topAlien,
    		$directionAlien
    	});

    	return [$leftAlien, $topAlien, $directionAlien];
    }

    class Enemies extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Enemies",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/tableau/Case.svelte generated by Svelte v3.25.0 */
    const file$7 = "src/components/tableau/Case.svelte";

    // (12:2) {#if idCase === 'p'}
    function create_if_block_3(ctx) {
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
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(12:2) {#if idCase === 'p'}",
    		ctx
    	});

    	return block;
    }

    // (15:2) {#if idCase === 'fire'}
    function create_if_block_2(ctx) {
    	let fire;
    	let current;
    	fire = new Fire({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(fire.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fire, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fire.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fire.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fire, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(15:2) {#if idCase === 'fire'}",
    		ctx
    	});

    	return block;
    }

    // (18:2) {#if idCase === 'ship'}
    function create_if_block_1(ctx) {
    	let ship;
    	let current;
    	ship = new Ship({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(ship.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(ship, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ship.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ship.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(ship, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(18:2) {#if idCase === 'ship'}",
    		ctx
    	});

    	return block;
    }

    // (21:2) {#if idCase === 'z'}
    function create_if_block(ctx) {
    	let enemies;
    	let current;
    	enemies = new Enemies({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(enemies.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(enemies, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(enemies.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(enemies.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(enemies, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(21:2) {#if idCase === 'z'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let td;
    	let t0;
    	let t1;
    	let t2;
    	let td_class_value;
    	let current;
    	let if_block0 = /*idCase*/ ctx[0] === "p" && create_if_block_3(ctx);
    	let if_block1 = /*idCase*/ ctx[0] === "fire" && create_if_block_2(ctx);
    	let if_block2 = /*idCase*/ ctx[0] === "ship" && create_if_block_1(ctx);
    	let if_block3 = /*idCase*/ ctx[0] === "z" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			td = element("td");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(td, "class", td_class_value = "cel " + /*idCase*/ ctx[0] + " " + " svelte-1mc2c1x");
    			add_location(td, file$7, 10, 0, 241);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			if (if_block0) if_block0.m(td, null);
    			append_dev(td, t0);
    			if (if_block1) if_block1.m(td, null);
    			append_dev(td, t1);
    			if (if_block2) if_block2.m(td, null);
    			append_dev(td, t2);
    			if (if_block3) if_block3.m(td, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*idCase*/ ctx[0] === "p") {
    				if (if_block0) {
    					if (dirty & /*idCase*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(td, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*idCase*/ ctx[0] === "fire") {
    				if (if_block1) {
    					if (dirty & /*idCase*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(td, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*idCase*/ ctx[0] === "ship") {
    				if (if_block2) {
    					if (dirty & /*idCase*/ 1) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(td, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*idCase*/ ctx[0] === "z") {
    				if (if_block3) {
    					if (dirty & /*idCase*/ 1) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(td, null);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*idCase*/ 1 && td_class_value !== (td_class_value = "cel " + /*idCase*/ ctx[0] + " " + " svelte-1mc2c1x")) {
    				attr_dev(td, "class", td_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Case", slots, []);
    	let { idCase } = $$props;
    	const writable_props = ["idCase"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Case> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("idCase" in $$props) $$invalidate(0, idCase = $$props.idCase);
    	};

    	$$self.$capture_state = () => ({ Hero, Fire, Ship, Enemies, idCase });

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
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { idCase: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Case",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*idCase*/ ctx[0] === undefined && !("idCase" in props)) {
    			console.warn("<Case> was created without expected prop 'idCase'");
    		}
    	}

    	get idCase() {
    		throw new Error("<Case>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set idCase(value) {
    		throw new Error("<Case>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const newGame = writable(false); 
    const retry = writable(false);

    /* src/components/tableau/Level.svelte generated by Svelte v3.25.0 */
    const file$8 = "src/components/tableau/Level.svelte";

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[43] = list[i];
    	return child_ctx;
    }

    // (315:10) {#each lig as col}
    function create_each_block_1(ctx) {
    	let case_1;
    	let current;

    	case_1 = new Case({
    			props: { idCase: /*col*/ ctx[46] },
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
    			if (dirty[0] & /*$tableau*/ 2) case_1_changes.idCase = /*col*/ ctx[46];
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
    		source: "(315:10) {#each lig as col}",
    		ctx
    	});

    	return block;
    }

    // (313:6) {#each $tableau as lig}
    function create_each_block$1(ctx) {
    	let tr;
    	let current;
    	let each_value_1 = /*lig*/ ctx[43];
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

    			attr_dev(tr, "class", "ligne");
    			add_location(tr, file$8, 313, 8, 8176);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tableau*/ 2) {
    				each_value_1 = /*lig*/ ctx[43];
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
    						each_blocks[i].m(tr, null);
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
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(313:6) {#each $tableau as lig}",
    		ctx
    	});

    	return block;
    }

    // (320:6) {#if gameOver}
    function create_if_block$1(ctx) {
    	let div;
    	let p;
    	let t1;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "GAMEOVER";
    			t1 = space();
    			button = element("button");
    			button.textContent = "RETRY";
    			add_location(p, file$8, 321, 10, 8366);
    			attr_dev(button, "class", "m-auto rounded-lg bg-black text-white retry h-16 w-40 svelte-rxbrdg");
    			add_location(button, file$8, 322, 10, 8392);
    			attr_dev(div, "class", " gameover svelte-rxbrdg");
    			add_location(div, file$8, 320, 8, 8332);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(div, t1);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleRetry*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(320:6) {#if gameOver}",
    		ctx
    	});

    	return block;
    }

    // (312:4) <Tableau>
    function create_default_slot(ctx) {
    	let t;
    	let if_block_anchor;
    	let current;
    	let each_value = /*$tableau*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*gameOver*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$tableau*/ 2) {
    				each_value = /*$tableau*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t.parentNode, t);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (/*gameOver*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
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
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(312:4) <Tableau>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t;
    	let div4;
    	let div3;
    	let tableau_1;
    	let current;

    	tableau_1 = new Tableau({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			div4 = element("div");
    			div3 = element("div");
    			create_component(tableau_1.$$.fragment);
    			attr_dev(div0, "class", "life rounded-l-lg bg-green-300  svelte-rxbrdg");
    			add_location(div0, file$8, 306, 4, 7973);
    			attr_dev(div1, "class", "bar rounded-lg h-12 w-1/5 bg-transparent border border-white");
    			add_location(div1, file$8, 305, 2, 7894);
    			attr_dev(div2, "class", "energybar flex justify-center");
    			add_location(div2, file$8, 304, 0, 7848);
    			attr_dev(div3, "class", "gamefield");
    			add_location(div3, file$8, 310, 2, 8100);
    			attr_dev(div4, "class", "flex flex-col justify-around h-auto w-full");
    			add_location(div4, file$8, 309, 0, 8041);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			mount_component(tableau_1, div3, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tableau_1_changes = {};

    			if (dirty[0] & /*gameOver, $tableau*/ 3 | dirty[1] & /*$$scope*/ 262144) {
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
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div4);
    			destroy_component(tableau_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $ligAlien;
    	let $colAlien;
    	let $bottomSide;
    	let $leftSide;
    	let $previousLigAlien;
    	let $previousColAlien;
    	let $leftAlien;
    	let $directionAlien;
    	let $topAlien;
    	let $tableau;
    	let $previousLigHero;
    	let $ligHero;
    	let $previousColHero;
    	let $colHero;
    	let $direction;
    	let $nbrLig;
    	let $nbrCol;
    	let $retry;
    	validate_store(ligAlien, "ligAlien");
    	component_subscribe($$self, ligAlien, $$value => $$invalidate(11, $ligAlien = $$value));
    	validate_store(colAlien, "colAlien");
    	component_subscribe($$self, colAlien, $$value => $$invalidate(12, $colAlien = $$value));
    	validate_store(bottomSide, "bottomSide");
    	component_subscribe($$self, bottomSide, $$value => $$invalidate(13, $bottomSide = $$value));
    	validate_store(leftSide, "leftSide");
    	component_subscribe($$self, leftSide, $$value => $$invalidate(14, $leftSide = $$value));
    	validate_store(previousLigAlien, "previousLigAlien");
    	component_subscribe($$self, previousLigAlien, $$value => $$invalidate(15, $previousLigAlien = $$value));
    	validate_store(previousColAlien, "previousColAlien");
    	component_subscribe($$self, previousColAlien, $$value => $$invalidate(16, $previousColAlien = $$value));
    	validate_store(leftAlien, "leftAlien");
    	component_subscribe($$self, leftAlien, $$value => $$invalidate(17, $leftAlien = $$value));
    	validate_store(directionAlien, "directionAlien");
    	component_subscribe($$self, directionAlien, $$value => $$invalidate(18, $directionAlien = $$value));
    	validate_store(topAlien, "topAlien");
    	component_subscribe($$self, topAlien, $$value => $$invalidate(19, $topAlien = $$value));
    	validate_store(tableau, "tableau");
    	component_subscribe($$self, tableau, $$value => $$invalidate(1, $tableau = $$value));
    	validate_store(previousLigHero, "previousLigHero");
    	component_subscribe($$self, previousLigHero, $$value => $$invalidate(20, $previousLigHero = $$value));
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(21, $ligHero = $$value));
    	validate_store(previousColHero, "previousColHero");
    	component_subscribe($$self, previousColHero, $$value => $$invalidate(22, $previousColHero = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(23, $colHero = $$value));
    	validate_store(direction, "direction");
    	component_subscribe($$self, direction, $$value => $$invalidate(24, $direction = $$value));
    	validate_store(nbrLig, "nbrLig");
    	component_subscribe($$self, nbrLig, $$value => $$invalidate(25, $nbrLig = $$value));
    	validate_store(nbrCol, "nbrCol");
    	component_subscribe($$self, nbrCol, $$value => $$invalidate(26, $nbrCol = $$value));
    	validate_store(retry, "retry");
    	component_subscribe($$self, retry, $$value => $$invalidate(29, $retry = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Level", slots, []);

    	onMount(async () => {
    		document.getElementById("backToMenu").style.opacity = 1;
    	});

    	// onDestroy
    	onDestroy(() => {
    		document.getElementById("backToMenu").style.opacity = 0;
    		set_store_value(ligAlien, $ligAlien = 1);
    		set_store_value(colAlien, $colAlien = 1);
    		set_store_value(bottomSide, $bottomSide = 1);
    		set_store_value(leftSide, $leftSide = 1);
    		document.removeEventListener("keydown", event, false);
    		window.cancelAnimationFrame(MyRequest);
    	});

    	// variables
    	let gameOver = false;

    	let down = false;
    	let up = false;
    	let right = false;
    	let left = false;
    	let collision;
    	let alienSpeed = 2.5;
    	let alienDamage = 10;

    	// -------------------- ALIEN  -------------------------- //
    	function alien(speed) {
    		this.speed = speed;

    		this.advance = function () {
    			set_store_value(previousLigAlien, $previousLigAlien = $ligAlien);
    			set_store_value(previousColAlien, $previousColAlien = $colAlien);

    			if ($colAlien < 9 && $ligAlien === 1) {
    				if ($leftAlien === 50) {
    					set_store_value(leftAlien, $leftAlien = 0);
    					set_store_value(colAlien, $colAlien++, $colAlien);
    				} else {
    					set_store_value(directionAlien, $directionAlien = "step-right");
    					set_store_value(leftAlien, $leftAlien += this.speed);
    				}
    			} else if ($colAlien === 9 && $ligAlien < 5) {
    				set_store_value(leftAlien, $leftAlien = 0);

    				if ($topAlien === 50) {
    					set_store_value(topAlien, $topAlien = 0);
    					set_store_value(ligAlien, $ligAlien++, $ligAlien);
    				} else {
    					set_store_value(directionAlien, $directionAlien = "step-down");
    					set_store_value(topAlien, $topAlien += this.speed);
    				}
    			} else if ($ligAlien === 5 && $colAlien > 1) {
    				set_store_value(topAlien, $topAlien = 0);

    				if ($leftAlien === -50) {
    					set_store_value(leftAlien, $leftAlien = 0);
    					set_store_value(colAlien, $colAlien--, $colAlien);
    				} else {
    					set_store_value(directionAlien, $directionAlien = "step-left");
    					set_store_value(leftAlien, $leftAlien -= this.speed);
    				}
    			} else if ($colAlien === 1 && $ligAlien > 1) {
    				set_store_value(leftAlien, $leftAlien = 0);

    				if ($topAlien === -50) {
    					set_store_value(topAlien, $topAlien = 0);
    					set_store_value(ligAlien, $ligAlien--, $ligAlien);
    				} else {
    					set_store_value(directionAlien, $directionAlien = "step-up");
    					set_store_value(topAlien, $topAlien -= this.speed);
    				}
    			}
    		};
    	}

    	const drawMoveAlien = () => {
    		set_store_value(tableau, $tableau[$previousLigAlien][$previousColAlien] = 0, $tableau);
    		set_store_value(tableau, $tableau[$ligAlien][$colAlien] = "z", $tableau);
    	};

    	// -------------------- ALIEN  -------------------------- //
    	// -------------------- HERO -------------------------- //
    	const updateMoveHero = () => {
    		set_store_value(previousLigHero, $previousLigHero = $ligHero);
    		set_store_value(previousColHero, $previousColHero = $colHero);

    		switch (true) {
    			case down:
    				set_store_value(direction, $direction = "step-down");
    				if ($ligHero >= $nbrLig - 2 && $bottomSide <= 5) {
    					set_store_value(direction, $direction = "down");
    				} else {
    					set_store_value(bottomSide, $bottomSide = $bottomSide - 1);
    				}
    				if ($bottomSide === 0) {
    					set_store_value(ligHero, $ligHero++, $ligHero);
    					set_store_value(bottomSide, $bottomSide = 49);
    				}
    				break;
    			case up:
    				set_store_value(direction, $direction = "step-up");
    				if ($ligHero <= 1) {
    					set_store_value(direction, $direction = "up");
    				} else {
    					set_store_value(bottomSide, $bottomSide = $bottomSide + 1);

    					if ($bottomSide === 50) {
    						set_store_value(ligHero, $ligHero--, $ligHero);
    						set_store_value(bottomSide, $bottomSide = 1);
    					}
    				}
    				break;
    			case left:
    				set_store_value(direction, $direction = "step-left");
    				if ($colHero <= 1 && $leftSide <= 5) {
    					set_store_value(direction, $direction = "left");
    				} else {
    					set_store_value(leftSide, $leftSide = $leftSide - 1);

    					if ($leftSide === 0) {
    						set_store_value(colHero, $colHero--, $colHero);
    						set_store_value(leftSide, $leftSide = 49);
    					}
    				}
    				break;
    			case right:
    				set_store_value(direction, $direction = "step-right");
    				if ($colHero >= $nbrCol - 1) {
    					set_store_value(direction, $direction = "right");
    				} else {
    					set_store_value(leftSide, $leftSide = $leftSide + 1);

    					if ($leftSide === 50) {
    						set_store_value(colHero, $colHero++, $colHero);
    						set_store_value(leftSide, $leftSide = 1);
    					}
    				}
    				break;
    		}
    	};

    	const drawMoveHero = () => {
    		set_store_value(tableau, $tableau[$previousLigHero][$previousColHero] = 0, $tableau);
    		set_store_value(tableau, $tableau[$ligHero][$colHero] = "p", $tableau);
    	};

    	function event(event) {
    		switch (event.key) {
    			case "ArrowDown":
    				if (down) return;
    				down = true;
    				left = false;
    				up = false;
    				right = false;
    				break;
    			case "ArrowUp":
    				if (up) return;
    				down = false;
    				left = false;
    				up = true;
    				right = false;
    				break;
    			case "ArrowLeft":
    				if (left) return;
    				down = false;
    				left = true;
    				up = false;
    				right = false;
    				break;
    			case "ArrowRight":
    				if (right) return;
    				down = false;
    				left = false;
    				up = false;
    				right = true;
    				break;
    		}
    	}

    	document.addEventListener("keydown", event, false);

    	document.addEventListener("keyup", event => {
    		switch (event.key) {
    			case "ArrowDown":
    				down = false;
    				set_store_value(direction, $direction = "down");
    				break;
    			case "ArrowUp":
    				up = false;
    				set_store_value(direction, $direction = "up");
    				break;
    			case "ArrowLeft":
    				left = false;
    				set_store_value(direction, $direction = "left");
    				break;
    			case "ArrowRight":
    				right = false;
    				set_store_value(direction, $direction = "right");
    				break;
    		}
    	});

    	// -------------------- HERO -------------------------- //
    	// -------------------- CHECK COLLISION -------------------------- //
    	function checkCollision() {
    		if ($ligAlien === $ligHero && $colAlien === $colHero - 1) {
    			collision = true;
    		} else if ($ligAlien + 1 === $ligHero && $colAlien === $colHero && $bottomSide > 3) {
    			collision = true;
    		} else if ($colAlien === $colHero + 1 && $ligAlien === $ligHero && $leftSide > 3) {
    			collision = true;
    		} else {
    			collision = false;
    		}
    	}

    	// -------------------- CHECK COLLISION -------------------------- //
    	// -------------------- COUNT SCORE -------------------------- //
    	let count = 0;

    	let life;

    	function Score() {
    		if (collision) {
    			$$invalidate(8, count = count + 1);
    		}

    		life = document.querySelector(".life");
    		life.style.width = pv + "%";

    		if (pv <= 0) {
    			$$invalidate(0, gameOver = true);
    		} else if (pv > 0 && pv < 25) {
    			life.style.backgroundColor = "red";
    		} else if (pv > 24 && pv < 50) {
    			life.style.backgroundColor = "orange";
    		}
    	}

    	// -------------------- COUNT SCORE -------------------------- //
    	// -------------------- GAMELOOP -------------------------- //
    	var iti = new alien(alienSpeed); //ajouter les coordonnées x et y en argument !

    	const update = () => {
    		updateMoveHero();
    		iti.advance();
    	};

    	const draw = () => {
    		drawMoveHero();
    		drawMoveAlien();
    	};

    	var MyRequest;

    	const gameLoop = () => {
    		if (!gameOver) {
    			update();
    			draw();
    			checkCollision();
    			Score();
    			MyRequest = requestAnimationFrame(gameLoop);
    		} else {
    			window.cancelAnimationFrame(MyRequest);
    		}
    	};

    	MyRequest = window.requestAnimationFrame(gameLoop);

    	// -------------------- GAMELOOP -------------------------- //
    	function handleRetry() {
    		$$invalidate(0, gameOver = false);
    		set_store_value(retry, $retry = !$retry);
    		set_store_value(ligHero, $ligHero = set_store_value(colHero, $colHero = 5));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Level> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Tableau,
    		Case,
    		onDestroy,
    		onMount,
    		tableau,
    		nbrCol,
    		nbrLig,
    		ligHero,
    		colHero,
    		previousLigHero,
    		previousColHero,
    		direction,
    		leftSide,
    		bottomSide,
    		ligAlien,
    		colAlien,
    		previousLigAlien,
    		previousColAlien,
    		leftAlien,
    		topAlien,
    		retry,
    		directionAlien,
    		gameOver,
    		down,
    		up,
    		right,
    		left,
    		collision,
    		alienSpeed,
    		alienDamage,
    		alien,
    		drawMoveAlien,
    		updateMoveHero,
    		drawMoveHero,
    		event,
    		checkCollision,
    		count,
    		life,
    		Score,
    		iti,
    		update,
    		draw,
    		MyRequest,
    		gameLoop,
    		handleRetry,
    		$ligAlien,
    		$colAlien,
    		$bottomSide,
    		$leftSide,
    		$previousLigAlien,
    		$previousColAlien,
    		$leftAlien,
    		$directionAlien,
    		$topAlien,
    		$tableau,
    		$previousLigHero,
    		$ligHero,
    		$previousColHero,
    		$colHero,
    		$direction,
    		$nbrLig,
    		$nbrCol,
    		realCount,
    		pv,
    		$retry
    	});

    	$$self.$inject_state = $$props => {
    		if ("gameOver" in $$props) $$invalidate(0, gameOver = $$props.gameOver);
    		if ("down" in $$props) down = $$props.down;
    		if ("up" in $$props) up = $$props.up;
    		if ("right" in $$props) right = $$props.right;
    		if ("left" in $$props) left = $$props.left;
    		if ("collision" in $$props) collision = $$props.collision;
    		if ("alienSpeed" in $$props) alienSpeed = $$props.alienSpeed;
    		if ("alienDamage" in $$props) $$invalidate(31, alienDamage = $$props.alienDamage);
    		if ("count" in $$props) $$invalidate(8, count = $$props.count);
    		if ("life" in $$props) life = $$props.life;
    		if ("iti" in $$props) iti = $$props.iti;
    		if ("MyRequest" in $$props) MyRequest = $$props.MyRequest;
    		if ("realCount" in $$props) $$invalidate(27, realCount = $$props.realCount);
    		if ("pv" in $$props) pv = $$props.pv;
    	};

    	let realCount;
    	let pv;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*count*/ 256) {
    			 $$invalidate(27, realCount = Math.floor(count / 10));
    		}

    		if ($$self.$$.dirty[0] & /*realCount*/ 134217728) {
    			 pv = 70 - realCount * alienDamage;
    		}
    	};

    	return [gameOver, $tableau, handleRetry];
    }

    class Level extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Level",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.25.0 */

    const { console: console_1$7 } = globals;
    const file$9 = "src/App.svelte";

    // (54:0) {:else}
    function create_else_block(ctx) {
    	let level;
    	let current;
    	level = new Level({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(level.$$.fragment);
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
    		id: create_else_block.name,
    		type: "else",
    		source: "(54:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:17) 
    function create_if_block_1$1(ctx) {
    	let level;
    	let current;
    	level = new Level({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(level.$$.fragment);
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
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(52:17) ",
    		ctx
    	});

    	return block;
    }

    // (50:0) {#if !$newGame}
    function create_if_block$2(ctx) {
    	let accueil;
    	let updating_newGame;
    	let current;

    	function accueil_newGame_binding(value) {
    		/*accueil_newGame_binding*/ ctx[6].call(null, value);
    	}

    	let accueil_props = {};

    	if (/*$newGame*/ ctx[1] !== void 0) {
    		accueil_props.newGame = /*$newGame*/ ctx[1];
    	}

    	accueil = new Accueil({ props: accueil_props, $$inline: true });
    	binding_callbacks.push(() => bind(accueil, "newGame", accueil_newGame_binding));

    	const block = {
    		c: function create() {
    			create_component(accueil.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(accueil, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const accueil_changes = {};

    			if (!updating_newGame && dirty & /*$newGame*/ 2) {
    				updating_newGame = true;
    				accueil_changes.newGame = /*$newGame*/ ctx[1];
    				add_flush_callback(() => updating_newGame = false);
    			}

    			accueil.$set(accueil_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(accueil.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(accueil.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(accueil, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(50:0) {#if !$newGame}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let tailwindcss;
    	let t0;
    	let div1;
    	let div0;
    	let p0;
    	let t2;
    	let p1;
    	let t4;
    	let audio;
    	let track;
    	let audio_src_value;
    	let t5;
    	let img;
    	let img_src_value;
    	let t6;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	tailwindcss = new Tailwindcss({ $$inline: true });
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*$newGame*/ ctx[1]) return 0;
    		if (/*$retry*/ ctx[2]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			p0.textContent = "ZOMBAV IV";
    			t2 = space();
    			p1 = element("p");
    			p1.textContent = "BacK to Menu";
    			t4 = space();
    			audio = element("audio");
    			track = element("track");
    			t5 = space();
    			img = element("img");
    			t6 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(p0, "class", "title svelte-u7kpi5");
    			add_location(p0, file$9, 39, 6, 1024);
    			attr_dev(div0, "class", "title text-6xl text-center svelte-u7kpi5");
    			add_location(div0, file$9, 38, 4, 977);
    			attr_dev(p1, "id", "backToMenu");
    			attr_dev(p1, "class", " text-center opacity-0 text-white border w-1/10 pl-2 pr-2 h-12 text-base absolute top-0 right-0 svelte-u7kpi5");
    			add_location(p1, file$9, 41, 4, 1071);
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$9, 43, 4, 1321);
    			attr_dev(audio, "id", "player");
    			if (audio.src !== (audio_src_value = "./audio/laylow.mp3")) attr_dev(audio, "src", audio_src_value);
    			add_location(audio, file$9, 42, 4, 1271);
    			attr_dev(img, "id", "mute");
    			attr_dev(img, "class", "h-16 w-16 absolute m-8 left-0 top-0 svelte-u7kpi5");
    			if (img.src !== (img_src_value = /*src*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "volume");
    			add_location(img, file$9, 45, 2, 1361);
    			attr_dev(div1, "class", "header  relative w-full");
    			add_location(div1, file$9, 37, 0, 935);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(div1, t2);
    			append_dev(div1, p1);
    			append_dev(div1, t4);
    			append_dev(div1, audio);
    			append_dev(audio, track);
    			append_dev(div1, t5);
    			append_dev(div1, img);
    			insert_dev(target, t6, anchor);
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(p1, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(p1, "click", /*initHero*/ ctx[4], false, false, false),
    					listen_dev(img, "click", /*handleAudio*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*src*/ 1 && img.src !== (img_src_value = /*src*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t6);
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $sound;
    	let $ligHero;
    	let $colHero;
    	let $newGame;
    	let $retry;
    	validate_store(sound, "sound");
    	component_subscribe($$self, sound, $$value => $$invalidate(7, $sound = $$value));
    	validate_store(ligHero, "ligHero");
    	component_subscribe($$self, ligHero, $$value => $$invalidate(8, $ligHero = $$value));
    	validate_store(colHero, "colHero");
    	component_subscribe($$self, colHero, $$value => $$invalidate(9, $colHero = $$value));
    	validate_store(newGame, "newGame");
    	component_subscribe($$self, newGame, $$value => $$invalidate(1, $newGame = $$value));
    	validate_store(retry, "retry");
    	component_subscribe($$self, retry, $$value => $$invalidate(2, $retry = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let src = "./img/mute.svg";

    	function handleAudio() {
    		var Player = document.getElementById("player");

    		if ($sound == true) {
    			Player.play();
    			$$invalidate(0, src = "./img/volume.svg");
    		} else {
    			Player.pause();
    			$$invalidate(0, src = "./img/mute.svg");
    		}

    		set_store_value(sound, $sound = !$sound);
    	}

    	function initHero() {
    		set_store_value(ligHero, $ligHero = 5);
    		set_store_value(colHero, $colHero = 5);
    		console.log("initHero");
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$7.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => set_store_value(newGame, $newGame = false);

    	function accueil_newGame_binding(value) {
    		$newGame = value;
    		newGame.set($newGame);
    	}

    	$$self.$capture_state = () => ({
    		Tailwindcss,
    		Accueil,
    		Level,
    		newGame,
    		sound,
    		ligHero,
    		colHero,
    		retry,
    		src,
    		handleAudio,
    		initHero,
    		$sound,
    		$ligHero,
    		$colHero,
    		$newGame,
    		$retry
    	});

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(0, src = $$props.src);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		src,
    		$newGame,
    		$retry,
    		handleAudio,
    		initHero,
    		click_handler,
    		accueil_newGame_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
