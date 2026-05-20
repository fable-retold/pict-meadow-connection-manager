/**
 * PictView-ConnectionList
 *
 * Renders a list of all configured meadow connections.
 * Uses template-based rendering with {~TS:...~} for list iteration.
 *
 * @module PictView-ConnectionList
 */

'use strict';

const libPictView = require('pict-view');

const _DefaultConfiguration =
{
	ViewIdentifier: 'MCM-ConnectionList',
	DefaultRenderable: 'MCM-ConnectionList-Container',
	DefaultDestinationAddress: '#MCM-ConnectionList-Container',
	DefaultTemplateRecordAddress: 'AppData.MCM',
	AutoInitialize: true,
	AutoInitializeOrdinal: 0,
	AutoRender: true,
	AutoSolveWithApp: false,
	CSS: /*css*/`
		.mcm-connection-list {
			background: var(--theme-color-background-panel, #ffffff);
			border: 1px solid var(--theme-color-border-default, #dddddd);
			border-radius: 6px;
			padding: 16px;
			margin-bottom: 20px;
			color: var(--theme-color-text-primary, #1a1a1a);
		}
		.mcm-list-header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 12px;
		}
		.mcm-list-header h3 { margin: 0; }
		.mcm-list-body { display: flex; flex-direction: column; gap: 6px; }
		.mcm-connection-row {
			display: grid;
			grid-template-columns: minmax(0, 1fr) auto auto;
			grid-template-rows: auto auto;
			align-items: center;
			column-gap: 8px;
			row-gap: 2px;
			padding: 8px 10px;
			border: 1px solid var(--theme-color-border-light, #eeeeee);
			border-radius: 4px;
			background: var(--theme-color-background-secondary, #fafafa);
			color: var(--theme-color-text-primary, #1a1a1a);
		}
		.mcm-connection-row:hover {
			background: var(--theme-color-background-hover, #f0f0f0);
		}
		.mcm-conn-name {
			grid-column: 1 / 3;
			grid-row: 1;
			font-weight: 600;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.mcm-connection-row .mcm-conn-type {
			grid-column: 1;
			grid-row: 2;
			color: var(--theme-color-text-secondary, #666666);
			font-size: 0.85em;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.mcm-connection-row .mcm-conn-status {
			grid-column: 2;
			grid-row: 2;
			justify-self: start;
			font-size: 0.85em;
			color: var(--theme-color-text-muted, #888888);
		}
		.mcm-connection-row .mcm-conn-status::before {
			content: "·";
			opacity: 0.5;
			margin-right: 4px;
		}
		.mcm-conn-status[data-status="OK"]     { color: var(--theme-color-status-success, #16a34a); font-weight: 600; }
		.mcm-conn-status[data-status="Failed"] { color: var(--theme-color-status-error,   #dc2626); font-weight: 600; }
		.mcm-conn-status[data-status="Error"]  { color: var(--theme-color-status-error,   #dc2626); font-weight: 600; }
		.mcm-conn-status[data-status="new"]    { color: var(--theme-color-text-muted,     #888888); }
		.mcm-conn-actions {
			grid-column: 3;
			grid-row: 1 / 3;
			display: flex;
			flex-direction: column;
			gap: 4px;
			align-items: stretch;
		}
		.mcm-conn-actions .mcm-btn { padding: 3px 8px; font-size: 0.8em; }

		/* Buttons — shared base lives here since the list owns the Add button */
		.mcm-btn {
			padding: 6px 14px;
			border: 1px solid var(--theme-color-border-default, #cccccc);
			border-radius: 4px;
			background: var(--theme-color-background-panel, #ffffff);
			color: var(--theme-color-text-primary, #1a1a1a);
			cursor: pointer;
			font-size: 0.9em;
		}
		.mcm-btn:hover { background: var(--theme-color-background-tertiary, #f0f0f0); }
		.mcm-btn-add {
			background: var(--theme-color-status-success, #16a34a);
			color: var(--theme-color-text-on-brand, #ffffff);
			border-color: var(--theme-color-status-success, #16a34a);
		}
		.mcm-btn-add:hover {
			filter: brightness(0.95);
		}
		.mcm-btn-danger {
			color: var(--theme-color-status-error, #dc2626);
			border-color: var(--theme-color-status-error, #dc2626);
		}
		.mcm-btn-danger:hover {
			background: var(--theme-color-background-hover, #fef2f2);
		}
	`,
	CSSPriority: 500,

	Templates:
	[
		{
			Hash: 'MCM-ConnectionList-Container',
			Template: [
				'<section class="mcm-connection-list">',
				'<header class="mcm-list-header">',
				'<h3>Connections</h3>',
				"<button class=\"mcm-btn mcm-btn-add\" onclick=\"{~P~}.providers.MeadowConnectionManager.addConnection()\">Add Connection</button>",
				'</header>',
				'<section class="mcm-list-body" id="MCM-ConnectionList-Rows-{~D:Context[0].Hash~}">',
				'{~TS:MCM-ConnectionList-Row:Record.Connections~}',
				'</section>',
				'</section>',
			].join('\n'),
		},
		{
			Hash: 'MCM-ConnectionList-Row',
			Template: [
				'<article class="mcm-connection-row" data-index="{~D:Record.Index~}">',
				'<span class="mcm-conn-name">{~D:Record.Name~}</span>',
				'<span class="mcm-conn-type">{~D:Record.Type~}</span>',
				'<span class="mcm-conn-status" data-status="{~D:Record.Status~}">{~D:Record.Status~}</span>',
				'<span class="mcm-conn-actions">',
				"<button class=\"mcm-btn\" onclick=\"{~P~}.providers.MeadowConnectionManager.selectConnection({~D:Record.Index~})\">Edit</button>",
				"<button class=\"mcm-btn mcm-btn-danger\" onclick=\"{~P~}.providers.MeadowConnectionManager.removeConnection({~D:Record.Index~})\">Remove</button>",
				'</span>',
				'</article>',
			].join('\n'),
		},
	],

	Renderables:
	[
		{
			RenderableHash: 'MCM-ConnectionList-Container',
			TemplateHash: 'MCM-ConnectionList-Container',
			ContentDestinationAddress: '#MCM-ConnectionList-Container',
			RenderMethod: 'replace',
		},
	],

	Manifests: {},
};

class PictViewConnectionList extends libPictView
{
	constructor(pFable, pOptions, pServiceHash)
	{
		let tmpOptions = Object.assign({}, JSON.parse(JSON.stringify(_DefaultConfiguration)), pOptions);
		super(pFable, tmpOptions, pServiceHash);
	}

	/**
	 * Enrich connection records with their array index before rendering.
	 */
	onBeforeRender()
	{
		let tmpProvider = this.pict.providers.MeadowConnectionManager;
		if (!tmpProvider)
		{
			return true;
		}

		let tmpConnections = tmpProvider.getConnections();
		for (let i = 0; i < tmpConnections.length; i++)
		{
			tmpConnections[i].Index = i;
		}

		return true;
	}

	onAfterRender(pRenderable, pAddress, pRecord, pContent)
	{
		if (this.pict && this.pict.CSSMap) { this.pict.CSSMap.injectCSS(); }
		return super.onAfterRender(pRenderable, pAddress, pRecord, pContent);
	}
}

module.exports = PictViewConnectionList;
module.exports.default_configuration = _DefaultConfiguration;
