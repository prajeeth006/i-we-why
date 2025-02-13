using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;
using Frontend.Vanilla.ServiceClients.Services.Offers;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.Scrub;

public class UserScrubServiceClientTests
{
    private UserScrubServiceClient target;
    private Mock<IPosApiRestClient> restClientMock;
    private Mock<IPosApiDataCache> cacheMock;
    private UserScrubRequest userScrubRequest;
    private readonly TestLogger<UserScrubServiceClient> log;
    private readonly ExecutionMode mode;

    public UserScrubServiceClientTests()
    {
        restClientMock = new Mock<IPosApiRestClient>();
        cacheMock = new Mock<IPosApiDataCache>();
        userScrubRequest = new UserScrubRequest("vanilla", "case", new List<PosApiKeyValuePair>());
        log = new TestLogger<UserScrubServiceClient>();
        mode = TestExecutionMode.Get();
        target = new UserScrubServiceClient(restClientMock.Object, cacheMock.Object, log);
    }

    [Fact]
    public async Task ShouldLog()
    {
        var exception = new Exception("test");
        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<UserScrub>(default, default, null, null, default, null))
            .Returns((ExecutionMode mode, PosApiDataType dataType, RequiredString key, Func<Task<UserScrub>> valueFactory, bool cached, TimeSpan? relativeExpiration) =>
                valueFactory());
        restClientMock.Setup(s => s.ExecuteAsync<UserScrub>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>())).ThrowsAsync(exception);

        var result = await target.GetAsync(mode, userScrubRequest);

        result.PlayerScrubbed.Should().BeFalse();
        log.Logged.Single().Verify(LogLevel.Error, exception);
    }

    [Fact]
    public async Task ShouldGetDetails()
    {
        cacheMock.SetupWithAnyArgs(c => c.GetOrCreateAsync<UserScrub>(default, default, null, null, default, null))
            .Returns((ExecutionMode mode, PosApiDataType dataType, RequiredString key, Func<Task<UserScrub>> valueFactory, bool cached, TimeSpan? relativeExpiration) =>
                valueFactory());
        restClientMock.Setup(s => s.ExecuteAsync<UserScrub>(It.IsAny<ExecutionMode>(), It.IsAny<PosApiRestRequest>()))
            .ReturnsAsync(new UserScrub(true, new List<string>()));

        var result = await target.GetAsync(mode, userScrubRequest);

        result.PlayerScrubbed.Should().BeTrue();
        restClientMock.Verify(v => v.ExecuteAsync<UserScrub>(mode,
            It.Is<PosApiRestRequest>(p => p.Url.ToString().Contains("Player/Scrub") &&
                                          p.Method == HttpMethod.Post)), Times.Once);
        log.VerifyNothingLogged();
    }
}
