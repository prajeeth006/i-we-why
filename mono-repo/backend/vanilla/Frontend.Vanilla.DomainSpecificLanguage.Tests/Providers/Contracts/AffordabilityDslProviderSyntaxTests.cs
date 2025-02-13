using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public class AffordabilityDslProviderSyntaxTests : SyntaxTestBase<IAffordabilityDslProvider>
{
    [Fact]
    public void GetLevelAsync_ShouldReturnResult()
    {
        Provider.Setup(p => p.LevelAsync(Mode))
            .ReturnsAsync("1");

        EvaluateAndExpect("Affordability.Level", "1");
    }

    [Fact]
    public void GetEmploymentGroupAsync_ShouldReturnResult()
    {
        Provider.Setup(p => p.EmploymentGroupAsync(Mode))
            .ReturnsAsync("Employed");

        EvaluateAndExpect("Affordability.EmploymentGroup", "Employed");
    }
}
