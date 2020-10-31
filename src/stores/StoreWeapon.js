import {writable} from 'svelte/store';

export const sabreActive = writable(false)

export const sabreX = writable(0)
export const sabreY = writable(0)

export const classProp=writable('')
export const gunActive = writable(false)
export const gunHero = writable(false)
export const machineGunActive = writable(false)
export const isFired = writable(false)
export const gunX = writable(0)
export const gunY = writable(0)
export const gunBullet = writable(10)
export const machineGunBullet = writable(10)

export const chooseWeapon = writable("sabre")

export const bullets = writable([])