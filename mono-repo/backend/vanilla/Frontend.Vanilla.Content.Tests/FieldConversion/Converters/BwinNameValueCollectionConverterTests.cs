using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Content.Model;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public class BwinNameValueCollectionConverterTests : ConverterTestsBase<ContentParameters>
{
    public BwinNameValueCollectionConverterTests() => Target = new BwinNameValueCollectionConverter(BwinCollectionParser.Object);

    public static readonly IEnumerable<object[]> TestCases = new[]
    {
        new object[] { Array.Empty<(string, string)>(), ContentParameters.Empty },
        new object[]
        {
            new[]
            {
                ("k1", "v1"),
                ("k2", null),
                ("k3", "v3"),
            },
            new Dictionary<string, string>
            {
                ["k1"] = "v1",
                ["k2"] = null,
                ["k3"] = "v3",
            }.AsContentParameters(),
        },
    };

    [Theory, MemberData(nameof(TestCases))]
    public void ShouldConvertItemsToNameValueCollection(IReadOnlyList<(string Key, string Value)> parsedRawItems, ContentParameters expectedResult)
    {
        Context.SetupGet(c => c.FieldValue).Returns("test");
        BwinCollectionParser.Setup(p => p.Parse("test")).Returns(parsedRawItems);

        var result = Target_Convert(); // Act

        result.Should().Equal(expectedResult);
    }
}
