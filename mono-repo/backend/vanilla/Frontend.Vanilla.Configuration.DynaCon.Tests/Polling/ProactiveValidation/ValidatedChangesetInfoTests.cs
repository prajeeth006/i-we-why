using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Polling.ProactiveValidation;
using Frontend.Vanilla.Core.System;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Polling.ProactiveValidation;

public class ValidatedChangesetInfoTests
{
    [Fact]
    public void ShouldCreateCorrectly()
    {
        var time = new UtcDateTime(2000, 1, 1);

        // Act
        var target = new ValidatedChangesetInfo(time, 111, "Info");

        target.ChangesetId.Should().Be(111);
        target.Result.Value.Should().Be("Info");
        target.Time.Should().Be(time);
    }
}
