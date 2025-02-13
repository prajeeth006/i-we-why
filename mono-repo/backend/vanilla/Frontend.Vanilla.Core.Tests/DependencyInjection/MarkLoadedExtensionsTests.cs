using FluentAssertions;
using Frontend.Vanilla.Core.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.DependencyInjection;

public class MarkLoadedExtensionsTests
{
    [Fact]
    public void ShouldReturnTrueOnlyFirstTime()
    {
        var services = new ServiceCollection();

        services.TryMarkAsLoaded("Module").Should().BeTrue();
        services.TryMarkAsLoaded("Module").Should().BeFalse();
        services.TryMarkAsLoaded("Module").Should().BeFalse();
        services.TryMarkAsLoaded("Other").Should().BeTrue();
        services.TryMarkAsLoaded("Other").Should().BeFalse();
    }
}
