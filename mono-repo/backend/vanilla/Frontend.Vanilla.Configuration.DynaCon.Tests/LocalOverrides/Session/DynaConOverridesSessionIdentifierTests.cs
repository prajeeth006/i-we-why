using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides.Session;

public class DynaConOverridesSessionIdentifierTests
{
    [Fact]
    public void Test()
    {
        IDynaConOverridesSessionIdentifier target = new StaticDynaConOverridesSessionIdentifier();

        target.Value.Should().BeNull();

        var id = target.Create();
        id.Should().NotBeNull();

        target.Value.Should().Be(id);

        target.Delete();

        target.Value.Should().BeNull();
    }
}
