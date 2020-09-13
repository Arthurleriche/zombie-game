import App from './App.svelte';


const app = new App({
	target: document.querySelector('#tab'),
	props: {
		name: 'world'
	}
});

export default app;