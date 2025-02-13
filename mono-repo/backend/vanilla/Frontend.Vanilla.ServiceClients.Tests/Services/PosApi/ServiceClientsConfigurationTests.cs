using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.PosApi;

public sealed class ServiceClientsConfigurationTests
{
    private ServiceClientsConfigurationBuilder target;

    public ServiceClientsConfigurationTests()
        => target = new ServiceClientsConfigurationBuilder { AccessId = "secret-key" };

    [Fact]
    public void ShouldCopyAllProperties()
    {
        var timeoutRules = new[] { new ServiceClientTimeoutRule(".*", TimeSpan.FromSeconds(1)) };
        var queryParametersRules = new Dictionary<string,
            IReadOnlyDictionary<string, ServiceClientQueryParametersRule>> { ["rule1"] = new Dictionary<string, ServiceClientQueryParametersRule>() };

        var header1Vals = new[] { "Value 1", "Value 2" };
        target.Headers.Add("X-Test-1", header1Vals);
        target.Headers.Add("X-Test-2", (string)null);
        target.TimeoutRules = timeoutRules;
        target.QueryParametersRules = queryParametersRules;
        target.EndpointsV2 = new Dictionary<string, EndpointConfig>
        {
            { "common.svc/reg", new EndpointConfig { Disabled = true } },
        };

        var config = target.Build(); // Act

        config.Host.Should().Be(new Uri("https://api.bwin.com/"));
        config.Version.Should().Be("V3");
        config.AccessId.Should().Be("secret-key");
        config.StaticDataCacheTime.Should().Be(TimeSpan.FromHours(1));
        config.UserDataCacheTime.Should().Be(TimeSpan.FromMinutes(5.0));
        config.HealthInfoExpiration.Should().Be(TimeSpan.FromSeconds(15));
        config.Headers.Should().BeEquivalentTo(new Dictionary<string, IReadOnlyList<string>>
        {
            { "X-Test-1", header1Vals },
            { "X-Test-2", new string[0] },
        });
        config.TimeoutRules.Should().Equal(timeoutRules);
        config.QueryParametersRules.Should().BeEquivalentTo(queryParametersRules);

        // Should be copied to prevent changes in original objs
        config.Headers["X-Test-1"].Should().NotBeSameAs(header1Vals);
        config.TimeoutRules.Should().NotBeSameAs(timeoutRules);
        config.EndpointsV2.Count.Should().Be(1);
        config.EndpointsV2.First().Should()
            .BeEquivalentTo(new KeyValuePair<Regex, EndpointConfig>(
                new Regex("common.svc/reg", RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled), new EndpointConfig { Disabled = true }));
    }
}
