using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class ConnectedAccountsDslProviderSyntaxTests : SyntaxTestBase<IConnectedAccountsDslProvider>
{
    [Fact]
    public void CountTest()
    {
        Provider.Setup(p => p.GetCountAsync(It.IsAny<ExecutionMode>())).ReturnsAsync(5m);
        EvaluateAndExpect("ConnectedAccounts.Count", 5m);
    }
}
