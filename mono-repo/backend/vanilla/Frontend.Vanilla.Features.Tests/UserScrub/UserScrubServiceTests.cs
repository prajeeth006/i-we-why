#nullable enable

using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.UserScrub;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;
using Frontend.Vanilla.ServiceClients.Services.Offers;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.UserScrub;

public sealed class UserScrubServiceTests
{
    private IUserScrubService target;
    private Mock<IPosApiCrmServiceInternal> crmService;
    private Mock<ICurrentUserAccessor> currentUserAccessor;
    private UserScrubConfiguration userScrubConfiguration;
    private UserScrubRequest userScrubRequest;
    private ExecutionMode executionMode;

    public UserScrubServiceTests()
    {
        crmService = new Mock<IPosApiCrmServiceInternal>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        userScrubRequest = new UserScrubRequest("vanilla", "case", new List<PosApiKeyValuePair>());
        userScrubConfiguration = new UserScrubConfiguration(userScrubRequest);
        executionMode = TestExecutionMode.Get();

        target = new UserScrubService(crmService.Object, currentUserAccessor.Object, userScrubConfiguration);
    }

    [Theory]
    [InlineData(true, 2)]
    [InlineData(false, 0)]
    public async Task IsScrubbedAsync_ShouldWorkForAuthenticatedUser(bool playerScrubbed, int expectedCount)
    {
        currentUserAccessor.SetupGet(c => c.User.Identity!.IsAuthenticated).Returns(true);
        crmService.Setup(c => c.GetUserScrubAsync(executionMode, userScrubRequest))
            .ReturnsAsync(new ServiceClients.Services.Crm.UserScrub.UserScrub(playerScrubbed, new List<string> { "casino", "sports" }));

        var result = await target.ScrubbedForAsync(executionMode); // act

        result.Count().Should().Be(expectedCount);
    }

    [Fact]
    public async Task IsScrubbedAsync_ShouldBeFalseForAnonymous()
    {
        currentUserAccessor.SetupGet(c => c.User.Identity!.IsAuthenticated).Returns(false);

        var result = await target.ScrubbedForAsync(executionMode); // act

        result.Count().Should().Be(0);
    }
}
