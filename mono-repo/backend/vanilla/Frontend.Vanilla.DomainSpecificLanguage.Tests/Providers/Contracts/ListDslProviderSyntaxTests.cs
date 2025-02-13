using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class ListDslProviderSyntaxTests : SyntaxTestBase<IListDslProvider>
{
    [Theory, BooleanData]
    public void ContainsTest(bool value)
    {
        Provider.Setup(p => p.ContainsAsync(Mode, "Heroes", "Chuck Norris")).ReturnsAsync(value);
        EvaluateAndExpect("List.Contains('Heroes', 'Chuck Norris')", value);
    }
}
