#nullable enable

using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Deserializes claims from PosAPI response.
/// There are also local claims, see <see cref="ILocalClaimsResolver" />.
/// </summary>
internal interface IPosApiClaimsDeserializer
{
    IReadOnlyList<Claim> Deserialize(ClaimsResponse posApiResponse, PosApiAuthTokens? authTokens);
}

internal sealed class PosApiClaimsDeserializer : IPosApiClaimsDeserializer
{
    public const string VanillaIssuer = "Vanilla Framework";
    public const string PosApiIssuer = "PosAPI";
    public static readonly IReadOnlyList<string> VanillaClaimTypes = new[] { PosApiClaimTypes.UserToken, PosApiClaimTypes.SessionToken };

    public IReadOnlyList<Claim> Deserialize(ClaimsResponse posApiResponse, PosApiAuthTokens? authTokens)
    {
        if (VanillaClaimTypes.Any(posApiResponse.ClaimValues.ContainsKey))
            throw new Exception($"Claim types {VanillaClaimTypes.Join()} are supposed to be issued exclusively by Vanilla"
                                + $" but PosAPI response contains some of them: {JsonConvert.SerializeObject(posApiResponse.ClaimValues)}.");

        var result = new List<Claim>(posApiResponse.ClaimValues.Count + VanillaClaimTypes.Count);

        if (authTokens != null)
        {
            result.Add(new Claim(PosApiClaimTypes.UserToken, authTokens.UserToken, null, VanillaIssuer));
            result.Add(new Claim(PosApiClaimTypes.SessionToken, authTokens.SessionToken, null, VanillaIssuer));
        }

        foreach (var posApiClaim in posApiResponse.ClaimValues)
        {
            if (!TrimmedRequiredString.IsValid(posApiClaim.Key))
                throw new Exception($"Claim type must be a trimmed non-empty string but there is '{posApiClaim.Key}'='{posApiClaim.Value}' which came from PosAPI.");

            result.Add(new Claim(posApiClaim.Key, posApiClaim.Value ?? "", null, PosApiIssuer));
        }

        return result;
    }
}
