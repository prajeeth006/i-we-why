using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;

internal sealed class DocumentUploadStatusDto : IPosApiResponse<DocumentUploadStatusResponse>
{
    public bool IsPending { get; set; }
    public string DocsPendingWith { get; set; }

    public DocumentUploadStatusResponse GetData() =>
        new (isPending: IsPending, docsPendingWith: DocsPendingWith);
}
