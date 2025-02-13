using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class SofStatusDetailsDslProviderSyntaxTests : SyntaxTestBase<ISofStatusDetailsDslProvider>
{
    [Fact]
    public void Get_SofStatus()
    {
        Provider.Setup(p => p.GetSofStatusAsync(Mode)).ReturnsAsync("red");
        EvaluateAndExpect("SofStatusDetails.SofStatus", "red");
    }

    [Fact]
    public void Get_RedStatusDays()
    {
        Provider.Setup(p => p.GetRedStatusDaysAsync(Mode)).ReturnsAsync(14);
        EvaluateAndExpect("SofStatusDetails.RedStatusDays", 14m);
    }
}
