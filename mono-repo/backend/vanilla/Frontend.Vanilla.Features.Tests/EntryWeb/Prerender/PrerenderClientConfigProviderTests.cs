using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.EntryWeb.Prerender;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.EntryWeb.Prerender;

public class PrerenderClientConfigProviderTests
{
    [Fact]
    public async Task GetClientConfigTests()
    {
        var provider = new PrerenderClientConfigProvider(
            new PrerenderConfiguration
            {
                MaxWaitingTime = 12,
            });

        var result = await provider.GetClientConfigAsync(CancellationToken.None);

        result.Should().BeEquivalentTo(new { MaxWaitingTime = 12 });
    }
}
