using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.Geolocation.Config;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Geolocation.Config;

public class GeolocationClientConfigProviderTests
{
    private readonly IClientConfigProvider target;
    private readonly GeolocationConfiguration config;

    public GeolocationClientConfigProviderTests()
    {
        config = new GeolocationConfiguration();
        target = new GeolocationClientConfigProvider(config.GetGuardedDisableable<IGeolocationConfiguration>());
    }

    [Fact]
    public async Task ShouldReturnConfigConvertedForClient()
    {
        config.IsEnabled = true;
        config.MinimumUpdateInterval = TimeSpan.FromSeconds(66);
        config.CookieExpiration = TimeSpan.FromSeconds(77);
        config.WatchOptions = new Dictionary<string, object> { { "precision", 123 } };
        config.WatchBrowserPositionOnAppStart = true;

        // Act
        var result = await target.GetClientConfigAsync(TestContext.Current.CancellationToken);

        result.Should().BeEquivalentTo(new
        {
            config.WatchOptions,
            MinimumUpdateIntervalMilliseconds = 66_000,
            CookieExpirationMilliseconds = 77_000,
            WatchBrowserPositionOnAppStart = true,
        });
    }
}
