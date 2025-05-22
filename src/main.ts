import { Plugin } from 'obsidian';
import { CatSettingTab } from "./settings";
import { getCatImage } from "./cats";

interface CatReminderSettings {
	CatAPIKey: string | undefined,

	/**
	 * Duration of the cat reminder in seconds
	 */
	duration: number,
	periodicRemindersEnabled: boolean,

	/**
	 * Frequency of the periodic reminders in minutes
	 */
	frequency: number,
}

const DEFAULT_SETTINGS: CatReminderSettings = {
	CatAPIKey: undefined,
	duration: 5,
	periodicRemindersEnabled: true,
	frequency: 30,
}

export default class CatReminder extends Plugin {
	settings: CatReminderSettings;
	reminderId: number | undefined;
	catEl : HTMLElement | undefined;
	imageEl: HTMLElement | undefined;

	async onload() {
		await this.loadSettings();

		// lets user get cat through ribbon
		this.addRibbonIcon('cat', 'Get cat', (evt: MouseEvent) => this.getCat());

		// lets user get cat through command palette 
		this.addCommand({
			id: 'get-cat',
			name: 'Get cat',
			callback: () => this.getCat()
		});

		// add settings tab
		this.addSettingTab(new CatSettingTab(this.app, this));
	}

	onunload() {}

	/**
	 * Tries to fetch an image from the CatAPI and displays it on success.
	 */
	async getCat() {
		// clear previous cat if it exists
		this.clearCat();

		// create container for image
		this.catEl = document.body.createDiv('cat-reminder-container');
		this.catEl.style.position = 'fixed';
		this.catEl.style.zIndex = '9999';
		this.catEl.style.padding = '10px';
		this.catEl.style.pointerEvents = 'none';

		this.catEl.style.top = '10px';
		this.catEl.style.right = '10px';

		this.imageEl = this.catEl.createEl('img', {});
		this.imageEl.style.maxWidth = '200px';
		this.imageEl.style.maxHeight = '200px';
		this.imageEl.style.objectFit = 'contain'; 
		this.imageEl.style.display = 'block';
		this.imageEl.style.borderRadius = '5%';

        try {
			// try to get image from CatAPI
			let [imageUrl, imageName] = await getCatImage(this.settings.CatAPIKey);

            this.imageEl.setAttribute('src', imageUrl);
            this.imageEl.setAttribute('alt', imageName);

			// clear image after duration
			setTimeout(() => this.clearCat(), this.settings.duration * 1000);
        } catch (error) {
            this.clearCat(); 
        }
	}

	/**
	 * Clears the cat image and container.
	 */
	clearCat() {
		if (!this.catEl) return;

		this.catEl.remove();
		this.catEl = undefined;
		this.imageEl = undefined;
	}

	/**
	 * Clears current periodic reminder interval, and, if they're enabled, starts it with current settings.
	 */
	updateReminders() {
		// Clear current interval
		if (this.reminderId !== undefined) {
			clearInterval(this.reminderId);	
		}

		this.reminderId = undefined;

		// Periodic reminders have just been turned on
		if (this.settings.periodicRemindersEnabled) {
			// Start interval to get a cat every frequency minutes
			this.reminderId = window.setInterval(
				() => this.getCat(),
				this.settings.frequency * 60 * 1000,
			);

			// Register interval to automatically clear when plugin is disabled
			this.registerInterval(this.reminderId);

		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
