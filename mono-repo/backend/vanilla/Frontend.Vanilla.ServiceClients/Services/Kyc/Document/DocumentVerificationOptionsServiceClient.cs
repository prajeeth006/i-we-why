using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc.Document;

internal interface IDocumentVerificationOptionsServiceClient
{
    Task<DocumentVerificationOptionsResponse> GetAsync(ExecutionMode mode, string useCase = DocumentUseCase.All);
}

internal sealed class DocumentVerificationOptionsServiceClient(IPosApiRestClient restClient) : IDocumentVerificationOptionsServiceClient
{
    public Task<DocumentVerificationOptionsResponse> GetAsync(ExecutionMode mode, string useCase = DocumentUseCase.All)
        => ExecuteAsync(useCase, mode);

    private async Task<DocumentVerificationOptionsResponse> ExecuteAsync(string useCase, ExecutionMode mode)
    {
        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Kyc)
            .AppendPathSegment("Document/VerificationOptions")
            .AddQueryParameters(("useCase", useCase ?? DocumentUseCase.All));

        var posApiRequest = new PosApiRestRequest(url.GetRelativeUri()) { Authenticate = true };
        var response = await restClient.ExecuteAsync<DocumentVerificationOptionsDto>(mode, posApiRequest);

        return response?.GetData();
    }
}
