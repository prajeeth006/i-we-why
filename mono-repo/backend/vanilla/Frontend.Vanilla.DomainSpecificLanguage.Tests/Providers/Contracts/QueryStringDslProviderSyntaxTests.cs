using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class QueryStringDslProviderSyntaxTests : SyntaxTestBase<IQueryStringDslProvider>
{
    [Fact]
    public void GetTest()
    {
        Provider.Setup(p => p.Get("q")).Returns("123");
        EvaluateAndExpect("QueryString.Get('q')", "123");
    }

    [Fact]
    public void SetTest()
    {
        Execute("QueryString.Set('q', '123')");
        Provider.Verify(p => p.Set("q", "123"));
    }

    [Fact]
    public void RemoveTest()
    {
        Execute("QueryString.Remove('q')");
        Provider.Verify(p => p.Remove("q"));
    }
}
