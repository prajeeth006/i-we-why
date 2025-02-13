using FluentAssertions;
using Frontend.Vanilla.Core.Utils;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Utils;

public sealed class LazyTests
{
    [Fact]
    public void ShouldCreateLazyWithValue()
    {
        var lazy = Lazy.ToLazy(() => "bwin");
        lazy.Value.Should().Be("bwin");
    }
}
