using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Cors;

internal sealed class VanillaCorsPolicyProvider(ICorsConfiguration corsConfiguration) : ICorsPolicyProvider
{
    public Task<CorsPolicy?> GetPolicyAsync(HttpContext context, string? policyName)
    {
        var builder = new CorsPolicyBuilder();
        builder.AllowAnyHeader().AllowAnyMethod().AllowCredentials();

        var allowedWildcardSubdomains = corsConfiguration.OriginAllowedWildcardSubdomains.Values.Distinct().ToArray();
        builder.WithOrigins(allowedWildcardSubdomains).SetIsOriginAllowedToAllowWildcardSubdomains();

        var origin = context.Request.Headers[CorsConstants.Origin].ToString();

        if (corsConfiguration.PreflightMaxAge.HasValue)
        {
            builder.SetPreflightMaxAge(corsConfiguration.PreflightMaxAge.Value);
        }

        if (Uri.TryCreate(origin, UriKind.Absolute, out var originUrl)
            && corsConfiguration.OriginAllowedHosts.Values.Any(hosts => hosts.Contains(originUrl.Host, StringComparer.OrdinalIgnoreCase)))
        {
            builder.WithOrigins(origin);
        }

        return Task.FromResult<CorsPolicy?>(builder.Build());
    }
}
