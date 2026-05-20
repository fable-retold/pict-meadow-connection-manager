'use strict';

const libPictView = require('pict-view');

const _ViewConfiguration =
{
	ViewIdentifier:            'Bookstore-Layout',
	DefaultRenderable:         'Bookstore-Layout-Shell',
	DefaultDestinationAddress: '#Bookstore-Application-Container',
	AutoRender:                false,
	CSS: /*css*/`
		html, body { height: 100%; margin: 0; padding: 0; }
		body {
			background: var(--theme-color-background-primary, #f5f3ee);
			color:      var(--theme-color-text-primary,       #1a1a1a);
			font-family: var(--theme-typography-family-sans,
				-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
		}
		#Bookstore-Application-Container {
			height: 100%;
			min-height: 0;
			overflow: hidden;
		}
		.pict-modal-shell-host    { height: 100%; }
		.pict-modal-shell         { background: var(--theme-color-background-primary, #f5f3ee); }
		.pict-modal-shell-panel   { background: var(--theme-color-background-panel,   #ffffff); }
		.pict-modal-shell-center  {
			background: var(--theme-color-background-primary, #f5f3ee);
			padding: 16px;
			overflow: auto;
		}
		/* When MCM views are nested inside the shell, drop their outer card chrome —
		   the shell panel + center already provide background + padding. */
		.pict-modal-shell-panel .mcm-connection-list,
		.pict-modal-shell-center .mcm-connection-detail {
			background: transparent;
			border: none;
			border-radius: 0;
			padding: 12px;
			margin: 0;
		}
	`,
	Templates:
	[
		{
			Hash: 'Bookstore-Layout-Shell-Template',
			Template: /*html*/`<div id="Bookstore-Layout-Mount" style="height:100%"></div>`
		}
	],
	Renderables:
	[
		{
			RenderableHash:            'Bookstore-Layout-Shell',
			TemplateHash:              'Bookstore-Layout-Shell-Template',
			ContentDestinationAddress: '#Bookstore-Application-Container',
			RenderMethod:              'replace'
		}
	]
};

class PictViewBookstoreLayout extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, _ViewConfiguration, pOptions);
		super(pFable, tmpOptions, pServiceHash);
		this._shellPanelsBuilt = false;
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		if (this.pict && this.pict.CSSMap) { this.pict.CSSMap.injectCSS(); }
		if (!this._shellPanelsBuilt)
		{
			this._buildShell();
			this._shellPanelsBuilt = true;
		}
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}

	_buildShell()
	{
		let tmpModal = this.pict.views['Pict-Section-Modal'];
		if (!tmpModal || typeof tmpModal.shell !== 'function')
		{
			this.log.warn('Bookstore-Layout: Pict-Section-Modal not available; shell not built.');
			return;
		}

		let tmpMount = document.getElementById('Bookstore-Layout-Mount');
		if (!tmpMount)
		{
			this.log.warn('Bookstore-Layout: mount #Bookstore-Layout-Mount not in DOM yet.');
			return;
		}

		this._shell = tmpModal.shell(tmpMount, { PersistenceKey: 'bookstore-connections-shell' });

		// Top — theme chrome (BrandMark + Nav + User slots). Height must match Theme-Section TopBar.Height.
		this._shell.addPanel(
		{
			Hash: 'topbar', Side: 'top', Mode: 'fixed', Size: 48,
			ContentDestinationId: 'Theme-TopBar', ContentView: 'Theme-TopBar'
		});

		// Left — connection list sidebar.
		this._shell.addPanel(
		{
			Hash: 'sidebar', Side: 'left', Mode: 'resizable',
			Size: 320, MinSize: 220, MaxSize: 520, Title: 'Connections',
			ContentDestinationId: 'MCM-ConnectionList-Container',
			ResponsiveDrawer: 900
		});

		// Right (overlay, hidden) — theme settings panel; opens via the gear in TopBar-User.
		this._shell.addPanel(
		{
			Hash: 'settings', Side: 'right', Mode: 'resizable', Position: 'overlay',
			Size: 360, MinSize: 280, MaxSize: 540,
			Hidden: true, Collapsed: true,
			ContentDestinationId: 'Bookstore-Settings-Panel',
			ContentView: 'Bookstore-SettingsPanel'
		});

		// Center — connection detail editor.
		this._shell.center({ ContentDestinationId: 'MCM-ConnectionDetail-Container' });
	}

	getSettingsPanel()
	{
		return this._shell ? this._shell.getPanel('settings') : null;
	}

	toggleSettingsPanel()
	{
		let tmpPanel = this.getSettingsPanel();
		if (tmpPanel) { tmpPanel.toggle(); }
	}

	renderTopBar()
	{
		let tmpNav  = this.pict.views['Bookstore-TopBar-Nav'];
		let tmpUser = this.pict.views['Bookstore-TopBar-User'];
		if (tmpNav)  { tmpNav.render();  }
		if (tmpUser) { tmpUser.render(); }
	}
}

module.exports = PictViewBookstoreLayout;
module.exports.default_configuration = _ViewConfiguration;
