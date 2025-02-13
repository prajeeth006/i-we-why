using System;

namespace Frontend.Vanilla.Core.Rest.Formatters;

/// <summary>
/// Formats given object as REST content thus (de)serializing it array of bytes.
/// </summary>
public interface IRestFormatter
{
    /// <summary>Gets the content type header of serialized REST content.</summary>
    string ContentType { get; }

    /// <summary>Serializes given content as array of bytes.</summary>
    byte[] Serialize(object content);

    /// <summary>Deserializes a content of requested type from given array of bytes.</summary>
    object? Deserialize(byte[] data, Type type);
}
