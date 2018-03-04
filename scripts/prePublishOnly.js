const fse = require('fs-extra');

try {
    fse.moveSync('./dist', '.');
} catch (error) {
    console.error('Failed to move "dist" files to root dir...', error);
    throw error.message;
}

console.log('Successfully moved "dist" files to root dir...');