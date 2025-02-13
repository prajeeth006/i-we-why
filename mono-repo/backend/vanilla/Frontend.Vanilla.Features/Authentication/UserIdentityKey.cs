using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.Authentication;

internal static class UserIdentityKey
{
    public static readonly IReadOnlyList<int> AuthExpiredPosApiCodes = new[]
    {
        207, // Session security token expired
        208, // User security token expired
        209, // Invalid session security token
        210, // Invalid user security token
    };

    private const char Separator = ':';

    public static string GetUserName(PosApiAuthTokens authTokens)
        => authTokens.UserToken + Separator + authTokens.SessionToken;

    public static PosApiAuthTokens ExtractPosApiTokens(string? userName)
    {
        try
        {
            var parts = userName?.Split(Separator);

            if (parts?.Length != 2)
                throw new Exception($"Expected split to 2 parts but there are {parts?.Length ?? 0}.");

            return new PosApiAuthTokens(
                userToken: parts[0],
                sessionToken: parts[1]);
        }
        catch (Exception ex)
        {
            throw new Exception($"Expected username in format 'userToken{Separator}sessionToken' to comply with Vanilla authentication but there is {userName.Dump()}.",
                ex);
        }
    }
}
