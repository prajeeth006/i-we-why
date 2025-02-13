using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;

internal interface IDocumentUploadStatusServiceClient
{
    Task<DocumentUploadStatusResponse> GetAsync(ExecutionMode mode, bool cached, [CanBeNull] string useCase);
}

internal sealed class DocumentUploadStatusServiceClient(IGetDataServiceClient getDataServiceClient, IServiceClientsConfiguration config) : IDocumentUploadStatusServiceClient
{
    public Task<DocumentUploadStatusResponse> GetAsync(ExecutionMode mode, bool cached, string useCase)
    {
        const string key = "GetDocumentUploadStatus";
        var expiration = config.CacheTimeEndpoints.GetValue(key);
        var cacheKey = string.Concat(key, useCase);

        var url = new UriBuilder()
            .AppendPathSegment(PosApiServiceNames.Upload)
            .AppendPathSegment("DocumentUploadStatus")
            .AddQueryParametersIfValueNotWhiteSpace(("useCase", useCase))
            .GetRelativeUri();

        return getDataServiceClient.GetAsync<DocumentUploadStatusDto, DocumentUploadStatusResponse>(mode, PosApiDataType.User, url, cached, cacheKey, expiration);
    }
}
