using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Services.Notification.OfferStatuses;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class OfferStatusDslProviderSyntaxTests : SyntaxTestBase<IOfferDslProvider>
{
    [Theory, BooleanData]
    public void IsOfferedTest(bool isOffered)
    {
        Provider.Setup(p => p.IsOfferedAsync(Mode, "aaa", "123")).ReturnsAsync(isOffered);
        EvaluateAndExpect("Offer.IsOffered('aaa', '123')", isOffered);
    }

    [Fact]
    public void GetStatusTest()
    {
        Provider.Setup(p => p.GetStatusAsync(Mode, "aaa", "123")).ReturnsAsync(OfferStatus.Offered);
        EvaluateAndExpect("Offer.GetStatus('aaa', '123')", OfferStatus.Offered);
    }
}
