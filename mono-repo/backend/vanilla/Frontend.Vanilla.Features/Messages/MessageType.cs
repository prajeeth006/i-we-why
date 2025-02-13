using System;

namespace Frontend.Vanilla.Features.Messages;

/// <summary>
/// Declares the message type (severity level).
/// </summary>
[Serializable]
public enum MessageType
{
    /// <summary>
    /// Informational-level message.
    /// </summary>
    Information,

    /// <summary>
    /// Warning-level message.
    /// </summary>
    Warning,

    /// <summary>
    /// Error-level message.
    /// </summary>
    Error,

    /// <summary>
    /// Success-level message.
    /// </summary>
    Success,
}
