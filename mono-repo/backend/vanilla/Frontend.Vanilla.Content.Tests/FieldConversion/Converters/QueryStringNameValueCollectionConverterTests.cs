using System.Collections.Generic;
using System.Collections.Specialized;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Testing.Xunit;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class QueryStringNameValueCollectionConverterTests : ConverterTestsBase<NameValueCollection>
{
    public QueryStringNameValueCollectionConverterTests()
    {
        Target = new QueryStringNameValueCollectionConverter();
    }

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[]
        {
            "theme=Black&company=BWIN", new NameValueCollection // Multiple items
            {
                { "theme", "Black" },
                { "company", "BWIN" },
            },
        },
        new object[]
        {
            "key=Black%20%26%20White", new NameValueCollection // Unicode
            {
                { "key", "Black & White" },
            },
        },
        new object[]
        {
            "key=Chuck+Norris", new NameValueCollection // Plus instead of spaces
            {
                { "key", "Chuck Norris" },
            },
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    public void ShouldConvertItems(string inputValue, NameValueCollection expected)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);

        var result = Target_Convert(); // Act

        result.Should().BeEquivalentTo(expected);
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnEmpty_IfEmptyInput(string inputValue)
        => ShouldConvertItems(inputValue, new NameValueCollection());
}
