using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing.FluentAssertions;
using Moq;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.AcceptanceTests;

public sealed class PlaceholderAcceptanceTests : AcceptanceTestsBase
{
    [Fact]
    public void ShouldFullyReplacePlaceholdersIncludingEvaluation()
    {
        UserDslProvider.Setup(p => p.GetLoginName()).Returns("Chuck Norris");
        UserDslProvider.Setup(p => p.GetTierCodeAsync(ExecutionMode.Sync)).ReturnsAsync(666);
        const string text = "Hello _|User.LoginName|_, your balance is _|User.TierCode|_";

        // Act
        var (placeholders, _) = PlaceholderCompiler.FindPlaceholders(text);

        placeholders.Keys.Should().BeEquivalentTo<TrimmedRequiredString>("_|User.LoginName|_", "_|User.TierCode|_");
        placeholders.Should().ContainKey("_|User.LoginName|_")
            .WhoseValue.Evaluate().Should().Be("Chuck Norris");
        placeholders.Should().ContainKey("_|User.TierCode|_")
            .WhoseValue.Evaluate().Should().Be(666);
    }
}
