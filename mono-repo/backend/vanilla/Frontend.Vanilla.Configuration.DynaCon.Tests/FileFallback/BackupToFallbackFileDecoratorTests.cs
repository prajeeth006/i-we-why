using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public sealed class BackupToFallbackFileDecoratorTests
{
    private IConfigurationContainer target;
    private Mock<IConfigurationContainer> inner;
    private Mock<IFallbackFile<IValidChangeset>> fallbackFile;
    private IConfigurationSnapshot oldSnapshot;
    private IConfigurationSnapshot newSnapshot;

    public BackupToFallbackFileDecoratorTests()
    {
        inner = new Mock<IConfigurationContainer>();
        fallbackFile = new Mock<IFallbackFile<IValidChangeset>> { DefaultValue = DefaultValue.Mock };
        target = new BackupToFallbackFileDecorator(inner.Object, fallbackFile.Object);

        oldSnapshot = Mock.Of<IConfigurationSnapshot>(s => s.ActiveChangeset.Id == 1);
        newSnapshot = Mock.Of<IConfigurationSnapshot>(s => s.ActiveChangeset.Id == 2 && s.ActiveChangeset.Source == ConfigurationSource.Service);
        inner.SetupWithAnyArgs(i => i.SetSnapshot(null)).Callback<SetSnapshotDelegate>(f => f(oldSnapshot));
    }

    [Fact]
    public void GetSnapshot_ShouldDelegateToInner()
    {
        inner.Setup(i => i.GetSnapshot()).Returns(newSnapshot);
        target.GetSnapshot().Should().BeSameAs(newSnapshot); // Act
    }

    [Fact]
    public void SetSnapshot_ShouldWriteIfActiveChanged()
    {
        target.SetSnapshot(s => newSnapshot); // Act
        fallbackFile.Verify(f => f.Handler.Write(newSnapshot.ActiveChangeset));
    }

    [Fact]
    public void SetSnapshot_ShouldWriteIfNoOldOne()
    {
        oldSnapshot = null;

        target.SetSnapshot(s => newSnapshot); // Act

        fallbackFile.Verify(f => f.Handler.Write(newSnapshot.ActiveChangeset));
    }

    [Fact]
    public void SetSnapshot_ShouldNotWrite_IfActiveNotChanged()
    {
        Mock.Get(oldSnapshot).SetupGet(s => s.ActiveChangeset.Id).Returns(newSnapshot.ActiveChangeset.Id);
        RunNoWriteTest();
    }

    [Theory]
    [InlineData(ConfigurationSource.FallbackFile)]
    [InlineData(ConfigurationSource.LocalOverrides)]
    internal void SetSnapshot_ShouldNotWrite_IfNotFromServiceSource(ConfigurationSource source)
    {
        Mock.Get(newSnapshot).SetupGet(s => s.ActiveChangeset.Source).Returns(source);
        RunNoWriteTest();
    }

    [Fact]
    public void SetSnapshot_ShouldNotWrite_IfFallbackDisabled()
    {
        fallbackFile.SetupGet(f => f.Handler).Returns(() => null);
        RunNoWriteTest();
    }

    private void RunNoWriteTest()
    {
        target.SetSnapshot(s => newSnapshot); // Act
        fallbackFile.VerifyWithAnyArgs(f => f.Handler.Write(null), Times.Never);
    }
}
