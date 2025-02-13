using System;
using System.Collections.Generic;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Upload;

public class PosApiUploadServiceClientTests
{
    private readonly IDocumentUploadStatusServiceClient target;
    private readonly Mock<IGetDataServiceClient> getDataServiceClient;
    private readonly Mock<IServiceClientsConfiguration> config;
    private readonly ExecutionMode mode;
    private static PathRelativeUri ExpectedUrl => new ($"{PosApiServiceNames.Upload}/DocumentUploadStatus");

    public PosApiUploadServiceClientTests()
    {
        getDataServiceClient = new Mock<IGetDataServiceClient>();
        config = new Mock<IServiceClientsConfiguration>();
        config.SetupGet(c => c.CacheTimeEndpoints).Returns(new Dictionary<string, TimeSpan>
            { { "GetDocumentUploadStatus", TimeSpan.FromMinutes(1) } });
        mode = TestExecutionMode.Get();

        target = new DocumentUploadStatusServiceClient(getDataServiceClient.Object, config.Object);
    }

    [Theory]
    [InlineData(true, "")]
    [InlineData(false, null)]
    public void ShouldGetDataCorrectlyWithoutUseCase(bool cached, string useCase)
    {
        target.GetAsync(mode, cached, useCase);

        getDataServiceClient.Verify(c =>
            c.GetAsync<DocumentUploadStatusDto, DocumentUploadStatusResponse>(mode, PosApiDataType.User, ExpectedUrl, cached, "GetDocumentUploadStatus", TimeSpan.FromMinutes(1)));
    }

    [Fact]
    public void ShouldGetDataCorrectlyWithUseCase()
    {
        target.GetAsync(mode, true, "testUseCase");

        getDataServiceClient.Verify(c =>
            c.GetAsync<DocumentUploadStatusDto, DocumentUploadStatusResponse>(
                mode,
                PosApiDataType.User,
                new PathRelativeUri(ExpectedUrl + "?useCase=testUseCase"),
                true,
                "GetDocumentUploadStatustestUseCase",
                TimeSpan.FromMinutes(1)));
    }
}
