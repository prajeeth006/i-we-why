#nullable enable

using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.DomainSpecificActions.Configuration;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.DomainSpecificActions.Configuration;

public class DsaPlaceholderReplacerTests
{
    private static readonly IDsaPlaceholderReplacer Target = new DsaPlaceholderReplacer();

    private static readonly IReadOnlyDictionary<string, string?> Placeholders = new Dictionary<string, string?>
    {
        { "${firstName}", "James" },
        { "${lastName}", "Bond" },
        { "${empty}", "" },
        { "${null}", null },
    };

    [Theory]
    [InlineData("My name is ${lastName}, ${firstName} ${lastName}.", "My name is Bond, James Bond.")]
    [InlineData("${empty}", "")]
    [InlineData("${null}", "")]
    public void ShouldReplacePlaceholders(string input, string expected)
        => Target.Replace(input, Placeholders).Should().Be(expected);

    [Fact]
    public void ShouldThrow_IfUnknownPlaceholder()
        => new Action(() => Target.Replace("What is this ${shit}?", Placeholders))
            .Should().Throw()
            .Which.Message.Should().ContainAll("'${shit}'", "'${firstName}'", "'${lastName}'", "'${empty}'", "'${null}'");
}
