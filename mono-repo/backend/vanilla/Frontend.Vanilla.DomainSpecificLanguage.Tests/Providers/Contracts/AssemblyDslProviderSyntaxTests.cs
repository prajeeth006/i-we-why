using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class AssemblyDslProviderSyntaxTests : SyntaxTestBase<IAssemblyDslProvider>
{
    [Theory, BooleanData]
    public void HasVersion_Test(bool value)
    {
        Provider.Setup(p => p.HasVersion("assemblyMock", "= 7.10.2")).Returns(value);
        EvaluateAndExpect("Assembly.HasVersion('assemblyMock', '= 7.10.2')", value);
    }
}
