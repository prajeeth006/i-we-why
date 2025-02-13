using System.IO;

namespace Frontend.Vanilla.Core.Utils;

/// <summary>
/// Constants with Internet content types.
/// </summary>
internal static class ContentTypes
{
    public const string Json = "application/json";
    public const string Xml = "application/xml";
    public const string Text = "text/plain";
    public const string JavaScript = "application/javascript";
    public const string Css = "text/css";
    public const string Jpeg = "image/jpeg";
    public const string Gif = "image/gif";
    public const string Png = "image/png";
    public const string WebP = "image/webp";
    public const string Svg = "image/svg+xml";
    public const string Ico = "image/vnd.microsoft.icon";
    public const string Html = "text/html";
    public const string HtmlWithUtf8 = "text/html; charset=utf-8";
    public const string Binary = "application/octet-stream";
    public const string UrlEncodedForm = "application/x-www-form-urlencoded";
    public const string WebAssembly = "application/wasm";

    public static string Get(string path)
        => Path.GetExtension(path) switch
        {
            ".wasm" => WebAssembly,
            ".js" => JavaScript,
            ".map" => Json,
            ".json" => Json,
            ".css" => Css,
            ".jpg" => Jpeg,
            ".jpeg" => Jpeg,
            ".gif" => Gif,
            ".png" => Png,
            ".webp" => WebP,
            ".svg" => Svg,
            ".ico" => Ico,
            ".html" => Html,
            ".xml" => Xml,
            ".txt" => Text,
            ".woff" => "application/font-woff",
            ".woff2" => "application/font-woff2",
            ".eot" => "application/vnd.ms-fontobject",
            ".otf" => "application/x-font-opentype",
            ".ttf" => "application/x-font-truetype",
            ".ani" => "application/x-navi-animation",
            _ => Binary,
        };
}
