using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Testing.Fakes;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ClientConfig;

public class CachedUserValuesFlagTests
{
    private CancellationToken ct;

    public CachedUserValuesFlagTests()
    {
        ct = TestCancellationToken.Get();
    }

    [Theory]
    [MemberData(nameof(GetGetCachedTestCases))]
    public async Task GetCachedTests(
#pragma warning disable xUnit1026 // Theory methods should use all of their parameters
#pragma warning disable SA1114 // Parameter list should follow declaration
        string description,
#pragma warning restore SA1114 // Parameter list should follow declaration
#pragma warning restore xUnit1026 // Theory methods should use all of their parameters
        bool shouldBeCached,
        bool fetchCachedUserValues)
    {
        var cachedUserValuesConfig = new Mock<ICachedUserValuesConfig>();
        cachedUserValuesConfig.Setup(c => c.FetchCachedUserValuesCondition.EvaluateAsync(ct)).ReturnsAsync(fetchCachedUserValues);

        var cachedUserValuesFlag = new CachedUserValuesFlag(
            cachedUserValuesConfig.Object);

        var cached = await cachedUserValuesFlag.GetCached(ct);
        cached.Should().Be(shouldBeCached);
    }

    public static IEnumerable<object[]> GetGetCachedTestCases()
    {
        object[] GetTestCase(
            string description,
            bool shouldBeCached,
            bool fetchCachedUserValues) => new object[] { description, shouldBeCached, fetchCachedUserValues };

        yield return GetTestCase(
            "false cache setting",
            false,
            false);

        yield return GetTestCase(
            "true cache setting",
            true,
            true);
    }
}
