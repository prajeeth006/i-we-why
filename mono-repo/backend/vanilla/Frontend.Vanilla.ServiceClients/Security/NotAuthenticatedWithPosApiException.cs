#nullable enable

using System;
using System.Security;

namespace Frontend.Vanilla.ServiceClients.Security;

/// <summary>
/// Indicates an error related to <see cref="PosApiAuthTokens" /> of the current user.
/// </summary>
internal sealed class NotAuthenticatedWithPosApiException(string? message, Exception? innerException = null) : SecurityException(message, innerException) { }
