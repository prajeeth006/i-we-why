using System;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Account.SofStatus;

public class SofStatusDetailsServiceClientTests
{
    private readonly ISofStatusDetailsServiceClient target;
    private readonly Mock<IPosApiRestClient> restClientMock;
    private readonly Mock<IPosApiDataCache> cacheMock;
    private readonly TestClock clock;
    private readonly ExecutionMode mode;

    public SofStatusDetailsServiceClientTests()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        cacheMock = new Mock<IPosApiDataCache>();
        clock = new TestClock { UtcNow = new UtcDateTime(2021, 8, 6, 23, 5, 6) };
        mode = TestExecutionMode.Get();
        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<SofStatusDetails>(default, default, null, null, default, null))
            .Returns((
                ExecutionMode mode,
                PosApiDataType dataType,
                RequiredString key,
                Func<Task<SofStatusDetails>> valueFactory,
                bool cached,
                TimeSpan? relativeExpiration) => valueFactory());

        target = new SofStatusDetailsServiceClient(restClientMock.Object, cacheMock.Object, clock);
    }

    [Fact]
    public async Task ShouldGetSofStatusDetails()
    {
        restClientMock.Setup(s => s.ExecuteAsync<SofStatusDetailsDto>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new SofStatusDetailsDto("red", new UtcDateTime(2021, 8, 4, 23, 45, 6)));

        var result = await target.GetSofStatusDetailsAsync(mode, false);

        result.SofStatus.Should().Be("red");
        result.RedStatusDays.Should().Be(26);
        restClientMock.Verify(v => v.ExecuteAsync<SofStatusDetailsDto>(mode,
            It.Is<PosApiRestRequest>(p =>
                p.Url.ToString().Contains("Account.svc/SofStatusDetails") && p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);
    }

    [Fact]
    public async Task ShouldReturnDefaultSofStatus()
    {
        restClientMock.Setup(s => s.ExecuteAsync<SofStatusDetailsDto>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>()))
            .ThrowsAsync(new PosApiException(posApiCode: -2));

        var result = await target.GetSofStatusDetailsAsync(mode, false);

        result.SofStatus.Should().BeNull();
        result.RedStatusDays.Should().Be(-1);
        restClientMock.Verify(v => v.ExecuteAsync<SofStatusDetailsDto>(mode,
            It.Is<PosApiRestRequest>(p =>
                p.Url.ToString().Contains("Account.svc/SofStatusDetails") && p.Authenticate && p.Method == HttpMethod.Get)), Times.Once);
    }
}
