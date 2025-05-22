import { App, PluginSettingTab, Setting } from "obsidian";
import CatReminder from "./main";

export class CatSettingTab extends PluginSettingTab {
	plugin: CatReminder;

	constructor(app: App, plugin: CatReminder) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		// Currently not used, but could be used to set the API key
		// new Setting(containerEl)
		// 	.setName('Cat API key')
		// 	.setDesc('cats!!!!')
		// 	.addText(text => text
		// 		.setPlaceholder('Enter your API Key')
		// 		.setValue((this.plugin.settings.CatAPIKey  === undefined) ? "Cat API Key" : this.plugin.settings.CatAPIKey)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.CatAPIKey = value;
		// 			await this.plugin.saveSettings();
		// 		}));

		new Setting(containerEl)
			.setName('Cat Duration')
			.setDesc('How long the cat will be shown (between 1 and 60 seconds)')
			.addSlider((number) => 
				number
					.setValue(this.plugin.settings.duration)
					.onChange(async (value) => {
						this.plugin.settings.duration = 1 + 59 * value/100;
						await this.plugin.saveSettings();
						this.plugin.updateReminders();
					})
		);

		new Setting(containerEl)
			.setName('Reminder Settings')
			.setDesc('Turns on periodic random cat images')
			.addToggle((cb) => 
				cb
					.setValue(this.plugin.settings.periodicRemindersEnabled)
					.onChange(async (value) => {
						this.plugin.settings.periodicRemindersEnabled = value;
						await this.plugin.saveSettings();
						this.plugin.updateReminders();
					})
		);

		if (this.plugin.settings.periodicRemindersEnabled) {
			new Setting(containerEl)
				.setName('Reminder Frequency')
				.setDesc('Frequency of random cat reminders (between 1 and 60 minutes)')
				.addSlider((number) => 
					number
						.setValue(this.plugin.settings.frequency)
						.onChange(async (value) => {
							this.plugin.settings.frequency = 1 + 59 * value/100;
							await this.plugin.saveSettings();
						})
			);
		}
	}
}
