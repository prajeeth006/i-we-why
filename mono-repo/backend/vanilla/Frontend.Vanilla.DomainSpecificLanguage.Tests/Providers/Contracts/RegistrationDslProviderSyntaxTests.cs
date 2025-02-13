using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class RegistrationDslProviderSyntaxTests : SyntaxTestBase<IRegistrationDslProvider>
{
    [Fact]
    public void RegistrationDateTest()
    {
        Provider.Setup(p => p.GetDateAsync(Mode)).ReturnsAsync("2000-01-02");
        EvaluateAndExpect("Registration.Date", "2000-01-02");
    }

    [Fact]
    public void DaysRegisteredTest()
    {
        Provider.Setup(p => p.GetDaysRegisteredAsync(Mode)).ReturnsAsync(666m);
        EvaluateAndExpect("Registration.DaysRegistered", 666m);
    }
}
