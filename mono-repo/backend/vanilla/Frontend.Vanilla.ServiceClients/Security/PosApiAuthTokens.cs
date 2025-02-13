#nullable enable

using System;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.ServiceClients.Security;

/// <summary>
/// Holds PosAPI authentication tokens together so that they can be validated and passed easily.
/// </summary>
internal sealed class PosApiAuthTokens : ToStringEquatable<PosApiAuthTokens>
{
    /// <summary>Gets user token.</summary>
    public string UserToken { get; }

    /// <summary>Gets session token.</summary>
    public string SessionToken { get; }

    /// <summary>Creates a new instance.</summary>
    public PosApiAuthTokens(string userToken, string sessionToken)
    {
        if (!TrimmedRequiredString.IsValid(userToken) || !TrimmedRequiredString.IsValid(sessionToken))
            throw new ArgumentException(
                $"Both tokens must be trimmed non-null strings but UserToken={userToken.Dump()} and SessionToken={sessionToken.Dump()} were provided.");

        UserToken = userToken;
        SessionToken = sessionToken;
    }

    /// <summary>Returns debug string with tokens.</summary>
    public override string ToString()
        => $"UserToken='{UserToken}', SessionToken='{SessionToken}'";

    /// <summary>
    /// Creates a new instance if both tokens are provided.
    /// Returns null if both tokens are null.
    /// Otherwise throws because such state is an error.
    /// </summary>
    public static PosApiAuthTokens? TryCreate(string? userToken, string? sessionToken)
        => userToken != null || sessionToken != null ? new PosApiAuthTokens(userToken!, sessionToken!) : null;
}

internal static class PosApiAuthTokensExtensions
{
    internal static string ToDebugString(this PosApiAuthTokens? authTokens)
        => authTokens?.ToString() ?? "Anonymous";
}
