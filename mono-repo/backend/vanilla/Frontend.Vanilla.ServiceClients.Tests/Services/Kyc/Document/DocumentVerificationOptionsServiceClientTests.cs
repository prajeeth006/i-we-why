using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.Kyc.Document;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Kyc.Document;

public class DocumentVerificationOptionsServiceClientTests : ServiceClientTestsBase
{
    private IDocumentVerificationOptionsServiceClient target;

    protected override void Setup()
    {
        target = new DocumentVerificationOptionsServiceClient(RestClient.Object);
    }

    [Theory, ValuesData(null, DocumentUseCase.Kyc)]
    public async Task ShouldExecuteCorrectly(string useCase)
    {
        // Setup
        RestClientResult = new DocumentVerificationOptionsDto { VerificationSteps = new List<VerificationStepDto>() };
        var response = new DocumentVerificationOptionsResponse();

        // Act
        var result = await target.GetAsync(TestMode, useCase);

        // Assert
        result.Should().BeEquivalentTo(response);
        VerifyRestClient_ExecuteAsync(
            $"{PosApiServiceNames.Kyc}/Document/VerificationOptions?useCase={useCase ?? DocumentUseCase.All}",
            authenticate: true,
            resultType: typeof(DocumentVerificationOptionsDto));
    }
}
