using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Crm;
using Frontend.Vanilla.ServiceClients.Services.Crm.UserFlags;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class UserFlagsDslProviderTests
{
    private readonly IUserFlagsDslProvider target;
    private readonly Mock<IPosApiCrmServiceInternal> posApiCrmService;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;

    private readonly ExecutionMode mode;

    public UserFlagsDslProviderTests()
    {
        posApiCrmService = new Mock<IPosApiCrmServiceInternal>();
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        target = new UserFlagsDslProvider(posApiCrmService.Object, currentUserAccessor.Object);

        mode = TestExecutionMode.Get();
        var userFlags = new List<UserFlag>
        {
            new ("NO_OFFER", "Enabled", new[] { "R100", "R101" }),
            new ("BONUS", "Disabled"),
            new ("Test", "Enabled"),
        };

        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(true);
        posApiCrmService.Setup(s => s.GetUserFlagsAsync(mode, true)).ReturnsAsync(userFlags);
    }

    public static readonly IEnumerable<object[]> UserFlagsTestCases = new[]
    {
        new object[] { "NO_OFFER", "Enabled" },
        new object[] { "BONUS", "Disabled" },
        new object[] { "test", "Enabled" },
    };

    [Theory, MemberData(nameof(UserFlagsTestCases))]
    public async Task GetAsync_ShouldGetUserFlag(string name, string expected)
    {
        // Act
        var result = await target.GetAsync(mode, name);

        result.Should().Be(expected);
    }

    [Fact]
    public async Task GetAsync_ShouldNotGetUserFlag_IfAnonymous()
    {
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act
        var result = await target.GetAsync(mode, "NO_OFFER");

        result.Should().Be(string.Empty);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetUserFlagsAsync(It.IsAny<ExecutionMode>(), default), Times.Never);
    }

    [Fact]
    public async Task HasReasonCodeAsync_ShouldReturnFalse_IfAnonymous()
    {
        // Setup
        currentUserAccessor.SetupGet(a => a.User.Identity.IsAuthenticated).Returns(false);

        // Act
        var result = await target.HasReasonCodeAsync(mode, "R100");

        // Assert
        result.Should().Be(false);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetUserFlagsAsync(It.IsAny<ExecutionMode>(), default), Times.Never);
    }

    [Fact]
    public async Task HasReasonCodeAsync_ShouldReturnFalse_IfNotFound()
    {
        // Act
        var result = await target.HasReasonCodeAsync(mode, "R999");

        // Assert
        result.Should().Be(false);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetUserFlagsAsync(It.IsAny<ExecutionMode>(), default), Times.Once);
    }

    [Fact]
    public async Task HasReasonCodeAsync_ShouldReturnTrue_IfFound()
    {
        // Act
        var result = await target.HasReasonCodeAsync(mode, "R999, r101 ");

        // Assert
        result.Should().Be(true);
        posApiCrmService.VerifyWithAnyArgs(s => s.GetUserFlagsAsync(It.IsAny<ExecutionMode>(), default), Times.Once);
    }
}
