using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.Inbox;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Inbox;

public class InboxClientConfigProviderTests
{
    [Fact]
    public async Task GetClientConfiguration_ReturnsConfig()
    {
        var inboxConfiguration = new InboxConfiguration();
        var provider = new InboxClientConfigProvider(inboxConfiguration);

        var clientConfiguration = await provider.GetClientConfigAsync(CancellationToken.None);

        clientConfiguration.Should().NotBeNull();
    }
}
