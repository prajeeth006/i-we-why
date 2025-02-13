using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class DocumentUploadStatusDslProvider(
    IPosApiUploadServiceInternal posApiUploadServiceInternal,
    ICurrentUserAccessor currentUserAccessor) : IDocumentUploadStatusDslProvider
{
    public Task<bool> IsPendingAsync(ExecutionMode mode, string useCase)
        => currentUserAccessor.User.IsAuthenticatedOrHasWorkflow()
            ? GetDocumentUploadStatusAsync(mode, useCase, s => s.IsPending)
            : Task.FromResult(false);

    public Task<string> PendingWithAsync(ExecutionMode mode, string useCase)
        => currentUserAccessor.User.IsAuthenticatedOrHasWorkflow()
            ? GetDocumentUploadStatusAsync(mode, useCase, s => s.DocsPendingWith)
            : Task.FromResult(string.Empty);

    private async Task<T> GetDocumentUploadStatusAsync<T>(ExecutionMode mode, string useCase, Func<DocumentUploadStatusResponse, T> getValue)
    {
        var uploadStatus = await posApiUploadServiceInternal.GetDocumentUploadStatusAsync(mode, false, useCase);

        return getValue(uploadStatus);
    }
}
