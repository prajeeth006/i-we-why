#nullable enable

using System;
using System.Collections.Generic;
using System.Net;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Exception with parsed details from PosAPI.
/// </summary>
public sealed class PosApiException : Exception
{
    /// <summary>Gets the HTTP status code of the response returned by PosAPI.</summary>
    public HttpStatusCode HttpCode { get; }

    /// <summary>Gets the error code returned in the body by PosAPI.</summary>
    public int PosApiCode { get; }

    /// <summary>Gets the message returned in the body by PosAPI that describes the error.</summary>
    public string? PosApiMessage { get; }

    /// <summary>Gets optional additional error values in the body by PosAPI.</summary>
    public IReadOnlyDictionary<string, string?> PosApiValues { get; }

    /// <summary>Wrapping another <see cref="PosApiException" /> will copy all custom properties.</summary>
    public PosApiException(
        string? message = null,
        Exception? innerException = null,
        HttpStatusCode httpCode = default,
        int posApiCode = 0,
        string? posApiMessage = null,
        IEnumerable<KeyValuePair<string, string?>>? posApiValues = null)
        : base(message, innerException)
    {
        // Prefer explicit input if not default then extracted value from inner exception then default value
        var posApiEx = innerException as PosApiException;
        HttpCode = httpCode != default ? httpCode : posApiEx?.HttpCode ?? default;
        PosApiCode = posApiCode != default ? posApiCode : posApiEx?.PosApiCode ?? default;
        PosApiMessage = posApiMessage ?? posApiEx?.PosApiMessage;
        PosApiValues = posApiValues?.ToDictionary().AsReadOnly() ?? posApiEx?.PosApiValues ?? EmptyDictionary<string, string?>.Singleton;
    }
}
