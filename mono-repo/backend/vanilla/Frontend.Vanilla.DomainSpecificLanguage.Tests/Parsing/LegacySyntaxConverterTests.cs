using FluentAssertions;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Parsing;
using Frontend.Vanilla.Testing.FluentAssertions;
using Xunit;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Parsing;

public sealed class LegacySyntaxConverterTests
{
    private static readonly ILegacySyntaxConverter Target = new LegacySyntaxConverter();

    [Theory]
    [InlineData("User.Name.StartsWith('Chuck')", "User.Name STARTS-WITH ('Chuck')")]
    [InlineData("User666.First_Name.StartsWith('Chuck')", "User666.First_Name STARTS-WITH ('Chuck')")] // Complex chars
    [InlineData("User.IsKnown OR User.Name.StartsWith('Chuck')", "User.IsKnown OR User.Name STARTS-WITH ('Chuck')")] // Replaced part is not at the beginning
    [InlineData("User.Name.EndsWith('Chuck')", "User.Name ENDS-WITH ('Chuck')")]
    [InlineData("User.Name.Contains('Chuck')", "User.Name CONTAINS ('Chuck')")]
    [InlineData("Layout.IsClient() AND Foo.Bar", "Layout.IsClient AND Foo.Bar")]
    [InlineData("Layout.IsClient()", "Layout.IsClient")]
    // Parentheses at the end
    public void ShouldConvertLegacySyntaxToNew(string input, string expectedResult)
    {
        // Act
        (var result, var warnings) = Target.Convert(input);

        result.Should().Be(expectedResult);
        warnings.Should().HaveCount(1);
    }

    [Theory]
    [InlineData("List.Contains('vip')")]
    [InlineData("User.IsKnown OR Kyc.Contains('residence')")]
    public void ShouldNotConvert_IfNoLegacySyntax(string expression)
    {
        // Act
        (var result, var warnings) = Target.Convert(expression);

        result.Should().Be(expression);
        warnings.Should().BeEmpty();
    }

    [Fact]
    public void ShouldOutputWarningOnlyOncePerOccurence()
    {
        const string expr = "A.B.Contains('a') OR B.C.StartsWith('b') OR D.E.Contains('c')";

        // Act
        (var result, var warnings) = Target.Convert(expr);

        result.Should().Be("A.B CONTAINS ('a') OR B.C STARTS-WITH ('b') OR D.E CONTAINS ('c')");
        warnings.Should().BeEquivalentTo<TrimmedRequiredString>(
            "Detected legacy '.Contains' expression which will not be supported soon. Replace it with newer 'CONTAINS' operator as soon as possible.",
            "Detected legacy '.StartsWith' expression which will not be supported soon. Replace it with newer 'STARTS-WITH' operator as soon as possible.");
    }
}
