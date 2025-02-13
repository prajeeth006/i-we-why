using System.Text;
using Frontend.Host.Features.JsErr;

namespace Frontend.Host.Tests.Features.JsErr;

/// <summary>
/// Utility class to hold static methods for errors generation. Used to test erros parsing in a more fluent way.
/// Can define all the fields in error data and convert to error from chrome, firefox or any other browser.
/// Example:
/// Errs.FromData(err).ToChrome();
/// Errs.FromData(err).ToFireFox();.
/// </summary>
public class Errs
{
    private readonly ErrorData data;

    private Errs(ErrorData data)
    {
        this.data = data;
    }

    public static Errs FromData(ErrorData data)
    {
        return new Errs(data);
    }

    public string ToChrome()
    {
        var sb = new StringBuilder();

        sb.Append("[{")
            .AppendFormat("cause:\"{0}\",", data.cause)
            .AppendFormat("message:\"{0}\",", data.message)
            .AppendFormat("name:\"{0}\",", data.name)
            .AppendFormat("arguments:\"{0}\",", data.arguments)
            .AppendFormat("stack:\"{0}\",", data.stack)

            // other browsers specific
            .AppendFormat("stacktrace:\"{0}\",", "") // opera
            .AppendFormat("description:\"{0}\",", "") // ie
            .AppendFormat("fileName:\"{0}\",", "") // firefox
            .AppendFormat("lineNumber:\"{0}\",", "") // firefox
            .AppendFormat("columnNumber:\"{0}\",", "") // firefox
            .AppendFormat("sourceURL:\"{0}\",", "") // safari
            .AppendFormat("line:\"{0}\",", "") // safari
            .Append("}]");

        return sb.ToString();
    }

    public string ToFireFox()
    {
        var sb = new StringBuilder();

        sb.Append("[{")
            .AppendFormat("message:\"{0}\",", data.message)
            .AppendFormat("name:\"{0}\",", data.name)
            .AppendFormat("fileName:\"{0}\",", data.fileName)
            .AppendFormat("lineNumber:\"{0}\",", data.lineNumber)
            .AppendFormat("columnNumber:\"{0}\",", data.columnNumber)
            .AppendFormat("stack:\"{0}\",", data.stack)

            // other browsers specific
            .AppendFormat("stacktrace:\"{0}\",", "") // opera
            .AppendFormat("description:\"{0}\",", "") // ie
            .AppendFormat("sourceURL:\"{0}\",", "") // safari
            .AppendFormat("line:\"{0}\",", "") // safari
            .AppendFormat("arguments:\"{0}\",", "") // chrome
            .Append("}]");

        return sb.ToString();
    }

    public string ToIe()
    {
        var sb = new StringBuilder();

        sb.Append("[{")
            .AppendFormat("message:\"{0}\",", data.message)
            .AppendFormat("name:\"{0}\",", data.name)
            .AppendFormat("description:\"{0}\",", data.description)
            .AppendFormat("stack:\"{0}\",", data.stack)

            // other browsers specific
            .AppendFormat("stacktrace:\"{0}\",", "") // opera
            .AppendFormat("fileName:\"{0}\",", "") // firefox
            .AppendFormat("lineNumber:\"{0}\",", "") // firefox
            .AppendFormat("columnNumber:\"{0}\",", "") // firefox
            .AppendFormat("sourceURL:\"{0}\",", "") // safari
            .AppendFormat("line:\"{0}\",", "") // safari
            .AppendFormat("arguments:\"{0}\",", "") // chrome
            .Append("}]");

        return sb.ToString();
    }

    public string ToSafari()
    {
        var sb = new StringBuilder();

        sb.Append("[{")
            .AppendFormat("message:\"{0}\",", data.message)
            .AppendFormat("stack:\"{0}\",", data.stack)
            .AppendFormat("line:\"{0}\",", data.line)
            .AppendFormat("sourceURL:\"{0}\",", data.sourceURL)

            // other browsers specific
            .AppendFormat("stacktrace:\"{0}\",", "") // opera
            .AppendFormat("description:\"{0}\",", "") // ie
            .AppendFormat("name:\"{0}\",", "") // ie and firefox
            .AppendFormat("fileName:\"{0}\",", "") // firefox
            .AppendFormat("lineNumber:\"{0}\",", "") // firefox
            .AppendFormat("columnNumber:\"{0}\",", "") // firefox
            .AppendFormat("arguments:\"{0}\",", "") // chrome
            .Append("}]");

        return sb.ToString();
    }

    public string ToOpera()
    {
        var sb = new StringBuilder();

        sb.Append("[{")
            .AppendFormat("message:\"{0}\",", data.message)
            .AppendFormat("stack:\"{0}\",", data.stack)
            .AppendFormat("stacktrace:\"{0}\",", data.stacktrace)

            // other browsers specific
            .AppendFormat("description:\"{0}\",", "") // ie
            .AppendFormat("name:\"{0}\",", "") // ie and firefox
            .AppendFormat("fileName:\"{0}\",", "") // firefox
            .AppendFormat("lineNumber:\"{0}\",", "") // firefox
            .AppendFormat("columnNumber:\"{0}\",", "") // firefox
            .AppendFormat("sourceURL:\"{0}\",", "") // safari
            .AppendFormat("line:\"{0}\",", "") // safari
            .AppendFormat("arguments:\"{0}\",", "") // chrome
            .Append("}]");

        return sb.ToString();
    }
}
