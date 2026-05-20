'use strict';

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Bookstore-TopBar-Nav',
	DefaultRenderable:         'Bookstore-TopBar-Nav-Display',
	DefaultDestinationAddress: '#Theme-TopBar-Nav',
	AutoRender:                false,
	CSS: /*css*/`
		.bookstore-nav {
			display: flex;
			align-items: center;
			height: 100%;
			padding: 0 12px;
			gap: 8px;
			color: var(--theme-color-text-on-brand,
				   var(--theme-color-text-primary, #1a1a1a));
			font-weight: 500;
		}
		.bookstore-nav-title   { opacity: 0.95; }
		.bookstore-nav-current { font-weight: 600; opacity: 0.9; }
		.bookstore-nav-current:not(:empty)::before {
			content: " · ";
			opacity: 0.5;
			font-weight: 400;
			margin: 0 2px;
		}
	`,
	Templates:
	[
		{
			Hash: 'Bookstore-TopBar-Nav-Template',
			Template: /*html*/`<div class="bookstore-nav"><span class="bookstore-nav-title">Connections</span><span class="bookstore-nav-current">{~D:AppData.MCM.CurrentConnection.Name~}</span></div>`
		}
	],
	Renderables:
	[
		{
			RenderableHash:            'Bookstore-TopBar-Nav-Display',
			TemplateHash:              'Bookstore-TopBar-Nav-Template',
			ContentDestinationAddress: '#Theme-TopBar-Nav',
			RenderMethod:              'replace'
		}
	]
};

class PictViewBookstoreTopBarNav extends libPictView
{
	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		if (this.pict && this.pict.CSSMap) { this.pict.CSSMap.injectCSS(); }
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = PictViewBookstoreTopBarNav;
module.exports.default_configuration = _ViewConfiguration;
