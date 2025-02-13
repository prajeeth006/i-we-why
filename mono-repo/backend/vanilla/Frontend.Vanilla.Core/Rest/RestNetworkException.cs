using System;

namespace Frontend.Vanilla.Core.Rest;

/// <summary>
///     Represents network error experienced by <see cref="IRestClient" /> when establishing the connection thus no HTTP
///     REST response is available.
/// </summary>
internal sealed class RestNetworkException(string? message = null, Exception? innerException = null) : Exception(message, innerException) { }
