using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests;

public class CurrentChangesetResolverTests
{
    private ICurrentChangesetResolver target;
    private Mock<IConfigurationContainer> configContainer;
    private Mock<IConfigurationSnapshot> snapshot;

    public CurrentChangesetResolverTests()
    {
        configContainer = new Mock<IConfigurationContainer>();
        target = new CurrentChangesetResolver(configContainer.Object);

        snapshot = new Mock<IConfigurationSnapshot>();
        snapshot.SetupGet(s => s.ActiveChangeset).Returns(Mock.Of<IValidChangeset>());
        configContainer.Setup(c => c.GetSnapshot()).Returns(snapshot.Object);
    }

    [Fact]
    public void ShouldGetActiveChangeset_IfNoOverrides()
        => RunAndExpect(snapshot.Object.ActiveChangeset);

    [Fact]
    public void ShouldGetOverriddenChangeset()
    {
        snapshot.SetupGet(s => s.OverriddenChangeset).Returns(Mock.Of<IValidChangeset>());
        RunAndExpect(snapshot.Object.OverriddenChangeset);
    }

    private void RunAndExpect(IValidChangeset expected)
        => target.Resolve().Should().BeSameAs(expected);
}
