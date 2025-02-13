using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Core.Net;

/// <summary>
/// Provides common usable extensions for working with <see cref="IPAddress"/>.
/// </summary>
public static class IPAddressExtensions
{
    /// <summary>
    /// Determines whether an IP address is private as per <a href="http://tools.ietf.org/html/rfc1918">RFC1918</a>.
    /// </summary>
    /// <remarks>
    /// The Network Operations Team (=> Yusuf Sar) confirmed that private IP Addresses
    /// cannot be spoofed, or more exactly will not be routed, from outside our systems.
    /// </remarks>
    public static bool IsPrivate(this IPAddress address)
    {
        if (IPAddress.IsLoopback(address))
            return true;

        if (address.AddressFamily == AddressFamily.InterNetworkV6)
            return address.IsIPv6SiteLocal;

        // As per RFC1918, private IPv4 addresses are:
        // 10.0.0.0        -   10.255.255.255  (10/8 prefix)
        // 172.16.0.0      -   172.31.255.255  (172.16/12 prefix)
        // 192.168.0.0     -   192.168.255.255 (192.168/16 prefix)
        var bytes = address.GetAddressBytes();

        return bytes[0] == 10
               || (bytes[0] == 172 && bytes[1] >= 16 && bytes[1] <= 31)
               || (bytes[0] == 192 && bytes[1] == 168);
    }

    private static readonly IReadOnlyList<IPAddress> LocalhostAddresses = new[] { "127.0.0.1", "::1" }.ConvertAll(IPAddress.Parse);

    internal static bool IsLocal(this IPAddress address)
        => LocalhostAddresses.Contains(address);
}
