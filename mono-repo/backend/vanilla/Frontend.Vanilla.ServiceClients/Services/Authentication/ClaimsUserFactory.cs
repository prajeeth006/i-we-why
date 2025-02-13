using System;
using System.Collections.Generic;
using System.Security.Claims;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication;

/// <summary>
/// Creates claims user.
/// </summary>
internal interface IClaimsUserFactory
{
    ClaimsPrincipal Create([NotNull] IEnumerable<Claim> claims);
}

internal sealed class ClaimsUserFactory : IClaimsUserFactory
{
    public ClaimsPrincipal Create(IEnumerable<Claim> claims)
    {
        var claimDict = claims?.ToDictionary(c => c.Type, StringComparer.OrdinalIgnoreCase);
        Guard.NotEmpty(claimDict, nameof(claims));

        try
        {
            var identity = CreateIdentity(claimDict);

            return new ClaimsPrincipal(identity);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed creating claims user '{claimDict.GetValue(PosApiClaimTypes.Name)?.Value}'.", ex);
        }
    }

    private static ClaimsIdentity CreateIdentity(IReadOnlyDictionary<string, Claim> claims)
    {
        var userToken = claims.GetValue(PosApiClaimTypes.UserToken)?.Value;
        var sessionToken = claims.GetValue(PosApiClaimTypes.SessionToken)?.Value;

        if (PosApiAuthTokens.TryCreate(userToken, sessionToken) == null)
            return new ClaimsIdentity(claims.Values);

        var rawWorkflowTypeId = claims.GetValue(PosApiClaimTypes.WorkflowTypeId)?.Value ?? "0";

        if (!int.TryParse(rawWorkflowTypeId, out var workflowTypeId))
            throw new Exception($"Claim {PosApiClaimTypes.WorkflowTypeId} must be an integer but it is '{rawWorkflowTypeId}'.");

        return workflowTypeId > 0
            ? new ClaimsIdentity(claims.Values)
            : new ClaimsIdentity(claims.Values, "Vanilla");
    }
}
