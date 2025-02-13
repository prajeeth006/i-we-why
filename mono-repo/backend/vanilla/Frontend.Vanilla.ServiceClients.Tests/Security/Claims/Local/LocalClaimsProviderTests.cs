using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Security.Claims.Local;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security.Claims.Local;

public class LocalClaimsProviderTests
{
    private const string TestIssuer = "Test";
    private static readonly IReadOnlyList<LocalClaimInfo> TestDeclaredClaims = new[] { new LocalClaimInfo("Claim 1", "Desc 1"), new LocalClaimInfo("Claim 2", "Desc 2") };
    private static ExecutionMode mode;

    public LocalClaimsProviderTests()
    {
        mode = ExecutionMode.Async(new CancellationTokenSource().Token);
    }

    private static ILocalClaimsProvider GetTarget(
        string issuer = TestIssuer,
        IReadOnlyList<LocalClaimInfo> declaredClaims = null,
        IReadOnlyList<Claim> claimsToReturn = null)
        => new TestProvider(issuer, declaredClaims ?? TestDeclaredClaims, claimsToReturn);

    internal class TestProvider(TrimmedRequiredString issuer, IEnumerable<LocalClaimInfo> claimInfos, IReadOnlyList<Claim> claimsToReturn)
        : LocalClaimsProvider(issuer, claimInfos)
    {
        protected override Task<IReadOnlyList<Claim>> ResolveClaimsAsync(ExecutionMode mode) => Task.FromResult(claimsToReturn);
    }

    [Fact]
    public void Constructor_ShouldCreateCorrectly()
    {
        var target = GetTarget(); // Act

        target.Issuer.Should().Be("Test");
        target.DeclaredClaims.Should().Equal(TestDeclaredClaims);
    }

    [Theory, ValuesData(null, "", "  ", " not-trimmed")]
    public void Constructor_ShouldThrow_IfInvalidIssuer(
        string issuer)
        => new Action(() => GetTarget(issuer))
            .Should().Throw<ArgumentException>();

    [Fact]
    public void Constructor_ShouldThrow_IfNoDeclaredClaims()
        => new Action(() => GetTarget(declaredClaims: Array.Empty<LocalClaimInfo>()))
            .Should().Throw<ArgumentException>();

    [Fact]
    public void Constructor_ShouldThrow_IfNullInDeclaredClaims()
        => new Action(() => GetTarget(declaredClaims: new LocalClaimInfo[] { null }))
            .Should().Throw<ArgumentException>();

    [Fact]
    public void Constructor_ShouldThrow_IfDuplicateClaimInfo()
        => new Action(() => GetTarget(declaredClaims: TestDeclaredClaims.Concat(TestDeclaredClaims).ToList()))
            .Should().Throw<DuplicateException>().Which.ConflictingValue.Should().Be("Claim 1");

    [Fact]
    public async Task GetClaims_ShouldAllowEmptyClaims()
    {
        var target = GetTarget(claimsToReturn: Array.Empty<Claim>());
        var result = await target.GetClaimsAsync(mode);
        result.Should().BeEmpty();
    }

    [Fact]
    public async Task GetClaims_ShouldReturnClaims()
    {
        var claims = new[]
        {
            new Claim("Claim 1", "Value 1", null, TestIssuer),
            new Claim("Claim 2", "Value 2", null, TestIssuer),
        };
        var target = GetTarget(claimsToReturn: claims);

        var result = await target.GetClaimsAsync(mode); // Act

        result.Should().Equal(claims);
    }

    [Fact]
    public void GetClaims_ShouldThrow_IfNullSequencedReturned()
    {
        var target = GetTarget(claimsToReturn: null);

        Func<Task> act = async () => await target.GetClaimsAsync(ExecutionMode.Sync);

        act.Should().ThrowAsync<Exception>()
            .WithMessage($"{nameof(LocalClaimsProvider)} {target} with {nameof(LocalClaimsProvider.Issuer)}='Test' returned null enumerable.");
    }

    [Fact]
    public void GetClaims_ShouldThrow_IfNullClaim()
        => RunFailedTest(
            new Claim[] { null },
            expectedErrorMsg: "Returned claim is null.");

    [Theory, ValuesData("", "  ", " Not Trimmed", "Not In DeclaredClaims")]
    public void GetClaims_ShouldThrow_IfInvalidClaimType(
        string claimType)
        => RunFailedTest(
            new[] { new Claim(claimType, "Whatever", null, TestIssuer) },
            expectedErrorMsg:
            $"Provider isn't allowed to issue this claim type because it's missing in {nameof(LocalClaimsProvider.DeclaredClaims)}: 'Claim 1', 'Claim 2'.");

    [Fact]
    public void GetClaims_ShouldThrow_IfClaimTypeNotDeclaredByProvider()
        => RunFailedTest(
            new[] { new Claim("Claim 1", "Whatever", null, "Other") },
            expectedErrorMsg: "Issuer 'Other' must correspond to one of the provider.");

    [Fact]
    public void GetClaims_ShouldThrow_IfClaimIssuedMultipleTimes()
        => RunFailedTest(
            new[] { new Claim("Claim 1", "First", null, TestIssuer), new Claim("Claim 1", "Second", null, TestIssuer), },
            expectedErrorMsg: "Claim was issued multiple times with values 'First' vs. 'Second'.");

    private static void RunFailedTest(IEnumerable<Claim> claims, string expectedErrorMsg)
    {
        var target = GetTarget(claimsToReturn: (IReadOnlyList<Claim>)claims);

        Func<Task> act = async () => await target.GetClaimsAsync(ExecutionMode.Sync);

        act.Should().ThrowAsync<Exception>().Result
            .WithMessage(
                $"{nameof(LocalClaimsProvider)} {target} with {nameof(LocalClaimsProvider.Issuer)}='Test' issued invalid claim '{claims.FirstOrDefault()?.Type}'.")
            .WithInnerMessage(expectedErrorMsg);
    }

    [Fact]
    public void LocalClaimInfo_ShouldCreateCorrectly()
    {
        var info = new LocalClaimInfo("type", "desc");

        info.Type.Should().Be("type");
        info.Description.Should().Be("desc");
    }
}
