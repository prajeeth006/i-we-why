using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Core.System;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Container;

public sealed class ConfigurationSnapshotTests
{
    private IValidChangeset active;

    public ConfigurationSnapshotTests()
        => active = MockChangeset<IValidChangeset>(111, validFromYear: 2000);

    [Fact]
    public void ShouldCreateWithActiveChangesetOnly()
    {
        // Act
        var target = new ConfigurationSnapshot(active);

        target.ActiveChangeset.Should().BeSameAs(active);
        target.OverriddenChangeset.Should().BeNull();
        target.FutureChangesets.Should().BeEmpty();
        target.LatestChangeset.Should().BeSameAs(active);
    }

    [Theory]
    [InlineData(2002, 2001, 222)]
    [InlineData(2001, 2002, 333)]
    public void ShouldCreateWithAllChangesets(int future1ValidFromYear, int future2ValidFromYear, int expectedLatestId)
    {
        var overridden = MockChangeset<IValidChangeset>(active.Id, validFromYear: 3000); // Should be ignored from LatestChangeset
        var future1 = MockChangeset<IValidChangeset>(222, future1ValidFromYear);
        var future2 = MockChangeset<IFailedChangeset>(333, future2ValidFromYear);

        // Act
        var target = new ConfigurationSnapshot(active, new IChangeset[] { future1, future2 }, overridden);

        target.ActiveChangeset.Should().BeSameAs(active);
        target.OverriddenChangeset.Should().BeSameAs(overridden);
        target.FutureChangesets.Should()
            .Equal(future1ValidFromYear < future2ValidFromYear ? new IChangeset[] { future1, future2 } : new IChangeset[] { future2, future1 });
        target.LatestChangeset.Id.Should().Be(expectedLatestId);
    }

    [Fact]
    public void ShouldThrow_IfOverriddenChangesetDoesNotOverrideActive()
    {
        var overridden = Mock.Of<IValidChangeset>(c => c.Id == 444);

        Func<object> act = () => new ConfigurationSnapshot(active, overriddenChangeset: overridden);

        act.Should().Throw<Exception>()
            .Which.Message.Should().ContainAll("111", "444");
    }

    private static TChangeset MockChangeset<TChangeset>(long id, int validFromYear)
        where TChangeset : class, IChangeset
        => Mock.Of<TChangeset>(c => c.Id == id && c.ValidFrom == new UtcDateTime(validFromYear, 1, 1, 1, 1, 1, 1));
}
