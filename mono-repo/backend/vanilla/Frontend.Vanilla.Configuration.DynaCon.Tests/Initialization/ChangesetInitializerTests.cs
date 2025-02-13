using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Initialization;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Initialization;

public sealed class ChangesetInitializerTests
{
    [Fact]
    public void ShouldSetInitialSnapshot()
    {
        var container = new Mock<IConfigurationContainer>();
        var snapshot = Mock.Of<IConfigurationSnapshot>();
        var loader = Mock.Of<IInitialChangesetLoader>(l => l.GetConfiguration(It.IsAny<bool>()) == snapshot);
        var target = new ChangesetInitializer(container.Object, loader);

        // Act
        target.Initialize();

        container.Verify(c => c.SetSnapshot(It.Is<SetSnapshotDelegate>(d => d(null) == snapshot)));
    }
}
