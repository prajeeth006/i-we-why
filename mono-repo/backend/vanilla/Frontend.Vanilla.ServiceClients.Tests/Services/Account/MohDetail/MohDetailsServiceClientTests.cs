using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.MohDetail;

public sealed class MohDetailsServiceClientTests
{
    private readonly IMohDetailsServiceClient target;
    private readonly Mock<IGetDataServiceClient> getDataServiceClient;
    private readonly ExecutionMode mode;
    private readonly PathRelativeUri testUrl = new PathRelativeUri("Account.svc/MOHDetails");

    public MohDetailsServiceClientTests()
    {
        getDataServiceClient = new Mock<IGetDataServiceClient>();
        mode = TestExecutionMode.Get();

        target = new MohDetailsServiceClient(getDataServiceClient.Object);
    }

    [Fact]
    public void ShouldReferToCorrectData()
    {
        target.GetMohDetailsAsync(mode, true);

        getDataServiceClient.Verify(c => c.GetAsync<MohDetailsResponse, MohDetailsResponse>(mode, PosApiDataType.User, testUrl, true, "MohDetails", null));
    }

    [Fact]
    public void ShouldInvalidateCacheWhenCachedIsFalse()
    {
        target.GetMohDetailsAsync(mode, false);

        getDataServiceClient.Verify(c => c.InvalidateCached(PosApiDataType.User, "MohDetails"));
        getDataServiceClient.Verify(c => c.GetAsync<MohDetailsResponse, MohDetailsResponse>(mode, PosApiDataType.User, testUrl, false, "MohDetails", null));
    }
}
