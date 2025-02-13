using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;

internal interface ICustomerDocDetailsServiceClient
{
    Task<CustomerDocDetailsResponse> GetAsync(ExecutionMode mode, string useCase = DocumentUseCase.All, bool isStatusHistoryRequest = false);
}

internal sealed class CustomerDocDetailsServiceClient(IGetDataServiceClient getDataServiceClient) : ICustomerDocDetailsServiceClient
{
    public async Task<CustomerDocDetailsResponse> GetAsync(
        ExecutionMode mode,
        string useCase = DocumentUseCase.All,
        bool isStatusHistoryRequest = false)
        => await getDataServiceClient.GetAsync<CustomerDocDetailsDto, CustomerDocDetailsResponse>(
            mode,
            PosApiDataType.User,
            new UriBuilder()
                .AppendPathSegment(PosApiServiceNames.Upload)
                .AppendPathSegment("CustomerDocDetails")
                .AddQueryParameters(("useCase", useCase), ("isStatusHistoryRequest", isStatusHistoryRequest.ToString()))
                .GetRelativeUri(),
            false);
}
