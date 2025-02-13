using System.Net;
using FluentAssertions;
using Frontend.Vanilla.Core.Net;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Net;

public sealed class LoopbackIPResolverTests
{
    [Fact]
    public void ShouldReturnLocalhost()
    {
        IClientIPResolver target = new LoopbackIpResolver();
        target.Resolve().Should().Be(IPAddress.Parse("127.0.0.1"));
    }
}
