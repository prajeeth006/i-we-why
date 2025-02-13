using System;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Primitives;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides;

public sealed class OverridesContainerDecoratorTests
{
    private OverridesConfigurationContainerDecorator target;
    private Mock<IConfigurationContainer> inner;
    private TestMemoryCache memoryCache;
    private Mock<IOverridesStorage> overridesStorage;
    private Mock<IChangesetOverrider> changesetOverrider;

    private IConfigurationSnapshot innerSnapshot;
    private Mock<IChangeToken> overridesWatcher;
    private JObject overrides;
    private IValidChangeset overriddenChangeset;
    private SetSnapshotDelegate setSnapshotFunc;

    public OverridesContainerDecoratorTests()
    {
        inner = new Mock<IConfigurationContainer>();
        memoryCache = new TestMemoryCache();
        overridesStorage = new Mock<IOverridesStorage>();
        changesetOverrider = new Mock<IChangesetOverrider>();
        target = new OverridesConfigurationContainerDecorator(inner.Object, memoryCache, overridesStorage.Object, changesetOverrider.Object);

        innerSnapshot = new ConfigurationSnapshot(Mock.Of<IValidChangeset>(), new[] { Mock.Of<IValidChangeset>(), Mock.Of<IValidChangeset>() });
        overridesWatcher = new Mock<IChangeToken>();
        overrides = JObject.Parse("{ Override: 123 }");
        overriddenChangeset = Mock.Of<IValidChangeset>();
        setSnapshotFunc = Mock.Of<SetSnapshotDelegate>();

        inner.Setup(i => i.GetSnapshot()).Returns(innerSnapshot);
        overridesStorage.SetupGet(s => s.CurrentContextId).Returns("ctx-id");
        overridesStorage.Setup(s => s.WatchChanges()).Returns(overridesWatcher.Object);
        overridesStorage.Setup(s => s.Get()).Returns(overrides);
        changesetOverrider.Setup(o => o.Override(innerSnapshot.ActiveChangeset, overrides)).Returns(overriddenChangeset);
    }

    [Fact]
    public void ShouldOverrideChangesetAndCacheIt()
    {
        // Act
        var snapshot = target.GetSnapshot();
        var snapshot2 = target.GetSnapshot();

        snapshot.OverriddenChangeset.Should().BeSameAs(overriddenChangeset);
        snapshot.ActiveChangeset.Should().BeSameAs(innerSnapshot.ActiveChangeset);
        snapshot.FutureChangesets.Should().Equal(innerSnapshot.FutureChangesets);
        snapshot2.Should().BeSameAs(snapshot);
        memoryCache.CreatedEntries.Single().Key.Should().BeOfType<Tuple<object, object>>()
            .Which.Item2.Should().Be(new TrimmedRequiredString("ctx-id"));
        VerifyOverrideCalls(Times.Once());
    }

    [Fact]
    public void ShouldExpireCached_IfOverridesChange()
        => RunExpireCachedTest(act: () => overridesWatcher.SetupGet(w => w.HasChanged).Returns(true));

    [Fact]
    public void ShouldExpireCached_IfNewSnapshotSet()
        => RunExpireCachedTest(act: () => target.SetSnapshot(setSnapshotFunc));

    private void RunExpireCachedTest(Action act)
    {
        var beforeChange = target.GetSnapshot();

        act();

        target.GetSnapshot().Should().NotBeSameAs(beforeChange)
            .And.BeEquivalentTo(beforeChange);
        VerifyOverrideCalls(Times.Exactly(2));
    }

    [Fact]
    public void ShouldGetSameSnapshot_IfNoOverrides()
    {
        overridesStorage.SetupGet(s => s.CurrentContextId).Returns(() => null);

        // Act
        var result = target.GetSnapshot();

        result.Should().BeSameAs(innerSnapshot);
        overridesStorage.Verify(s => s.Get(), Times.Never);
        overridesStorage.Verify(s => s.WatchChanges(), Times.Never);
    }

    [Fact]
    public void ShouldSetSnapshotToInner()
    {
        target.SetSnapshot(setSnapshotFunc); // Act
        inner.Verify(i => i.SetSnapshot(setSnapshotFunc));
    }

    private void VerifyOverrideCalls(Times expected)
    {
        overridesStorage.Verify(s => s.Get(), expected);
        overridesStorage.Verify(s => s.WatchChanges(), expected);
        changesetOverrider.VerifyWithAnyArgs(o => o.Override(null, null), expected);
    }
}
