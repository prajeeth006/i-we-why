using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;

namespace Frontend.Vanilla.ServiceClients.Services.Upload;

/// <summary>
/// Represents Upload.svc PosAPI service.
/// </summary>
internal interface IPosApiUploadServiceInternal
{
    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ICustomerDocDetailsServiceClient), nameof(ICustomerDocDetailsServiceClient.GetAsync))]
    Task<CustomerDocDetailsResponse> GetCustomerDocDetailsAsync(ExecutionMode mode, string useCase = DocumentUseCase.All, bool isStatusHistoryRequest = false);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IDocumentUploadStatusServiceClient), nameof(IDocumentUploadStatusServiceClient.GetAsync))]
    Task<DocumentUploadStatusResponse> GetDocumentUploadStatusAsync(ExecutionMode mode, bool cached = true, string useCase = null);
}
