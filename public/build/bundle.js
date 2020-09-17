
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function detach(node) {
        node.parentNode.removeChild(node);
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
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
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

    /* src/Tailwindcss.svelte generated by Svelte v3.24.1 */

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
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Tailwindcss", $$slots, []);
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

    /* src/App.svelte generated by Svelte v3.24.1 */

    const { console: console_1 } = globals;

    function create_fragment$1(ctx) {
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
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const nbLigne = 50;
    const nbCol = 50;

    function instance$1($$self, $$props, $$invalidate) {
    	const jeu = document.querySelector("#tab");
    	let tableau = [];
    	let l = 0;
    	let c = 0;
    	let lastEvent = "";
    	let position = " ";
    	let foot = 1;
    	let down = false;
    	let up = false;
    	let right = false;
    	let left = false;
    	let array = [];

    	// init du tableau
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

    	tableau = createTab(nbLigne, nbCol);

    	const initGame = newTab => {
    		newTab[0][0] = 1;
    		showTab(newTab);
    	};

    	// fin init du tableau
    	// afficher le tableau
    	const showTab = tab => {
    		let content = "<table>";

    		for (let i = 0; i < nbLigne; i++) {
    			content += "<tr class='ligne'>";

    			for (let j = 0; j < nbCol; j++) {
    				content += "<td class='border cel'>";

    				if (tab[i][j] === 0) ;

    				if (tab[i][j] === 1) {
    					content += `<div class="personnage"> <div class="Characters"><img class="Character ${position}${foot}" src="./img/Heroe.png" alt="Character"> </div></div>`;
    				}

    				if (tab[i][j] === 2) {
    					content += "";
    				}

    				if (tab[i][j] === 3) {
    					content += "<img src='https://media.giphy.com/media/Qvp6Z2fidQR34IcwQ5/source.gif'>";
    				}

    				content += "</td>";
    			}

    			content += " </tr>";
    		}

    		content += "</table>";
    		jeu.innerHTML = content;
    	};

    	// fin afficher tableau
    	const updateGame = newTab => {
    		showTab(newTab);
    	};

    	// création du tableau
    	tableau = createTab(nbLigne, nbCol);

    	initGame(tableau);

    	// fin création du tableau
    	// direction character
    	const switchDirection = (event, newTab) => {
    		if (event.key === "ArrowDown" && l <= 47) {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (down === false) {
    					clearInterval(interval);
    					foot = 1;
    					showTab(newTab);
    				} else {
    					if (l >= 47) {
    						clearInterval(interval);
    					}

    					newTab[l][c] = 2;
    					l++;
    					newTab[l][c] = 1;
    					position = "down";

    					if (foot === 4) {
    						foot = 1;
    						position = "";
    					}

    					foot++;
    					showTab(newTab);
    				}
    			}
    		}

    		if (event.key === "ArrowUp" && l >= 2) {
    			const interval = setInterval(stopFunction, 110);

    			function stopFunction() {
    				if (up === false) {
    					clearInterval(interval);
    					foot = 1;
    					showTab(newTab);
    				} else {
    					if (l <= 2) {
    						clearInterval(interval);
    					}

    					tableau[l][c] = 2;
    					l--;
    					newTab[l][c] = 1;
    					position = "up";

    					if (foot === 4) {
    						foot = 1;
    						position = "up";
    					}

    					foot++;
    					showTab(newTab);
    				}
    			}
    		}

    		if (event.key === "ArrowRight" && c <= 49) {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (right === false) {
    					clearInterval(interval);
    					foot = 1;
    					showTab(newTab);
    				} else {
    					if (c >= 49) {
    						clearInterval(interval);
    					} else {
    						tableau[l][c] = 2;
    						c++;
    						newTab[l][c] = 1;
    						position = "right";

    						if (foot === 4) {
    							foot = 1;
    						}

    						foot++;
    						showTab(newTab);
    					}
    				}
    			}
    		}

    		if (event.key === "ArrowLeft") {
    			const interval = setInterval(stopFunction, 90);

    			function stopFunction() {
    				if (left === false) {
    					clearInterval(interval);
    					foot = 1;
    					showTab(newTab);
    				} else {
    					if (c < 2) {
    						clearInterval(interval);
    					} else {
    						tableau[l][c] = 2;
    						c--;
    						newTab[l][c] = 1;
    						position = "left";

    						if (foot === 4) {
    							foot = 1;
    						}

    						foot++;
    						showTab(newTab);
    					}
    				}
    			}
    		}
    	};

    	// fin direction character
    	// event Player
    	document.addEventListener(
    		"keydown",
    		event => {
    			array = [event.key, ...array];
    			array.splice(2);

    			switch (event.key) {
    				case "ArrowDown":
    					if (down) return;
    					down = true;
    					position = "down";
    					break;
    				case "ArrowUp":
    					if (up) return;
    					up = true;
    					break;
    				case "ArrowLeft":
    					if (left) return;
    					left = true;
    					console.log(left);
    					break;
    				case "ArrowRight":
    					if (right) return;
    					right = true;
    					console.log("je suis right");
    					break;
    			}

    			switchDirection(event, tableau);
    		},
    		false
    	);

    	document.addEventListener("keyup", () => {
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
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		Tailwindcss,
    		jeu,
    		nbLigne,
    		nbCol,
    		tableau,
    		l,
    		c,
    		lastEvent,
    		position,
    		foot,
    		down,
    		up,
    		right,
    		left,
    		array,
    		createTab,
    		initGame,
    		showTab,
    		updateGame,
    		switchDirection
    	});

    	$$self.$inject_state = $$props => {
    		if ("tableau" in $$props) tableau = $$props.tableau;
    		if ("l" in $$props) l = $$props.l;
    		if ("c" in $$props) c = $$props.c;
    		if ("lastEvent" in $$props) lastEvent = $$props.lastEvent;
    		if ("position" in $$props) position = $$props.position;
    		if ("foot" in $$props) foot = $$props.foot;
    		if ("down" in $$props) down = $$props.down;
    		if ("up" in $$props) up = $$props.up;
    		if ("right" in $$props) right = $$props.right;
    		if ("left" in $$props) left = $$props.left;
    		if ("array" in $$props) array = $$props.array;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
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
