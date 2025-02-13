using System;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services;
using Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.SelfExclusion;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.ResponsibleGaming.SelfExclusion;

public class SelfExclusionServiceClientTests
{
    private readonly ISelfExclusionServiceClient target;
    private readonly Mock<IPosApiRestClient> restClientMock;
    private readonly Mock<IPosApiDataCache> cacheMock;
    private readonly ExecutionMode mode;

    public SelfExclusionServiceClientTests()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        cacheMock = new Mock<IPosApiDataCache>();
        mode = TestExecutionMode.Get();
        target = new SelfExclusionServiceClient(restClientMock.Object, cacheMock.Object);
    }

    [Fact]
    public async Task ShouldGetSelfExclusionDetails()
    {
        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<SelfExclusionDetails>(default, default, null, null, default, null))
            .Returns((ExecutionMode _, PosApiDataType _, RequiredString _, Func<Task<SelfExclusionDetails>> valueFactory, bool _, TimeSpan? _) => valueFactory());
        var details = new SelfExclusionDetails("cat", new UtcDateTime(2021, 5, 12), new UtcDateTime(2021, 7, 22));
        restClientMock.Setup(s => s.ExecuteAsync<SelfExclusionDetails>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>())).ReturnsAsync(details);

        var result = await target.GetSelfExclusionDetailsAsync(mode);

        result.Should().BeEquivalentTo(details);
        restClientMock.Verify(
            v => v.ExecuteAsync<SelfExclusionDetails>(mode,
                It.Is<PosApiRestRequest>(p =>
                    p.Url.ToString().Contains(PosApiEndpoint.ResponsibleGaming.SelfExclusionDetails.ToString()) && p.Authenticate && p.Method == HttpMethod.Get)),
            Times.Once);
    }
}
