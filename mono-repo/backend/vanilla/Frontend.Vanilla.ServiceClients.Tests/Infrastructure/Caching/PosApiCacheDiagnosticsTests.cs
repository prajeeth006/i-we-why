using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class PosApiCacheDiagnosticsTests
{
    [Fact]
    public void ShouldReturnDiagnosticInfo()
    {
        var env = Mock.Of<IEnvironment>(e => e.MachineName == "Skynet");
        var clock = new TestClock();
        IPosApiCacheDiagnostics target = new PosApiCacheDiagnostics(env, clock);

        var result = target.GetInfo(); // Act

        result.Should().BeEquivalentTo(new Dictionary<string, object>
        {
            { "Time", clock.UtcNow },
            { "ServerName", "Skynet" },
        });
    }
}
