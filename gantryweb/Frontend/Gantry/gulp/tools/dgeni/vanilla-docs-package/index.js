const config = require('../../../../gulp-compiled/config').config;

const path = require('path');
const fs = require('fs');
const Dgeni = require('dgeni');
const DgeniPackage = Dgeni.Package;

// dgeni packages
const jsdocPackage = require('dgeni-packages/jsdoc');
const nunjucksPackage = require('dgeni-packages/nunjucks');
const typescriptPackage = require('dgeni-packages/typescript');
const contentPackage = require('../content-package');
const linksPackage = require('../links-package');

// Project configuration.
const PROJECT_ROOT = config.baseDir;

const DGENI_ROOT = path.join(config.baseDir, config.tools.dgeni);
const TEMPLATES_PATH = path.resolve(DGENI_ROOT, 'templates');

const CLIENT_ROOT = path.resolve(config.baseDir, config.v6ClientRoot);
const API_SOURCE_PATH = path.resolve(CLIENT_ROOT);
const CONTENTS_PATH = path.resolve(config.baseDir, config.v6ClientDocsContent);
const OUTPUT_PATH = path.resolve(PROJECT_ROOT, config.v6ClientDocsDist);

// Package definition for api docs.
//
// A dgeni package is very similar to an AngularJS module. Modules contain:
//  "services" (injectables)
//  "processors" (injectables that conform to a specific interface)
//  "templates": nunjucks templates that can be used to render content
//
// A dgeni package also has a `config` method, similar to an AngularJS module.
// A config block can inject any services/processors and configure them before
// docs processing begins.

const dgeniPackageDeps = [
    jsdocPackage,
    nunjucksPackage,
    typescriptPackage,
    linksPackage,
    contentPackage
];

let apiDocsPackage = new DgeniPackage('vanilla-mobile-docs', dgeniPackageDeps)

    .processor(require('./processors/convertPrivateClassesToInterfaces'))
    .processor(require('./processors/checkApiDocClassification'))
    .processor(require('./processors/checkUnbalancedBackTicks'))
    .processor(require('./processors/generateNavigationDoc'))
    .processor(require('./processors/generateKeywords'))
    .processor(require('./processors/addNotYetDocumentedProperty'))
    .processor(require('./processors/extractDecoratedClasses'))
    .processor(require('./processors/matchUpDirectiveDecorators'))
    .processor(require('./processors/filterMemberDocs'))


    .config(function (log) {
        log.level = 'info';
    })

    // overrides base packageInfo and returns the one for the 'vanilla/angular' repo.
    .factory('packageInfo', function () { return require(path.resolve(PROJECT_ROOT, 'package.json')); })

    .config(function (checkAnchorLinksProcessor) {
        // TODO: re-enable
        checkAnchorLinksProcessor.$enabled = false;
    })

    // Where do we get the source files?
    .config(function (
        readTypeScriptModules,
        readFilesProcessor,
        generateKeywordsProcessor) {
        // console.log("sourceDir", API_SOURCE_PATH);

        // API files are typescript
        readTypeScriptModules.basePath = API_SOURCE_PATH;
        readTypeScriptModules.ignoreExportsMatching = [/^_/];
        readTypeScriptModules.hidePrivateMembers = true;

        readTypeScriptModules.sourceFiles = [
            'core/index.ts',
            'upgrade/index.ts'
        ];

        readFilesProcessor.basePath = API_SOURCE_PATH;
        readFilesProcessor.sourceFiles = [
            {
                basePath: CONTENTS_PATH,
                include: CONTENTS_PATH + '/{cookbook,guide,tutorial}/**/*.md',
                fileReader: 'contentFileReader'
            },
        ];

        generateKeywordsProcessor.ignoreWordsFile = path.resolve(DGENI_ROOT, 'vanilla-docs-package/ignore.words');
    })

    // Where do we write the output files?
    .config(function (writeFilesProcessor) {
        // console.log("outputDir", OUTPUT_PATH);
        writeFilesProcessor.outputFolder = OUTPUT_PATH;
    })

    // Configure jsdoc-style tag parsing
    .config(function (
        parseTagsProcessor,
        getInjectables,
        inlineTagProcessor) {

        // Load up all the tag definitions in the tag-defs folder
        parseTagsProcessor.tagDefinitions =
            parseTagsProcessor.tagDefinitions.concat(getInjectables(requireFolder('./tag-defs')));

        // We actually don't want to parse param docs in this package as we are getting the data
        // out using TS
        // TODO: rewire the param docs to the params extracted from TS
        parseTagsProcessor.tagDefinitions.forEach(function (tagDef) {
            if (tagDef.name === 'param') {
                tagDef.docProperty = 'paramData';
                tagDef.transforms = [];
            }
        });

        inlineTagProcessor.inlineTagDefinitions.push(require('./inline-tag-defs/anchor'));
    })

    // Configure nunjucks rendering of docs via templates
    .config(function (
        renderDocsProcessor,
        templateFinder,
        templateEngine,
        getInjectables) {
        // Where to find the templates for the doc rendering
        templateFinder.templateFolders = [TEMPLATES_PATH];

        // Standard patterns for matching docs to templates
        templateFinder.templatePatterns = [
            '${ doc.template }',
            '${ doc.id }.${ doc.docType }.template.html',
            '${ doc.id }.template.html',
            '${ doc.docType }.template.html',
            '${ doc.id }.${ doc.docType }.template.js',
            '${ doc.id }.template.js',
            '${ doc.docType }.template.js',
            '${ doc.id }.${ doc.docType }.template.json',
            '${ doc.id }.template.json',
            '${ doc.docType }.template.json',
            'common.template.html'
        ];

        // dgeni disables autoescape by default, but we want this turned on.
        // templateEngine.config.autoescape = true;

        // Nunjucks and Angular conflict in their template bindings so change Nunjucks
        templateEngine.config.tags = { variableStart: '{$', variableEnd: '$}' };

        templateEngine.filters =
            templateEngine.filters.concat(getInjectables(requireFolder('./rendering')));

        // helpers are made available to the nunjucks templates
        renderDocsProcessor.helpers.relativePath = relativePathHelper;

    })

    // We are going to be relaxed about ambigous links
    .config(function (getLinkInfo) {
        getLinkInfo.useFirstAmbiguousLink = false;
    })

    // Configure the output path for written files (i.e., file names).
    .config(function (
        computeIdsProcessor,
        computePathsProcessor,
        EXPORT_DOC_TYPES,
        generateNavigationDoc,
        generateKeywordsProcessor) {

        const API_SEGMENT = 'api';
        const GUIDE_SEGMENT = 'guide';
        const DATA_SEGMENT = 'data';

        generateNavigationDoc.outputFolder = DATA_SEGMENT;
        generateKeywordsProcessor.outputFolder = DATA_SEGMENT;

        //  computeIdsProcessor.idTemplates.push({
        //     docTypes: EXPORT_DOC_TYPES.concat(['injectable', 'component', 'decorator', 'directive', 'pipe', 'function']),
        //     getAliases: function(doc) {
        //         return [doc.id];
        //     }
        //  });

        computePathsProcessor.pathTemplates = [
            {
                docTypes: ['module'],
                getPath: function (doc) {
                    doc.id = '@vanilla/' + doc.id.replace(doc.fileInfo.basePath + '/', '');
                    doc.moduleFolder =
                        doc.id
                            .replace(/^@vanilla\//, '')
                            .replace(/\/index$/i, '');
                    return API_SEGMENT + '/' + doc.moduleFolder;
                },
                outputPathTemplate: API_SEGMENT + '/${moduleFolder}/index.html'
            },
            {
                docTypes: EXPORT_DOC_TYPES.concat(['injectable', 'component', 'decorator', 'directive', 'pipe']),
                pathTemplate: API_SEGMENT + '/${moduleDoc.moduleFolder}/${name}',
                outputPathTemplate: API_SEGMENT + '/${moduleDoc.moduleFolder}/${name}.html',
            },
            {
                docTypes: ['content'],
                pathTemplate: '${id}',
                outputPathTemplate: '${path}.html'
            }
        ];
    });

function relativePathHelper(from, to) {
    return path.relative(from, to);
};

function requireFolder(relativePath) {
    const absolutePath = path.resolve(__dirname, relativePath);
    return fs.readdirSync(absolutePath)
        .filter(function (p) { return !/[._]spec\.js$/.test(p); })  // ignore spec files
        .map(function (p) { return require(path.resolve(absolutePath, p)); });
}

module.exports = apiDocsPackage;
