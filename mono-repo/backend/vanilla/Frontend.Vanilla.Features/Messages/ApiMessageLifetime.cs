namespace Frontend.Vanilla.Features.Messages;

/// <summary>
/// Represents lifetime of a message.
/// </summary>
public enum ApiMessageLifetime
{
    /// <summary>
    /// Indicates that the message should be cleared after any navigation event.
    /// </summary>
    Single,

    /// <summary>
    /// Indicates that the message should persist exacly one navigation event.
    /// </summary>
    TempData,
}
