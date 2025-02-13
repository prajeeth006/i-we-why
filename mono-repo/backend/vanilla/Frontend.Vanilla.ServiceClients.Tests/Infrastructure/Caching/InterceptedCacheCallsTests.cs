using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class InterceptedCacheCallsTests
{
    [Fact]
    public void ShouldCollectEntriesCorrectly()
    {
        var target = new InterceptedCacheCalls();

        target.Add(PosApiDataType.User, "Balance", typeof(decimal));
        target.Add(PosApiDataType.User, "Balance", typeof(decimal));
        target.Add(PosApiDataType.Static, "Countries", typeof(string));

        target.Should().BeEquivalentTo(new[]
        {
            (PosApiDataType.User, (RequiredString)"Balance", typeof(decimal)),
            (PosApiDataType.Static, (RequiredString)"Countries", typeof(string)),
        });
    }
}
