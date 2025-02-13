using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Collections;

public sealed class KeyConflictResolutionTests
{
    [Fact]
    public void ShouldThrowByDefault()
        => default(KeyConflictResolution).Should().Be(KeyConflictResolution.Throw);
}
