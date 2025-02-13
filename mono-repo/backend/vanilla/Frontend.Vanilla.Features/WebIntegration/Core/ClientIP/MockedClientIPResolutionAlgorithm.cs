using System;
using System.Collections.Generic;
using System.Net;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.Cookies;

namespace Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;

/// <summary>Resolves mocked IP from the cookie before regular resolution algorithm.</summary>
internal sealed class MockedClientIpResolutionAlgorithm(IClientIpResolutionAlgorithm inner, IEnvironmentProvider envProvider, ICookieHandler cookieHandler)
    : IClientIpResolutionAlgorithm
{
    public IPAddress Resolve(IPAddress requestPhysicalIp, string? xForwardedForHeader, IReadOnlyCollection<IpSubnet> companyInternalSubnets, ICollection<string>? trace)
        => GetMockedIp(trace) ?? inner.Resolve(requestPhysicalIp, xForwardedForHeader, companyInternalSubnets, trace);

    private IPAddress? GetMockedIp(ICollection<string>? trace)
    {
        if (envProvider.IsProduction)
        {
            trace?.Add("Cookie 'mockedClientIP' isn't considered because the environment is production.");

            return null;
        }

        var mockedIpCookie = cookieHandler.GetValue(ClientIpResolutionAlgorithm.MockedIpCookie);

        if (mockedIpCookie == null)
        {
            trace?.Add("Cookie 'mockedClientIP' doesn't exist hence regular resolution is executed.");

            return null;
        }

        if (!IPAddress.TryParse(mockedIpCookie, out var mockedIp))
            throw new Exception($"Failed client IP resolution because cookie 'mockedClientIP' contains value '{mockedIpCookie}' which isn't a valid IP address.");

        trace?.Add($"Returning mocked IP '{mockedIp}' resolved from cookie 'mockedClientIP' hence skipping regular algorithm.");

        return mockedIp;
    }
}
