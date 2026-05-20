'use strict';

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Bookstore-TopBar-User',
	DefaultRenderable:         'Bookstore-TopBar-User-Display',
	DefaultDestinationAddress: '#Theme-TopBar-User',
	AutoRender:                false,
	CSS: /*css*/`
		.bookstore-user {
			display: flex;
			align-items: center;
			height: 100%;
			gap: 8px;
			padding: 0 12px;
		}
		.bookstore-user-btn {
			padding: 4px 8px;
			border: 1px solid var(--theme-color-border-default, #5E5549);
			background: transparent;
			color: var(--theme-color-text-on-brand,
				   var(--theme-color-text-secondary, #1a1a1a));
			border-radius: 4px;
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			font-size: 1em;
			line-height: 1;
		}
		.bookstore-user-btn:hover {
			background: var(--theme-color-background-hover, rgba(255,255,255,0.08));
		}
	`,
	Templates:
	[
		{
			Hash: 'Bookstore-TopBar-User-Template',
			Template: /*html*/`<div class="bookstore-user"><button class="bookstore-user-btn" onclick="_Pict.views['Bookstore-Layout'].toggleSettingsPanel()" title="Settings" aria-label="Settings">{~I:Settings~}</button></div>`
		}
	],
	Renderables:
	[
		{
			RenderableHash:            'Bookstore-TopBar-User-Display',
			TemplateHash:              'Bookstore-TopBar-User-Template',
			ContentDestinationAddress: '#Theme-TopBar-User',
			RenderMethod:              'replace'
		}
	]
};

class PictViewBookstoreTopBarUser extends libPictView
{
	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		if (this.pict && this.pict.CSSMap) { this.pict.CSSMap.injectCSS(); }
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = PictViewBookstoreTopBarUser;
module.exports.default_configuration = _ViewConfiguration;
