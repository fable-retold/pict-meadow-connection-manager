'use strict';

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Bookstore-SettingsPanel',
	DefaultRenderable:         'Bookstore-SettingsPanel-Display',
	DefaultDestinationAddress: '#Bookstore-Settings-Panel',
	AutoRender:                false,
	CSS: /*css*/`
		.bookstore-settings-body {
			padding: 12px;
			display: flex;
			flex-direction: column;
			gap: 16px;
			color: var(--theme-color-text-primary, #1a1a1a);
		}
		.bookstore-settings-section {
			display: flex;
			flex-direction: column;
			gap: 6px;
		}
		.bookstore-settings-label {
			font-size: 0.85em;
			font-weight: 600;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			color: var(--theme-color-text-secondary, #444444);
		}
	`,
	Templates:
	[
		{
			Hash: 'Bookstore-SettingsPanel-Template',
			Template: /*html*/`
<div class="bookstore-settings-body">
	<div class="bookstore-settings-section">
		<div class="bookstore-settings-label">Appearance</div>
		<div id="Bookstore-Settings-Theme"></div>
	</div>
</div>`
		}
	],
	Renderables:
	[
		{
			RenderableHash:            'Bookstore-SettingsPanel-Display',
			TemplateHash:              'Bookstore-SettingsPanel-Template',
			ContentDestinationAddress: '#Bookstore-Settings-Panel',
			RenderMethod:              'replace'
		}
	]
};

class PictViewBookstoreSettingsPanel extends libPictView
{
	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		if (this.pict && this.pict.CSSMap) { this.pict.CSSMap.injectCSS(); }

		// Re-mount theme controls on every render — the template wipes the destination div.
		let tmpTheme = this.pict.providers && this.pict.providers['Theme-Section'];
		if (tmpTheme && typeof tmpTheme.mount === 'function')
		{
			tmpTheme.mount(
			{
				Container: '#Bookstore-Settings-Theme',
				Views: ['Picker', 'ModeToggle', 'ScaleSelect']
			});
		}

		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = PictViewBookstoreSettingsPanel;
module.exports.default_configuration = _ViewConfiguration;
