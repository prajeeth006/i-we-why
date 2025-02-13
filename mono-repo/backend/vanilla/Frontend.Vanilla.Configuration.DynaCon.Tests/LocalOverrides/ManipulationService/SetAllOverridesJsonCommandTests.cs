using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.ManipulationService;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides.ManipulationService;

public class SetAllOverridesJsonCommandTests
{
    private ISetAllOverridesJsonCommand target;
    private Mock<IOverridesStorage> overridesStorage;
    private Mock<IChangesetOverrider> changesetOverrider;

    private IConfigurationSnapshot snapshot;
    private JObject overrides;
    private Exception testEx;

    public SetAllOverridesJsonCommandTests()
    {
        overridesStorage = new Mock<IOverridesStorage>();
        var configurationContainer = new Mock<IConfigurationContainer>();
        changesetOverrider = new Mock<IChangesetOverrider>();
        target = new SetAllOverridesJsonCommand(overridesStorage.Object, configurationContainer.Object, changesetOverrider.Object);

        snapshot = Mock.Of<IConfigurationSnapshot>(s => s.ActiveChangeset.Id == 123);
        overrides = JObject.Parse("{ Overrides: 123 }");
        testEx = new Exception("Oups");
        configurationContainer.Setup(c => c.GetSnapshot()).Returns(snapshot);
    }

    [Fact]
    public void ShouldValidateAndSetOverridesToStorage()
    {
        // Act
        target.Set(overrides);

        changesetOverrider.Verify(o => o.Override(snapshot.ActiveChangeset, overrides));
        overridesStorage.Verify(s => s.Set(overrides));
    }

    [Fact]
    public void ShouldWrapOverridesError()
    {
        changesetOverrider.Setup(o => o.Override(snapshot.ActiveChangeset, overrides)).Throws(testEx);

        var act = () => target.Set(overrides);

        var ex = act.Should().Throw().Which;
        ex.Message.Should().Contain("123");
        ex.InnerException.Should().BeSameAs(testEx);
    }

    [Fact]
    public void ShouldNotCatch_IfStorageError()
    {
        overridesStorage.Setup(s => s.Set(overrides)).Throws(testEx);

        var act = () => target.Set(overrides);

        act.Should().Throw().SameAs(testEx);
    }
}
