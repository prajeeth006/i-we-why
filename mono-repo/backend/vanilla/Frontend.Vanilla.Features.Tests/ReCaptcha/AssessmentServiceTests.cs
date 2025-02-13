using System;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ReCaptcha;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ReCaptcha;

public sealed class AssessmentServiceTests
{
    private readonly IAssessmentService target;
    private readonly ReCaptchaConfiguration reCaptchaConfiguration;
    private readonly Mock<IRestClient> restClient;
    private readonly CancellationToken ct;
    private readonly TestLogger<AssessmentService> log;

    public AssessmentServiceTests()
    {
        reCaptchaConfiguration = new ReCaptchaConfiguration();
        restClient = new Mock<IRestClient>();
        ct = TestCancellationToken.Get();

        reCaptchaConfiguration = new ReCaptchaConfiguration
        {
            ApiUrl = "https://recaptchaenterprise.googleapis.com/v1",
            EnterpriseSecretKey = "EnterpriseSecretKey",
            EnterpriseSiteKey = "EnterpriseSiteKey",
            EnterpriseProjectId = "project-id",
        };
        log = new TestLogger<AssessmentService>();

        target = new AssessmentService(reCaptchaConfiguration, restClient.Object, log);
    }

    [Fact]
    public async Task CreateAssessmentAsyncShouldVerifyAgainstServer()
    {
        const string response = """{ "score": 0.4, "name": "projects/project-id/assessments"}""";
        restClient.Setup(c => c.ExecuteAsync(It.IsAny<RestRequest>(), ct))
            .ReturnsAsync((RestRequest r, CancellationToken _) => new RestResponse(r) { Content = response.EncodeToBytes() });
        var recaptchaEvent = new RecaptchaEvent { Token = "userResponse" };

        await target.CreateAssessmentAsync(recaptchaEvent, ct); // Act

        var call = restClient.Invocations[0];
        var request = (RestRequest)call.Arguments[0];
        var cancellationToken = (CancellationToken)call.Arguments[1];

        cancellationToken.Should().Be(ct);
        request.Url.Should().Be("https://recaptchaenterprise.googleapis.com/v1/projects/project-id/assessments?key=EnterpriseSecretKey");
        request.Method.Should().BeSameAs(HttpMethod.Post);
        var body = (ReCaptchaEnterpriseRequest)request.Content?.Value;

        body?.Event.Token.Should().Be("userResponse");
    }

    [Fact]
    public async Task AnnotateAssessmentAsyncShouldVerifyAgainstServer()
    {
        restClient.Setup(c => c.ExecuteAsync(It.IsAny<RestRequest>(), ct));

        await target.AnnotateAssessmentAsync("projects/recaptcha-ent-integration/assessments/123456", AssessmentAnnotations.FRAUDULENT, ct); // Act

        var call = restClient.Invocations.First();
        var request = (RestRequest)call.Arguments[0];
        var cancellationToken = (CancellationToken)call.Arguments[1];

        cancellationToken.Should().Be(ct);
        request.Url.Should().Be("https://recaptchaenterprise.googleapis.com/v1/projects/recaptcha-ent-integration/assessments/123456:annotate?key=EnterpriseSecretKey");
        request.Method.Should().BeSameAs(HttpMethod.Post);
        var body = (AnnotationRequest)request.Content?.Value;

        body?.Annotation.Should().Be(AssessmentAnnotations.FRAUDULENT);
    }

    [Fact]
    public async Task AnnotateAssessmentAsyncShouldLogWhenThrown()
    {
        restClient.Setup(c => c.ExecuteAsync(It.IsAny<RestRequest>(), ct)).Throws<Exception>();

        await Assert.ThrowsAsync<Exception>(() => target.AnnotateAssessmentAsync("projects/recaptcha-ent-integration/assessments/123456", AssessmentAnnotations.FRAUDULENT, ct));

        log.Logged[0].FinalMessage.Should().Contain("Failed to annotate RecaptchaEnterprise assessment");
        log.Logged[0].FinalMessage.Should().Contain("*****"); // Check if secret was hidden.
    }
}
