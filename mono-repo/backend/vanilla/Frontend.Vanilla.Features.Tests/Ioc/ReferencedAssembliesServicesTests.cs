using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Core;
using Frontend.Vanilla.Features.CssOverrides;
using Frontend.Vanilla.Features.Ioc;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Ioc;

public sealed class ReferencedAssembliesServicesTests
{
    private readonly IServiceCollection target;

    public ReferencedAssembliesServicesTests()
    {
        target = new ServiceCollection();
    }

    [Fact]
    public void ShouldAddReferencedAssemblies()
    {
        target.AddIocFeature();
        var provider = target.BuildServiceProvider();
        var referencedAssemblies = provider.GetRequiredService<ReferencedAssemblies>();
        referencedAssemblies.Count(a => a == typeof(VanillaCoreServices).Assembly).Should().Be(1);
    }
}
