using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.TrackerId;
using Frontend.Vanilla.Testing.AbstractTests;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.TrackerId;

public class TrackerIdClientConfigProviderTests : ClientConfigProviderTestsBase
{
    public TrackerIdClientConfigProviderTests()
    {
        var config = new TrackerIdConfiguration { QueryStrings = new[] { "trc", "wmid" } };
        Target = new TrackerIdClientConfigProvider(config);
    }

    [Fact]
    public async Task ShouldGetClientConfigCorrectly()
    {
        var result = await Target_GetConfigAsync();

        result.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "queryStrings", new[] { "trc", "wmid" } },
            { "btagCallEnabled", false },
            { "useOnlyWmId", false },
        });
    }
}
