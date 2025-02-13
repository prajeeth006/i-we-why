using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Security.Claims;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Diagnostics;

internal sealed class ClaimsDiagnosticInfoProvider(
    ICurrentUserAccessor currentUserAccessor,
    IGlobalClaimInfos globalClaimInfos,
    ILocalClaimsProviders localClaimProviders,
    IHttpContextAccessor httpContextAccessor,
    IClock clock)
    : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Claims",
        urlPath: "claims",
        shortDescription: "Info about user's authentication and claims.");

    public override object GetDiagnosticInfo()
    {
        // Collect all claims = known to Vanilla + actual from PosAPI
        var currentUser = currentUserAccessor.User;
        var claimInfos = localClaimProviders.Providers
            .SelectMany(p => p.DeclaredClaims.Select(i => new ClaimInfo(p.Issuer, i.Type, i.Description)))
            .Concat(globalClaimInfos.Infos)
            .ToDictionary(i => i.Type, RequiredStringComparer.OrdinalIgnoreCase.AsTrimmed());

        foreach (var claim in currentUser.Claims)
            if (!claimInfos.ContainsKey(claim.Type))
                claimInfos.Add(claim.Type, new ClaimInfo(claim.Issuer, claim.Type, "(Unknown to Vanilla Framework, please let us know)"));

        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var authProperties = httpContext.Features.Get<IAuthenticateResultFeature>()?.AuthenticateResult?.Properties;
        var utcNow = clock.UtcNow.ValueWithOffset;
        var content = new
        {
            Authentication = new // Auh stuff on top b/c easy to spot asap
            {
                currentUser.Identity?.IsAuthenticated,
                currentUser.Identity?.Name,
                NameClaim = ((ClaimsIdentity?)currentUser.Identity)?.NameClaimType,
                IsAuthenticatedWithPosApi = currentUser.IsAuthenticatedOrHasWorkflow(),
                IsAuthenticatedWithPosApiClaims = $"{PosApiClaimTypes.UserToken} and {PosApiClaimTypes.SessionToken}",
                WorkflowId = currentUser.FindFirst(PosApiClaimTypes.WorkflowTypeId)?.Value,
                WorkflowIdClaims = PosApiClaimTypes.WorkflowTypeId,
                AuthTimes = new
                {
                    Issued = authProperties?.IssuedUtc,
                    IssuedBefore = utcNow - authProperties?.IssuedUtc,
                    Expires = authProperties?.ExpiresUtc,
                    ExpiresAfter = authProperties?.ExpiresUtc - utcNow,
                },
            },
            KnownOrCurrentClaims = claimInfos.Values
                .OrderBy(c => GetLastSegment(c.Type.Value))
                .Select(info =>
                {
                    var current = currentUser.FindFirst(info.Type);

                    return new Dictionary<string, string>
                    {
                        { nameof(info.Type), info.Type },
                        { nameof(info.Description), info.Description },
                        { nameof(info.Issuer), current?.Issuer ?? info.Issuer },
                        {
                            current != null ? "CurrentValue" : "CurrentlyExists", current != null ? current.Value : "False"
                        }, // Similar name b/c concise and easy to understand
                    };
                })
                .ToList(),
        };

        return content;
    }

    private static string GetLastSegment(string claimType)
        => claimType.TrimEnd('/').LastIndexOf('/') is var i && i >= 0 ? claimType.Substring(i + 1) : claimType;
}
