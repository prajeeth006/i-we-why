var path = require('canonical-path');

module.exports = function generateNavigationDoc() {

    return {
        $runAfter: ['extra-docs-added'],
        $runBefore: ['rendering-docs'],
        outputFolder: '',
        $validate: { outputFolder: { presence: true } },
        $process: function (docs) {
            var modulesDoc = {
                docType: 'data-module',
                value: { api: { sections: [] }, guide: { pages: [] } },
                path: this.outputFolder + '/navigation',
                outputPath: this.outputFolder + '/navigation.ts',
                serviceName: 'NAVIGATION'
            };

            docs.forEach(function (doc) {
                if (doc.docType === 'module') {
                    var moduleNavItem =
                        {
                            path: doc.path,
                            partial: doc.outputPath,
                            name: doc.id,
                            type: 'module', pages: []
                        };

                    modulesDoc.value.api.sections.push(moduleNavItem);

                    doc.exports.forEach(function (exportDoc) {

                        if (!exportDoc.internal) {
                            var exportNavItem = {
                                path: exportDoc.path,
                                partial: exportDoc.outputPath,
                                name: exportDoc.name,
                                type: exportDoc.docType
                            };
                            moduleNavItem.pages.push(exportNavItem);
                        }
                    });
                }
            });

            docs.forEach(function (doc) {
                if (doc.docType === 'content') {
                    let basePath = doc.fileInfo.basePath;
                    let filePath = doc.fileInfo.filePath;

                    //the content type is the name of the folder the content is in
                    let contentType = path.relative(basePath, filePath).split('/')[0];
                    let section = modulesDoc.value[contentType];

                    if (section) {
                        var contentDoc = { path: doc.path, partial: doc.outputPath, name: doc.name, type: contentType };
                        section.pages.push(contentDoc);
                    }
                }
            });

            docs.push(modulesDoc);
        }
    };
};
