using System;
using System.Net.Http;
using FluentAssertions;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure;

public sealed class PosApiRestRequestTests
{
    private PosApiRestRequest target;

    public PosApiRestRequestTests()
        => target = new PosApiRestRequest(new PathRelativeUri("some/path"));

    [Fact]
    public void ShouldHaveReasonableDefaults()
    {
        target.Url.Should().Be(new Uri("some/path", UriKind.Relative));
        target.Method.Should().Be(HttpMethod.Get);
        target.Authenticate.Should().BeFalse();
        target.Content.Should().BeNull();
        target.Headers.Should().BeEmpty();
        target.Headers.IsReadOnly.Should().BeFalse();
    }

    [Fact]
    public void Url_ShouldThrow_IfNull()
        => target.Invoking(t => t.Url = null).Should().Throw<ArgumentNullException>();

    [Fact]
    public void Method_ShouldThrow_IfNull()
        => target.Invoking(t => t.Method = null).Should().Throw<ArgumentNullException>();

    [Fact]
    public void Headers_ShouldBeCaseInsensitive()
    {
        target.Headers["foo"] = "bar";
        target.Headers["FOO"].Should().Equal("bar");
    }
}
