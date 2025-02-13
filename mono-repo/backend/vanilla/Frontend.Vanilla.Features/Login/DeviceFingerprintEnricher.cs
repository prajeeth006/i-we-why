using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.Login;

/// <summary>
/// Enriches client side device fingerprint with server side details.
/// </summary>
public interface IDeviceFingerprintEnricher
{
    /// <summary>
    /// Enriches fingerprint.
    /// </summary>
    Task EnrichAsync(DeviceFingerprint fingerprint, ExecutionMode mode);
}

internal sealed class DeviceFingerprintEnricher(IHttpContextAccessor httpContextAccessor, IDeviceDslProvider deviceDslProvider, IBrowserDslProvider browserDslProvider, IClientIPResolver clientIpResolver) : IDeviceFingerprintEnricher
{
    public async Task EnrichAsync(DeviceFingerprint fingerprint, ExecutionMode mode)
    {
        Guard.NotNull(fingerprint, nameof(fingerprint));

        var details = fingerprint.DeviceDetails;
        var clientIp = clientIpResolver.Resolve();
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        EnrichWithConnectionInfo(details, httpContext, clientIp);
        EnrichWithHeaders(details, httpContext);
        await EnrichWithBrowserCapabilitiesAsync(mode, details, httpContext);
    }

    private static void EnrichWithConnectionInfo(IDictionary<string, string?> details, HttpContext httpContext, IPAddress? clientIp)
    {
        details["ip"] = clientIp?.ToString() ?? httpContext.Connection.RemoteIpAddress!.ToString();
    }

    private static void EnrichWithHeaders(IDictionary<string, string?> details, HttpContext httpContext)
    {
        var headers = httpContext.Request.Headers;
        details["ac"] = headers.GetValue(HttpHeaders.Accept).ToString();
        details["acl"] = headers.GetValue(HttpHeaders.AcceptLanguage).ToString();
        details["ace"] = headers.GetValue(HttpHeaders.AcceptEncoding).ToString();
        details["acc"] = headers.GetValue(HttpHeaders.AcceptCharset).ToString();
        details["via"] = headers.GetValue(HttpHeaders.Via).ToString();
        details["mac"] = string.Empty; // hardcoded as phone's mac address changes also in cases when switching from wifi to mobile network, so this is unusable.
        var xForwardedFor = httpContext.Request.Headers.GetValue("X_FORWARDED_FOR").ToString(); // TODO: Use HttpHeaders.XForwardedFor ?
        details["xff"] = xForwardedFor.WhiteSpaceToNull()?.Split(',').Select(s => s.Trim()).First() ?? string.Empty;
    }

    private async Task EnrichWithBrowserCapabilitiesAsync(ExecutionMode mode, IDictionary<string, string?> details, HttpContext httpContext)
    {
        // enrich from capabilities if not already supplied or empty
        if (string.IsNullOrEmpty(details.GetValue("bnv")))
        {
            details["bnv"] = await ExtractBrowserNameAndVersionAsync(mode) ?? string.Empty;
        }

        if (string.IsNullOrEmpty(details.GetValue("uid")))
        {
            details["uid"] = await deviceDslProvider.GetCapabilityAsync(mode, "id") ?? string.Empty;
        }

        if (string.IsNullOrEmpty(details.GetValue("os")))
        {
            if (await deviceDslProvider.OSNameAsync(mode) is { } osName)
            {
                details["os"] = osName;
            }
            else
            {
                var os = await ExtractPlatformNameAndVersionAsync(mode, httpContext);
                details["os"] = os.Name;
                details["osv"] = os.Version;
            }
        }

        if (string.IsNullOrEmpty(details.GetValue("osv")))
        {
            details["osv"] = await deviceDslProvider.OSVersionAsync(mode) ?? string.Empty;
        }
    }

    private async Task<string?> ExtractBrowserNameAndVersionAsync(ExecutionMode mode)
    {
        var browserName = await browserDslProvider.GetNameAsync(mode);

        // TODO: Check if we can send the browserVersion (full version) instead so no need to try-catch, as for natives sometimes UA does not have browser version at all.
        try
        {
            var browserVersion = await browserDslProvider.GetMajorVersionAsync(mode);
            return $"{browserName} {browserVersion}";
        }
        catch (Exception)
        {
            return browserName;
        }
    }

    private async Task<(string Name, string Version)> ExtractPlatformNameAndVersionAsync(ExecutionMode mode, HttpContext httpContext)
    {
        var ua = httpContext.Request.Headers.GetValue(HttpHeaders.UserAgent).ToString();

        if (ua.IndexOf("Android", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Android", ParseVersion(ua, "Android"));

        if (ua.IndexOf("iPad", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("iOS", ParseVersion(ua, "OS"));

        if (ua.IndexOf("iPhone", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("iOS", ParseVersion(ua, "OS"));

        if (ua.IndexOf("Mac OS X", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Mac OS X", ParseVersion(ua, "Mac OS X"));

        if (ua.IndexOf("Linux", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Linux", ParseVersion(ua, "Linux"));

        if (ua.IndexOf("Windows Phone OS", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows Phone", ParseVersion(ua, "Windows Phone OS"));

        if (ua.IndexOf("Windows Phone", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows Phone", ParseVersion(ua, "Windows Phone"));

        if (ua.IndexOf("Windows Mobile", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows Mobile", "");

        if (ua.IndexOf("Windows NT 5.1", StringComparison.OrdinalIgnoreCase) >= 0 ||
            ua.IndexOf("Windows NT 5.2", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows XP", "");

        if (ua.IndexOf("Windows NT 6.0", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows Vista", "");

        if (ua.IndexOf("Windows NT 6.1", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows", "7");

        if (ua.IndexOf("Windows NT 6.2", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows", "8");

        if (ua.IndexOf("Windows NT 6.3", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows", "8.1");

        if (ua.IndexOf("Windows NT 10", StringComparison.OrdinalIgnoreCase) >= 0)
            return ("Windows", "10");

        // fallback
        return (await deviceDslProvider.GetCapabilityAsync(mode, "osName") ?? string.Empty, await deviceDslProvider.GetCapabilityAsync(mode, "osVersion") ?? string.Empty);
    }

    private static string ParseVersion(string userAgent, string device)
    {
        var temp = userAgent.Substring(userAgent.IndexOf(device, StringComparison.Ordinal) + device.Length).TrimStart();
        var version = string.Empty;

        foreach (var character in temp)
        {
            var validCharacter = false;

            if (int.TryParse(character.ToString(), out _))
            {
                version += character;
                validCharacter = true;
            }

            if (character == 'x' || character == '.' || character == '_')
            {
                version += character;
                validCharacter = true;
            }

            if (validCharacter == false)
                break;
        }

        return version;
    }
}
