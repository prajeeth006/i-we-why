using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class CurfewStatusDslProviderSyntaxTests : SyntaxTestBase<ICurfewStatusDslProvider>
{
    [Fact]
    public void IsDepositCurfewOn_Test()
    {
        Provider.Setup(p => p.GetIsDepositCurfewOnAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(true);
        EvaluateAndExpect("CurfewStatus.IsDepositCurfewOn", true);
    }
}
