using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public class EmptyDictionaryTests
{
    [Fact]
    public void ShouldBeEmpty()
        => EmptyDictionary<string, int>.Singleton.Should().BeEmpty();
}
