import { writable } from 'svelte/store';

export const weapons = writable({});

class WeaponController {
    weapons = {};
    store = null;
    constructor() {
        this.store = weapons;
        this.store.subscribe((_weapons) => {
            this.weapons = _weapons;
        });
    }

    register(character, name, weaponClass) {
        if (!this.weapons[character]) this.weapons[character] = {};
        this.weapons[character][name] = weaponClass;
        this.store.set(this.weapons);
    }

    getWeapon(character, name) {
        return this.weapons?.[character]?.[name];
    }
}

export default new WeaponController();