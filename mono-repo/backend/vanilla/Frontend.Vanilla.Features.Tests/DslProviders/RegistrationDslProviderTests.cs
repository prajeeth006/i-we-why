using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.DslProviders;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DslProviders;

public class RegistrationDslProviderTests
{
    private readonly IRegistrationDslProvider target;
    private readonly Mock<ICurrentUserAccessor> currentUserAccessor;
    private readonly Mock<IPosApiAccountServiceInternal> posApiAccountService;
    private readonly TestClock clock;

    private ClaimsPrincipal user;
    private readonly ExecutionMode mode;

    public RegistrationDslProviderTests()
    {
        currentUserAccessor = new Mock<ICurrentUserAccessor>();
        posApiAccountService = new Mock<IPosApiAccountServiceInternal>();
        clock = new TestClock { UtcNow = new UtcDateTime(2021, 7, 8, 14, 5, 6) };
        target = new RegistrationDslProvider(
            currentUserAccessor.Object,
            posApiAccountService.Object,
            clock);

        user = TestUser.Get();
        mode = TestExecutionMode.Get();

        currentUserAccessor.SetupGet(c => c.User).Returns(() => user);
    }

    public static IEnumerable<object[]> TestCases
        => TestValues.Booleans.ToTestCases()
            .CombineWith(TestUser.AuthenticatedOrWorkflow);
    public static IEnumerable<object[]> AuthenticatedOrWorkflowCases => TestUser.AuthenticatedOrWorkflow.ToTestCases();

    [Fact]
    public async Task GetRegistrationDateAsync_ShouldReturnEmptyIfUserUnauthenticated()
    {
        var result = await target.GetDateAsync(mode); // Act

        result.Should().BeEmpty();
        posApiAccountService.Verify(s => s.GetRegistrationDateAsync(default(ExecutionMode)), Times.Never);
    }

    [Theory, MemberData(nameof(AuthenticatedOrWorkflowCases))]
    public async Task GetRegistrationDateAsync_ShouldGetFromAccountInfo(AuthState authState)
    {
        user = TestUser.Get(authState);
        posApiAccountService.Setup(x => x.GetRegistrationDateAsync(mode)).ReturnsAsync(
            new UtcDateTime(1984, 10, 11, 11, 22, 53));

        var result = await target.GetDateAsync(mode); // Act

        result.Should().Contain("1984-10-11");
    }

    [Fact]
    public async Task GetDaysRegisteredAsync_ShouldReturnNegativeIfUserUnauthenticated()
    {
        var result = await target.GetDaysRegisteredAsync(mode); // Act

        result.Should().Be(-1);
        posApiAccountService.Verify(s => s.GetRegistrationDateAsync(default(ExecutionMode)), Times.Never);
    }

    private static readonly IEnumerable<object[]> DaysRegisteredTestCases = new[]
    {
        new object[] { "2017-12-24 23:00:00", 0 },
        ["2017-12-24 23:59:59", 0],
        ["2017-12-25 00:00:00", 1],
        ["2017-12-26 10:00:00", 2],
        ["2018-02-26 10:00:00", 64],
    };

    public static readonly IEnumerable<object[]> DaysTestCases = DaysRegisteredTestCases.CombineWith(TestUser.AuthenticatedOrWorkflow);

    [Theory, MemberData(nameof(DaysTestCases))]
    public async Task GetDaysRegisteredAsync_ShouldGetFromAccountInfoAndCalculate(string now, int expected, AuthState authState)
    {
        var registrationDate = new DateTime(2017, 12, 24, 23, 0, 0);
        var timeZone = TimeZoneInfo.FindSystemTimeZoneById("Ekaterinburg Standard Time");
        user = TestUser.Get(authState);
        posApiAccountService.Setup(x => x.GetRegistrationDateAsync(mode)).ReturnsAsync(
            new UtcDateTime(TimeZoneInfo.ConvertTimeToUtc(registrationDate, timeZone)));
        clock.UtcNow = new UtcDateTime(TimeZoneInfo.ConvertTimeToUtc(DateTime.Parse(now), timeZone));

        var result = await target.GetDaysRegisteredAsync(mode); // Act

        result.Should().Be(expected);
    }
}
