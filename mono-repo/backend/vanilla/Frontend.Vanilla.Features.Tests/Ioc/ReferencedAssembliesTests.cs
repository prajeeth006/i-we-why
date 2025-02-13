using System.Collections.Generic;
using System.Reflection;
using FluentAssertions;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Ioc;

public class ReferencedAssembliesTests
{
    [Fact]
    public void ShouldCopyAssemblies()
    {
        var assembly1 = TestAssembly.Get();
        var assembly2 = TestAssembly.Get();
        var assemblies = new List<Assembly> { assembly1, assembly2 };

        var target = new ReferencedAssemblies(assemblies); // Act

        assemblies.Clear();
        target.Should().BeEquivalentTo(new List<Assembly> { assembly1, assembly2 });
    }
}
