using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class LicenseInfoDslProviderSyntaxTests : SyntaxTestBase<ILicenseInfoDslProvider>
{
    [Fact]
    public void AcceptanceNeededTest()
    {
        Provider.Setup(p => p.GetAcceptanceNeededAsync(default)).ReturnsAsync(true);
        EvaluateAndExpect("LicenseInfo.AcceptanceNeeded", true);
    }
}
