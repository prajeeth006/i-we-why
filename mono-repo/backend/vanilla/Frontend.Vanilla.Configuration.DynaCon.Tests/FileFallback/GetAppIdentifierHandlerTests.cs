using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public class GetAppIdentifierHandlerTests
{
    [Fact]
    public void ShouldCollectAppInfo()
    {
        var id = GetAppIdentifier.Handler.Invoke();

        id.Should().MatchRegex(@"Process \d+")
            .And.MatchRegex(@"Vanilla \d+.\d+.\d+")
            .And.Contain(Environment.CurrentDirectory);
    }
}
