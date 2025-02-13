using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebIntegration.Core.ClientIP;

public class SubnetValueExtensionsTests
{
    [Fact]
    public void ShouldReturnEmptyList_WhenNotLoaded()
    {
        var value = new SubnetValue(new List<string>());
        var result = value.Convert();
        result.Count.Should().Be(0);
    }

    [Fact]
    public void ShouldMatchSubnets()
    {
        var value = new SubnetValue(["127.0.0.0/8", "10.0.0.0/8", "103.21.244.0/22"]);

        var result = value.Convert();

        result.Should().BeEquivalentTo([new IpSubnet("127.0.0.0/8"), new IpSubnet("10.0.0.0/8"), new IpSubnet("103.21.244.0/22")]);

        // reload
        value = new SubnetValue(["10.0.0.0/8", "103.21.244.0/22"]);

        result = value.Convert();

        result.Should().BeEquivalentTo([new IpSubnet("10.0.0.0/8"), new IpSubnet("103.21.244.0/22")]);
    }
}
