using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Rest.Formatters;

/// <summary>
/// (De)serializes a string to be used as REST content.
/// </summary>
public sealed class StringFormatter : IRestFormatter
{
    /// <summary>Gets the instance of this class.</summary>
    public static readonly IRestFormatter Singleton = new StringFormatter();

    private StringFormatter() { }

    /// <summary>See <see cref="IRestFormatter.ContentType" />.</summary>
    public string ContentType => ContentTypes.Text;

    /// <summary>See <see cref="IRestFormatter.Deserialize" />.</summary>
    public object Deserialize(byte[] data, Type type)
    {
        Guard.NotNull(data, nameof(data));
        Guard.NotNull(type, nameof(type));

        return type.IsAssignableFrom(typeof(string))
            ? data.DecodeToString()
            : throw new ArgumentException($"{nameof(StringFormatter)} can't deserialize {type}. Only {typeof(string)} is supported.");
    }

    /// <summary>See <see cref="IRestFormatter.Serialize" />.</summary>
    public byte[] Serialize(object content)
    {
        Guard.NotNull(content, nameof(content));

        return content is string str
            ? str.EncodeToBytes()
            : throw new ArgumentException($"{nameof(StringFormatter)} can't serialize {content.GetType()}. Only {typeof(string)} is supported.");
    }
}
