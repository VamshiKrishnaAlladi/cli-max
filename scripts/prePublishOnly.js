// eslint-disable-next-line import/no-extraneous-dependencies
const fse = require('fs-extra');

try {
    fse.moveSync('./dist', '.');
}
catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to move "dist" files to root dir...', error);
    throw error.message;
}

// eslint-disable-next-line no-console
console.log('Successfully moved "dist" files to root dir...');
