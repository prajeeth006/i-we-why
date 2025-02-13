using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.Loading.Placeholders;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.Loading.Placeholders;

public class PlaceholderReplacerTests
{
    private static readonly IPlaceholderReplacer Target = new PlaceholderReplacer();

    [Fact]
    public void ShouldReturnSameString_IfNoPlaceholdersContained()
    {
        var inputStr = "Hello BWIN";
        var placeholders = new Dictionary<TrimmedRequiredString, ClientEvaluationResult<object>>
        {
            { "_|GeoIP.Country|_", ClientEvaluationResult<object>.FromValue("Wadiya") },
            { "_|User.Balance|_", ClientEvaluationResult<object>.FromClientExpression("c.User.Balance") },
        };

        var result = Target.Replace(inputStr, placeholders); // Act

        result.Should().BeSameAs(inputStr);
    }

    [Fact]
    public void ShouldReplaceServerPlaceholders()
    {
        // Covers cases when there is no leading/trailing raw string before/after client placeholder
        var inputStr = "Hello _|User.Name|_ from _|GeoIP.Country|_. Your country: _|GeoIP.Country|_";
        var placeholders = new Dictionary<TrimmedRequiredString, ClientEvaluationResult<object>>
        {
            { "_|User.Name|_", ClientEvaluationResult<object>.FromValue("Admiral General Aladeen") },
            { "_|GeoIP.Country|_", ClientEvaluationResult<object>.FromValue("Wadiya") },
        };

        var result = Target.Replace(inputStr, placeholders); // Act

        result.Should().Be("Hello Admiral General Aladeen from Wadiya. Your country: Wadiya");
    }

    [Fact]
    public void ShouldReplaceClientPlaceholders()
    {
        // Covers cases when there is no leading/trailing raw string before/after client placeholder
        var inputStr = "Hello _|User.FirstName|__|User.LastName|_ from _|GeoIP.Country|_. Balance of _|User.FirstName|_: _|User.Balance|_";
        var placeholders = new Dictionary<TrimmedRequiredString, ClientEvaluationResult<object>>
        {
            { "_|User.FirstName|_", ClientEvaluationResult<object>.FromClientExpression("c.FirstName") },
            { "_|User.LastName|_", ClientEvaluationResult<object>.FromClientExpression("c.LastName") },
            { "_|GeoIP.Country|_", ClientEvaluationResult<object>.FromValue("Wadiya") },
            { "_|User.Balance|_", ClientEvaluationResult<object>.FromClientExpression("c.Balance") },
        };

        var result = Target.Replace(inputStr, placeholders); // Act

        result.Should().Be(PlaceholderReplacer.ClientDslPrefix + "'Hello '+c.FirstName+c.LastName+' from Wadiya. Balance of '+c.FirstName+': '+c.Balance");
    }
}
