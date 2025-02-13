using FluentAssertions;
using Frontend.SharedFeatures.Api.Features.UserDocuments;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Kyc;
using Frontend.Vanilla.Features.UserDocuments;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Frontend.Vanilla.Testing.Fakes;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;

namespace Frontend.SharedFeatures.Api.Tests.Features.UserDocuments;

// TODO: Add more tests
public class UserDocumentsControllerTests
{
    private readonly UserDocumentsController target;
    private readonly Mock<IPosApiUploadServiceInternal> posApiUploadServiceInternalMock;
    private readonly Mock<IPosApiKycServiceInternal> posApiKycServiceInternalMock;
    private readonly Mock<IUserDocumentsConfiguration> userDocumentsConfigurationMock;
    private readonly Mock<IKycConfiguration> kycConfigurationMock;
    private readonly TestLogger<UserDocumentsController> log;
    private readonly CancellationToken cancellationToken;

    public UserDocumentsControllerTests()
    {
        posApiUploadServiceInternalMock = new Mock<IPosApiUploadServiceInternal>();
        posApiKycServiceInternalMock = new Mock<IPosApiKycServiceInternal>();
        userDocumentsConfigurationMock = new Mock<IUserDocumentsConfiguration>();
        kycConfigurationMock = new Mock<IKycConfiguration>();
        log = new TestLogger<UserDocumentsController>();

        cancellationToken = new CancellationTokenSource().Token;

        userDocumentsConfigurationMock.Setup(x => x.IsEnabled).Returns(true);
        userDocumentsConfigurationMock.Setup(x => x.DocumentVerificationStatus)
            .Returns(new Dictionary<string, string[]> { [CustomerDocDetailsStatus.Verified] = new[] { "Approved" } });

        var expression = new Mock<IDslExpression<bool>>();
        expression.Setup(x => x.Evaluate()).Returns(true);
        kycConfigurationMock.Setup(x => x.UserKycStatus)
            .Returns(new Dictionary<string, IDslExpression<bool>> { [DocumentUseCase.Kyc] = expression.Object });

        target = new UserDocumentsController(
            posApiUploadServiceInternalMock.Object,
            posApiKycServiceInternalMock.Object,
            userDocumentsConfigurationMock.Object,
            kycConfigurationMock.Object,
            log);
    }

    [Fact]
    public async Task Get_ShouldReturnValueIfEnabled()
    {
        // Setup
        var response = CreateDocDetailsResponse(DocumentUseCase.Kyc);
        posApiUploadServiceInternalMock
            .Setup(x => x.GetCustomerDocDetailsAsync(ExecutionMode.Async(cancellationToken), It.IsAny<string>(), It.IsAny<bool>()))
            .ReturnsAsync(response);

        // Act
        var result = (OkObjectResult)await target.Get(cancellationToken);

        var expected = new CustomerDocDetailsResponse
        {
            DocumentVerificationStatus = new List<DocumentVerificationStatus>
            {
                new ()
                {
                    UseCase = DocumentUseCase.Kyc,
                    DocumentDetails = new List<DocumentDetails>
                    {
                        new () { DocumentStatus = CustomerDocDetailsStatus.Required },
                    },
                },
            },
        };

        // Assert
        result.Value.Should().BeEquivalentTo(expected);
    }

    private static CustomerDocDetailsResponse CreateDocDetailsResponse(string useCase, bool isVerified = false, DateTime? verifiedTime = default)
    {
        var documentVerificationStatus = new DocumentVerificationStatus(
            documentDetails: new List<DocumentDetails>(),
            useCase: useCase,
            isVerified: isVerified,
            verifiedTime: verifiedTime);

        return new CustomerDocDetailsResponse
        {
            DocumentVerificationStatus = new List<DocumentVerificationStatus>
            {
                documentVerificationStatus,
            },
        };
    }
}
