using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Kyc.Document;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal interface IPosApiKycServiceInternal
{
    [DelegateTo(typeof(IDocumentVerificationOptionsServiceClient), nameof(IDocumentVerificationOptionsServiceClient.GetAsync))]
    Task<DocumentVerificationOptionsResponse> GetDocumentVerificationOptionsAsync(ExecutionMode mode, string useCase = DocumentUseCase.All);
}
