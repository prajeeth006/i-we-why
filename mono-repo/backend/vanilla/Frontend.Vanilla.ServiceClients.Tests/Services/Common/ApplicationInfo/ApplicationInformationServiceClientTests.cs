#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.ApplicationInfo;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.ApplicationInfo;

public sealed class ApplicationInformationServiceClientTests : SimpleGetDataTestsBase
{
    private readonly IApplicationInformationServiceClient target;

    public ApplicationInformationServiceClientTests() => target = new ApplicationInformationServiceClient(GetDataServiceClient.Object);

    [Theory]
    [InlineData("DE", "Common.svc/NativeApps/Android/556?country=DE&lang=sw")]
    [InlineData(null, "Common.svc/NativeApps/Android/556?lang=sw")]
    public Task ShouldGetDataCorrectly(string? countryId, string expectedUrl)
        => RunTest<ApplicationInformation, ApplicationInformation>(
            act: () => target.GetAsync(Mode, "Android", "556", countryId),
            expectedDataType: PosApiDataType.Static,
            expectedUrl);
}
