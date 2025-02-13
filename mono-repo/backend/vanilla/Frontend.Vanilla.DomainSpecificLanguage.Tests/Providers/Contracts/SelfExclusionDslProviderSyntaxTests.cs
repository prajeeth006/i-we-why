using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class SelfExclusionDslProviderSyntaxTests : SyntaxTestBase<ISelfExclusionDslProvider>
{
    [Fact]
    public void Get_Category()
    {
        Provider.Setup(p => p.GetCategoryAsync(Mode)).ReturnsAsync("self");
        EvaluateAndExpect("SelfExclusion.Category", "self");
    }

    [Fact]
    public void Get_StartDate()
    {
        Provider.Setup(p => p.GetStartDateAsync(Mode)).ReturnsAsync("12.12.2021");
        EvaluateAndExpect("SelfExclusion.StartDate", "12.12.2021");
    }

    [Fact]
    public void Get_EndDate()
    {
        Provider.Setup(p => p.GetEndDateAsync(Mode)).ReturnsAsync("12.12.2021");
        EvaluateAndExpect("SelfExclusion.EndDate", "12.12.2021");
    }
}
