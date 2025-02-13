using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.Messages;

/// <summary>
/// Represent a message that is returned by an Api call to the client.
/// </summary>
public sealed class ApiMessage
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ApiMessage"/> class.
    /// </summary>
    /// <param name="type">The message type.</param>
    /// <param name="content">The message content.</param>
    /// <param name="lifetime">The lifetime of the message.</param>
    /// <param name="scope">The scope of the message.</param>
    public ApiMessage(MessageType type, string content, ApiMessageLifetime lifetime = ApiMessageLifetime.Single, string scope = "")
    {
        Type = Guard.DefinedEnum(type, nameof(type));
        Content = Guard.NotEmpty(content, nameof(content));
        Lifetime = Guard.DefinedEnum(lifetime, nameof(lifetime));
        Scope = scope;
    }

    /// <summary>
    /// Content of the message.
    /// </summary>
    public string Content { get; }

    /// <summary>
    /// Type of the message.
    /// </summary>
    public MessageType Type { get; }

    /// <summary>
    /// Lifetime of the message.
    /// </summary>
    public ApiMessageLifetime Lifetime { get; }

    /// <summary>
    /// Scope of the message.
    /// </summary>
    public string Scope { get; }
}
