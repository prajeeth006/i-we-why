using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class SingleTenantSettingsFactoryTests
{
    [Fact]
    public void ShouldReturnBlueprintSettings()
    {
        var settings = TestSettings.Get();
        var target = new SingleTenantSettingsFactory(settings);

        // Act
        var result = target.Create("whatever");

        result.Should().BeSameAs(settings.TenantBlueprint);
    }
}
