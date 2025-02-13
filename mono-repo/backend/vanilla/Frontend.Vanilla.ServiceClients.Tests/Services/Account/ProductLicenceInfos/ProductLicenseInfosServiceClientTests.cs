using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Account.ProductLicenseInfos;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.ProductLicenceInfos;

public class ProductLicenseInfosServiceClientTests : ServiceClientTestsBase
{
    private IProductLicenseInfosServiceClient target;
    private IReadOnlyList<LicenseInfo> licences;

    protected override void Setup()
    {
        target = new ProductLicenseInfosServiceClient(RestClient.Object, Cache.Object);

        licences = new[]
        {
            new LicenseInfo { LicenseAccepted = false, LicenseCode = "A" },
            new LicenseInfo { LicenseAccepted = true, LicenseCode = "B" },
        };
        RestClientResult = licences;
    }

    [Theory]
    [InlineData(true, true)]
    [InlineData(false, false)]
    public async Task GetAsync_ShouldExecuteCorrectly(bool cached, bool expectedCached)
    {
        // Act
        var result = await target.GetAsync(TestMode, cached);

        result.Count.Should().Be(2);
        VerifyRestClient_ExecuteAsync(PosApiEndpoint.Account.ProductLicenseInfos.ToString(), authenticate: true, resultType: typeof(IReadOnlyList<LicenseInfo>));
        VerifyCache_GetOrCreateAsync<IReadOnlyList<LicenseInfo>>(PosApiDataType.User, "ProductLicenseInfos", expectedCached);
    }
}
