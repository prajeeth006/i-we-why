using System.Text;

namespace Frontend.Host.Features.Assets;

internal interface IAssetTagRenderer
{
    string Script(string src, IDictionary<string, string>? attributes = null);
    string Link(string href, IDictionary<string, string>? attributes = null);
    string InlineStyle(string content, IDictionary<string, string>? attributes = null);
    string InlineScript(string content, IDictionary<string, string>? attributes = null);
}

internal class AssetTagRenderer : IAssetTagRenderer
{
    /// <summary>
    /// Renders a script tag with specified script and attributes.
    /// </summary>
    public string Script(string src, IDictionary<string, string>? attributes = null)
    {
        attributes ??= new Dictionary<string, string>();

        if (!attributes.ContainsKey("type"))
        {
            attributes["type"] = "text/javascript";
        }

        attributes["src"] = src;
        var script = new StringBuilder();
        script.Append("<script");

        foreach (var attr in attributes)
        {
            script.Append($" {attr.Key}=\"{attr.Value}\"");
        }

        script.Append("></script>");

        return script.ToString();
    }

    /// <summary>
    /// Renders a link tag with specified stylesheet and attributes.
    /// </summary>
    public string Link(string href, IDictionary<string, string>? attributes = null)
    {
        attributes ??= new Dictionary<string, string>();

        if (!attributes.ContainsKey("type"))
        {
            attributes["type"] = "text/css";
        }

        if (!attributes.ContainsKey("rel"))
        {
            attributes["rel"] = "stylesheet";
        }

        attributes["href"] = href;
        var script = new StringBuilder();
        script.Append("<link");

        foreach (var attr in attributes)
        {
            script.Append($" {attr.Key}=\"{attr.Value}\"");
        }

        script.Append("></link>");

        return script.ToString();
    }

    /// <summary>
    /// Renders a style tag with specified css content and attributes.
    /// </summary>
    public string InlineStyle(string content, IDictionary<string, string>? attributes = null)
    {
        attributes ??= new Dictionary<string, string>();

        var script = new StringBuilder();
        script.Append("<style");

        foreach (var attr in attributes)
        {
            script.Append($" {attr.Key}=\"{attr.Value}\"");
        }

        script.Append(">");
        script.Append(content);
        script.Append("</style>");

        return script.ToString();
    }

    /// <summary>
    /// Renders a script tag with specified js content and attributes.
    /// </summary>
    public string InlineScript(string content, IDictionary<string, string>? attributes = null)
    {
        attributes ??= new Dictionary<string, string>();

        if (!attributes.ContainsKey("type"))
        {
            attributes["type"] = "text/javascript";
        }

        var script = new StringBuilder();
        script.Append("<script");

        foreach (var attr in attributes)
        {
            script.Append($" {attr.Key}=\"{attr.Value}\"");
        }

        script.Append(">");
        script.Append(content);
        script.Append("</script>");

        return script.ToString();
    }
}
