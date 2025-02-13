using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Content.BettingTranslations;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Content.BettingTranslations;

public sealed class BettingTranslationsServiceClientTests : SimpleGetDataTestsBase
{
    private readonly IBettingTranslationsServiceClient target;

    public BettingTranslationsServiceClientTests() => target = new BettingTranslationsServiceClient(GetDataServiceClient.Object);

    [Fact]
    public Task ShouldGetDataCorrectly()
        => RunTest<Translation, Translation>(
            act: () => target.GetTranslationAsync(Mode, "Sport", "14"),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Content.svc/betting/Sport/14",
            expectedCacheKey: "Content.svc/betting/Sport/14#sw-KE");
}
