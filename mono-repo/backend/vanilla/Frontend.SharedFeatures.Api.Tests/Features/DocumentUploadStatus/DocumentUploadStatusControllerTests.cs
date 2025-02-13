using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.DocumentUploadStatus;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.DocumentUploadStatus;

public class DocumentUploadStatusControllerTests
{
    private readonly DocumentUploadStatusController target;
    private readonly CancellationToken ct;

    public DocumentUploadStatusControllerTests()
    {
        var posApiUploadServiceInternalMock = new Mock<IPosApiUploadServiceInternal>();
        var log = new TestLogger<DocumentUploadStatusController>();

        ct = TestCancellationToken.Get();

        target = new DocumentUploadStatusController(posApiUploadServiceInternalMock.Object, log);

        posApiUploadServiceInternalMock
            .Setup(o => o.GetDocumentUploadStatusAsync(It.IsAny<ExecutionMode>(), It.IsAny<bool>(), "testCase"))
            .Returns(Task.FromResult(new DocumentUploadStatusResponse(isPending: true, docsPendingWith: "CS")));
    }

    [Fact]
    public async Task Get_ReturnDocumentUploadStatus()
    {
        var result = (OkObjectResult)await target.Get(ct, false, "testCase");

        result.Value.Should().BeEquivalentTo(new
        {
            PendingWith = "CS",
            IsPending = true,
        });
    }
}
