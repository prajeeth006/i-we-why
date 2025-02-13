using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class SingleTenantResolverTests
{
    [Fact]
    public void ShouldAlwaysReturnSameTenant()
    {
        var target = new SingleTenantResolver();

        // Act
        var tenant = target.ResolveName();

        tenant.Should().NotBeNull();
        target.ResolveName().Should().BeSameAs(tenant);
    }
}
