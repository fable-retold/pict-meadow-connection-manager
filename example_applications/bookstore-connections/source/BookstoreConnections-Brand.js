'use strict';
const tmpPackage = require('../package.json');

if (!tmpPackage.retold || !tmpPackage.retold.brand)
{
	throw new Error('bookstore-connections: package.json is missing retold.brand — '
		+ 'run `npm run brand` (which calls pict-section-theme-brand) before building');
}

module.exports = tmpPackage.retold.brand;
