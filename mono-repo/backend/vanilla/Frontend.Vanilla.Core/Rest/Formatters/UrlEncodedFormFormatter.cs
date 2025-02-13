using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.Rest.Formatters;

/// <summary>
/// (De)serializes an object to url encoded form.
/// </summary>
public class UrlEncodedFormFormatter : IRestFormatter
{
    /// <summary>Gets the instance of this class.</summary>
    public static readonly IRestFormatter Singleton = new UrlEncodedFormFormatter();

    private UrlEncodedFormFormatter() { }

    /// <summary>Gets the content type header of serialized REST content.</summary>
    public string ContentType => ContentTypes.UrlEncodedForm;

    /// <summary>Serializes given content as array of bytes.</summary>
    public byte[] Serialize(object content)
    {
        Guard.NotNull(content, nameof(content));

        var values = (IEnumerable<KeyValuePair<string, StringValues>>)content;

        return QueryUtil.Build(values).EncodeToBytes();
    }

    /// <summary>
    /// Deserializes a content of requested type from given array of bytes.
    /// </summary>
    public object Deserialize(byte[] data, Type type)
    {
        throw new NotSupportedException($"Deserialization of {ContentType} is not supported because it can only be used for requests.");
    }
}
