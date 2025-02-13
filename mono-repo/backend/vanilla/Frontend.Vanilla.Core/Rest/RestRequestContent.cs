using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
/// Defines content of REST requested to be serialized and posted to the server.
/// </summary>
public sealed class RestRequestContent
{
    /// <summary>
    /// Gets the bytes which should be posted to the service.
    /// </summary>
    public byte[] Bytes { get; }

    /// <summary>
    /// Gets the value which was serialized to <see cref="Bytes" />.
    /// </summary>
    public object Value { get; }

    /// <summary>
    /// Gets the formatter used to serialize <see cref="Value" />.
    /// </summary>
    public IRestFormatter Formatter { get; }

    /// <summary>
    /// Creates new instance.
    /// </summary>
    public RestRequestContent(object value, IRestFormatter formatter)
    {
        Value = Guard.NotNull(value, nameof(value));
        Formatter = Guard.NotNull(formatter, nameof(formatter));
        Bytes = formatter.Serialize(value);
    }
}
