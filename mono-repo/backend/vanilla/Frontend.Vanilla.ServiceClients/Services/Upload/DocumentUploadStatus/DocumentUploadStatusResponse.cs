namespace Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;

/// <summary>
/// Document upload status response.
/// </summary>
internal sealed class DocumentUploadStatusResponse(bool isPending = default, string docsPendingWith = default)
{
    /// <summary>
    /// Is pending.
    /// </summary>
    public bool IsPending { get; } = isPending;

    /// <summary>
    /// Document pending with.
    /// </summary>
    public string DocsPendingWith { get; } = docsPendingWith;
}
