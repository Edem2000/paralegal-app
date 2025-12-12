const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

module.exports = async function (context) {
    const appOutDir = context.appOutDir; // например, release/win-unpacked
    const destBackend = path.join(appOutDir, 'resources', 'backend');

    const backendSrc = path.join(__dirname, '..', 'backend');

    console.log('[afterPack] copying backend to', destBackend);

    // await fse.copy(path.join(backendSrc, 'dist'), path.join(destBackend, 'dist'), {
    //     overwrite: true,
    //     errorOnExist: false
    // });

    // await fse.copy(path.join(backendSrc, 'package.json'), path.join(destBackend, 'package.json'), {
    //     overwrite: true,
    //     errorOnExist: false
    // });
    //
    // await fse.copy(path.join(backendSrc, 'node_modules'), path.join(destBackend, 'node_modules'), {
    //     overwrite: true,
    //     errorOnExist: false
    // });

    await fse.copy(path.join(backendSrc, '.env'), path.join(destBackend, '.env'), {
        overwrite: true,
        errorOnExist: false
    });
};
