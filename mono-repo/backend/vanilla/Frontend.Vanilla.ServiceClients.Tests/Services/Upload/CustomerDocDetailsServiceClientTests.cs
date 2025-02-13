using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Upload;

public class CustomerDocDetailsServiceClientTests
{
    private readonly ICustomerDocDetailsServiceClient target;
    private readonly Mock<IGetDataServiceClient> getDataServiceClient;
    private readonly ExecutionMode mode;

    public CustomerDocDetailsServiceClientTests()
    {
        getDataServiceClient = new Mock<IGetDataServiceClient>();
        mode = TestExecutionMode.Get();

        target = new CustomerDocDetailsServiceClient(getDataServiceClient.Object);
    }

    [Theory]
    [InlineData(DocumentUseCase.TwoPlusTwo, true)]
    [InlineData(DocumentUseCase.Sof, true)]
    [InlineData(null, false)]
    public void ShouldGetDataCorrectly(string useCase, bool isStatusHistoryRequest)
    {
        target.GetAsync(mode, useCase, isStatusHistoryRequest);

        var expectedUrl =
            new PathRelativeUri(
                $"{PosApiServiceNames.Upload}/CustomerDocDetails?useCase={useCase}&isStatusHistoryRequest={isStatusHistoryRequest}");

        getDataServiceClient.Verify(c =>
            c.GetAsync<CustomerDocDetailsDto, CustomerDocDetailsResponse>(mode, PosApiDataType.User, expectedUrl, false, null, null));
    }
}
