using System.Collections.Generic;
using System.Linq;
using System.Net;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Net;

/// <summary>
/// Main abstract logic for client IP address resolution shared between Vanilla and PosAPI.
/// </summary>
internal interface IClientIpResolutionAlgorithm
{
    /// <summary>Executes the resolution of client IP address.</summary>
    IPAddress Resolve(IPAddress requestPhysicalIp, string? xForwardedForHeader, IReadOnlyCollection<IpSubnet> companyInternalSubnets, ICollection<string>? trace);
}

/// <summary>See <see cref="IClientIpResolutionAlgorithm" />.</summary>
internal sealed class ClientIpResolutionAlgorithm : IClientIpResolutionAlgorithm
{
    /// <summary>Gets details of DynaCon configuration of company internal subnets shared between Vanilla and PosAPI.</summary>
    public static (string Service, int Version, string Feature, string Key) DynaConParameters { get; } =
        ("Networking", 1, "Networking.CompanyInternalNetwork", "Subnets");

    internal static readonly string DocumentationHtml = string.Concat(
        "<p>Vanilla framework needs to resolve client IP address in order to post it to backend services (e.g. x-bwin-client-ip sent to PosAPI). This logic is shared with PosAPI.</p>",
        "<p>We try to resolve IP address based on this logic:</p>",
        "<ul>",
        "<li>The resolution is based on list of company internal subnets (e.g. <em>10.33.0.0/16</em>) where our servers and local balancers are located. It's configured in",
        $" <a href=\"https://admin.dynacon.prod.env.works/goto?service={DynaConParameters.Service}:{DynaConParameters.Version}&amp;feature={DynaConParameters.Feature}&amp;key={DynaConParameters.Key}\">",
        $"DynaCon -> {DynaConParameters.Service} -> {DynaConParameters.Feature} -> {DynaConParameters.Key}</a>.</li>",
        $"<li>In general the resolution returns first rightmost IP address from <em>{HttpHeaders.XForwardedFor}</em> header which isn't within company internal subnets",
        " because our load balancers and proxy servers are appending request IPs (from their point of view) to the header.",
        " Example: given subnets [<em>10.33.0.0/16</em>] and header <em>1.1.1.1, 2.2.2.2, 10.33.4.5</em> then <em>2.2.2.2</em> is returned.</li>",
        "<li>If there is no header or its value is white-space header then request physical IP is returned.</li>",
        "<li>If request physical IP isn't within company internal subnets nor is localhost then it is returned directly regardless of the header.</li>",
        "<li>If some part the header is invalid IP then previous one is returned. If no previous one (because first part is already invalid) then request physical IP is returned.</li>",
        "<li>(Vanilla only) Operations without associated HTTP request e.g. running on background thread get <em>127.0.0.1</em> returned.</li>",
        $"<li>(Vanilla only) If non-production app and there is '{MockedIpCookie}' cookie then its value is parsed and returned.</li>",
        "</ul>");

    internal const string MockedIpCookie = "mockedClientIP";

    public IPAddress Resolve(IPAddress requestPhysicalIp, string? xForwardedForHeader, IReadOnlyCollection<IpSubnet> companyInternalSubnets, ICollection<string>? trace)
    {
        trace?.Add("Resolving client IP address based on"
                   + $" request physical IP address '{requestPhysicalIp}',"
                   + $" header 'X-Forwarded-For' with value {xForwardedForHeader.Dump()},"
                   + $" configured company internal subnets: {companyInternalSubnets.Select(s => s.ToString()).Dump()}.");

        if (xForwardedForHeader.IsNullOrWhiteSpace())
        {
            trace?.Add("Returning request physical IP because the header is null or white-space.");

            return requestPhysicalIp;
        }

        var rawIPs = xForwardedForHeader.Split(',').Select(x => x.Trim()).Reverse().ToList();
        trace?.Add($"Examining IP addresses from the header in this order: {rawIPs.Dump()}.");

        IPAddress? previousIp = null;

        foreach (var rawIp in rawIPs.NullToEmpty())
        {
            if (!IPAddress.TryParse(rawIp, out var ip))
            {
                trace?.Add($"Value '{rawIp}' isn't a valid IP address.");

                break;
            }

            var subnet = companyInternalSubnets.FirstOrDefault(s => s.Contains(ip));

            if (subnet == null)
            {
                trace?.Add($"Returning IP address '{ip}' which is first one outside company internal subnets.");

                return ip;
            }

            previousIp = ip;
            trace?.Add($"Skipping IP '{ip}' because it's within company internal subnet '{subnet}'.");
        }

        if (previousIp == null)
        {
            trace?.Add($"Returning request physical IP because there wasn't any previous one.");

            return requestPhysicalIp;
        }

        trace?.Add($"Returning previous IP '{previousIp}' from the header even despite it's within company network but it's the only IP present.");

        return previousIp;
    }
}
