/**
 * @description Add the css class "prettyprint" to all pre tags in the HTML output
 */
module.exports = function prettyprintFilter() {
    return {
        name: 'prettyprint',
        process: function (str) {
            var output = str && str.replace(/<pre>/gi, '<pre class="prettyprint">');
            return output;
        }
    };
};

