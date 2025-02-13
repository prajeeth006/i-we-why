using System;
using System.IO;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Core.Rest.Formatters;

/// <summary>
/// (De)serializes an object to JSON using Newtonsoft serializer to be used as REST content.
/// </summary>
public sealed class NewtonsoftJsonFormatter : IRestFormatter
{
    /// <summary>
    /// Gets the instance with default JSON settings.
    /// </summary>
    public static readonly IRestFormatter Default = new NewtonsoftJsonFormatter(new JsonSerializerSettings());

    private readonly JsonSerializer serializer;

    /// <summary>Creates a new instance.</summary>
    public NewtonsoftJsonFormatter(JsonSerializerSettings settings)
        => serializer = JsonSerializer.Create(Guard.NotNull(settings, nameof(settings)));

    /// <summary>See <see cref="IRestFormatter.ContentType" />.</summary>
    public string ContentType => ContentTypes.Json;

    /// <summary>See <see cref="IRestFormatter.Deserialize" />.</summary>
    public object? Deserialize(byte[] data, Type type)
    {
        Guard.NotNull(data, nameof(data));
        Guard.NotNull(type, nameof(type));

        using var reader = new StreamReader(new MemoryStream(data));

        return serializer.Deserialize(reader, type);
    }

    /// <summary>See <see cref="IRestFormatter.Serialize" />.</summary>
    public byte[] Serialize(object content)
    {
        Guard.NotNull(content, nameof(content));

        var memory = new MemoryStream();
        using (var writer = new StreamWriter(memory))
            serializer.Serialize(writer, content);

        return memory.ToArray();
    }
}
