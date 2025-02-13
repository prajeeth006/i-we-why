using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public class IPAddressExtensionsTests
{
    [Theory]
    [InlineData("127.0.0.1", true)] // Loopback
    [InlineData("127.100.200.66", true)] // Loopback
    [InlineData("0:0:0:0:0:0:0:1", true)] // IPv6 loopback
    [InlineData("FEC0:0:0:0:0:0:0:1", true)] // IPv6 site local
    [InlineData("BBC0:0:0:0:0:0:0:1", false)]
    [InlineData("0:0:CAFE:BABE:0:0:0:1", false)]
    [InlineData("10.0.0.1", true)] // 10.* range
    [InlineData("10.255.0.1", true)] // 10.* range
    [InlineData("10.0.255.1", true)] // 10.* range
    [InlineData("172.16.0.1", true)] // 172.16-31.* range
    [InlineData("172.20.255.1", true)] // 172.16-31.* range
    [InlineData("172.31.255.1", true)] // 172.16-31.* range
    [InlineData("172.15.255.36", false)]
    [InlineData("172.32.0.6", false)]
    [InlineData("192.168.0.1", true)] // 192.168.* range
    [InlineData("192.168.125.66", true)] // 192.168.* range
    [InlineData("192.168.255.255", true)] // 192.168.* range
    [InlineData("192.167.135.86", false)]
    [InlineData("192.169.4.3", false)]
    [InlineData("92.168.3.10", false)]
    [InlineData("71.20.99.21", false)]
    [InlineData("1.12.33.255", false)]
    public void IsPrivate_Test(string address, bool expected)
        => IPAddress.Parse(address).IsPrivate().Should().Be(expected);
}
