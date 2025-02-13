module.exports = function () {
    return {
        name: 'deprecated',
        transforms: function(doc) {
            return doc.deprecated || 1;
        }
    };
};
