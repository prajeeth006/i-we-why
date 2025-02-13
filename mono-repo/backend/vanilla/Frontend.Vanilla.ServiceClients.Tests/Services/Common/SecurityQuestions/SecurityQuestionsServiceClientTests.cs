#nullable enable

using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.SecurityQuestions;
using Frontend.Vanilla.ServiceClients.Tests.TestUtilities;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Common.SecurityQuestions;

public class SecurityQuestionsServiceClientTests : SimpleGetDataTestsBase
{
    private readonly ISecurityQuestionsServiceClient target;

    public SecurityQuestionsServiceClientTests() => target = new SecurityQuestionsServiceClient(GetDataServiceClient.Object);

    [Fact]
    public Task ShouldGetDataCorrectly()
        => RunTest<SecurityQuestionResponse, IReadOnlyList<SecurityQuestion>>(
            act: () => target.GetAsync(Mode),
            expectedDataType: PosApiDataType.Static,
            expectedUrl: "Common.svc/SecurityQuestions/?lang=sw-KE");
}
