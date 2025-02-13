var _ = require('lodash');

module.exports = function checkApiDocClassificationProcessor(createDocMessage) {
    return {
        $runAfter: ['paths-computed'],
        $runBefore: ['rendering-docs'],
        apiDocTypes: [
            'class',
            'interface',
            'injectable',
            'component',
            'function',
            'let',
            'pipe',
            'directive',
            'enum',
            ],
        $process: function (docs) {
            var apiDocTypes = this.apiDocTypes;

             _.forEach(docs, function(doc) {
                 if (apiDocTypes.indexOf(doc.docType) > -1) {
                     if (
                         typeof doc.beta === 'undefined' &&
                         typeof doc.deprecated === 'undefined' &&
                         typeof doc.experimental === 'undefined' &&
                         typeof doc.stable === 'undefined'
                     ) {
                         throw new Error(createDocMessage('checkApiDocClassification processor: set either @beta, @deprecated, @experimental, or @stable', doc))
                     }
                 }
            });
            return docs;
        }
    }
};
