import App from './App.svelte';


const app = new App({
	target: document.querySelector(".divTab"),
	props: {
		name: 'world'
	}
});

export default app;