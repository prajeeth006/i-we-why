using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.DocumentUploadStatus;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class DocumentUploadStatusController : BaseController
{
    private readonly IPosApiUploadServiceInternal posApiUploadServiceInternal;
    private readonly ILogger<DocumentUploadStatusController> logger;
    public DocumentUploadStatusController(IServiceProvider provider)
        : this(provider.GetRequiredService<IPosApiUploadServiceInternal>(),
    provider.GetRequiredService<ILogger<DocumentUploadStatusController>>()) { }

    internal DocumentUploadStatusController(
        IPosApiUploadServiceInternal posApiUploadServiceInternal, ILogger<DocumentUploadStatusController> logger)
    {
        this.posApiUploadServiceInternal = posApiUploadServiceInternal;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken, bool cached, string? useCase)
    {
        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var documentUploadStatus = await posApiUploadServiceInternal.GetDocumentUploadStatusAsync(mode, cached, useCase);

            return Ok(new
            {
                PendingWith = documentUploadStatus.DocsPendingWith,
                IsPending = documentUploadStatus.IsPending,
            });
        }
        catch (PosApiException posEx)
        {
            logger.LogError(posEx, "Error from PosApi while retrieving DocumentUploadStatus information");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while retrieving DocumentUploadStatus information");

            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }
}
