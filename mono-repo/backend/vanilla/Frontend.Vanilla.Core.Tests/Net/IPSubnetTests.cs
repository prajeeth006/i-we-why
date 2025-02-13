using System;
using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Testing.FluentAssertions;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public class IPSubnetTests
{
    [Theory]
    [InlineData("192.168.1.0/24", "192.168.1.0", 24, "255.255.255.0")]
    [InlineData("192.160.0.0/11", "192.160.0.0", 11, "255.224.0.0")]
    [InlineData("128.0.0.0/1", "128.0.0.0", 1, "128.0.0.0")]
    [InlineData("192.168.16.38/31", "192.168.16.38", 31, "255.255.255.254")]
    [InlineData("2001:db8::/35", "2001:db8::", 35, "ffff:ffff:e000::")]
    public void Constructor_ShouldCreateCorrectly(string inputCidr, string expectedIP, int expectedMask, string expectedMaskIP)
    {
        var target = new IpSubnet(inputCidr); // Act

        target.NetworkAddress.Should().Be(IPAddress.Parse(expectedIP));
        target.Mask.Should().Be(expectedMask);
        target.MaskAddress.Should().Be(IPAddress.Parse(expectedMaskIP));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("  ")]
    public void Constructor_ShouldThrow_IfNullOrWhiteSpace(string inputCidr)
        => new Action(() => new IpSubnet(inputCidr)).Should().Throw<ArgumentException>();

    [Theory]
    [InlineData("192.168.0.1")]
    [InlineData("192.168.0.1/12/14")]
    public void Constructor_ShouldThrow_IfInvalidCidrFormat(string inputCidr)
        => RunErrorTest(inputCidr, "There must be a single slash '/' separating network address and its mask.");

    [Theory]
    [InlineData("192wtf/24")]
    [InlineData("/16")]
    public void Constructor_ShouldThrow_IfInvalidIP(string inputCidr)
        => RunErrorTest(inputCidr, "An invalid IP address was specified.");

    [Theory]
    [InlineData("0")]
    [InlineData("-8")]
    [InlineData("32")]
    [InlineData("35")]
    public void Constructor_ShouldThrow_IfMaskOutsideRange(string mask)
        => RunErrorTest("192.168.1.0/" + mask, "Network mask suffix must be greater than 0 and less than 32 to support at least some hosts.");

    [Fact]
    public void Constructor_ShouldThrow_IfAddressNotAccordingToMask()
        => RunErrorTest("192.168.67.74/20",
            "Network address must end with zeros but '192.168.67.74' according to mask /20 (hence '255.255.240.0') ends with '0.0.3.74'.");

    private static void RunErrorTest(string inputCidr, string expectedErrorMsg)
        => new Action(() => new IpSubnet(inputCidr))
            .Should().Throw<ArgumentException>()
            .WithMessage($"Failed creating IP subnet from value '{inputCidr}'. Most likely it's not according to CIDR notation.")
            .WithInnerMessage(expectedErrorMsg);

    [Theory]
    [InlineData("192.168.0.0", true)]
    [InlineData("192.168.12.3", true)]
    [InlineData("192.168.63.255", true)]
    [InlineData("192.168.64.0", false)]
    [InlineData("192.0.1.1", false)]
    [InlineData("192.12.0.1", false)]
    public void Contains_ShouldEvaluateCorrectly(string rawAddress, bool expected)
    {
        var target = new IpSubnet("192.168.0.0/18");
        var address = IPAddress.Parse(rawAddress);

        target.Contains(address).Should().Be(expected); // Act
    }

    [Fact]
    public void ToString_ShouldReturnCidrNotation()
        => new IpSubnet("192.168.0.0/18").ToString().Should().Be("192.168.0.0/18");

    [Fact]
    public void Json_ShouldDeserializeFromString()
    {
        var target = JsonConvert.DeserializeObject<IpSubnet>("'192.168.0.0/18'");
        target.Should().Be(new IpSubnet("192.168.0.0/18"));
    }

    [Fact]
    public void Json_ShouldSerializeToString()
    {
        var json = JsonConvert.SerializeObject(new IpSubnet("192.168.0.0/18"));
        json.Should().BeJson("'192.168.0.0/18'");
    }
}
