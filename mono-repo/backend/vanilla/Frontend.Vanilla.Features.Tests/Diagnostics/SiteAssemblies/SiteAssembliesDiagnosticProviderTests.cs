using System.Collections.Generic;
using System.Reflection;
using Frontend.Vanilla.Features.Diagnostics.SiteAssemblies;
using Frontend.Vanilla.Features.Ioc;
using Frontend.Vanilla.Testing.Fakes;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.Diagnostics.SiteAssemblies;

public class SiteAssembliesDiagnosticProviderTests
{
    [Fact]
    public void ShouldGetDiagnosticsInfo()
    {
        var assembly = TestAssembly.Get("Test.Vanilla", "1.0.0.0", "1.0.0.0", false, "1.0.0.1");
        var controller = new SiteAssembliesDiagnosticProvider(new ReferencedAssemblies(new List<Assembly> { assembly }));

        // Act
        dynamic info = controller.GetDiagnosticInfo();

        Assert.Equal(info[0].Name, "Test.Vanilla");
    }
}
