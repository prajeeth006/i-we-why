using System;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public sealed class ProxyRulesConverterTests : CollectionConverterTestsBase<ProxyRule>
{
    public ProxyRulesConverterTests()
    {
        Target = new ProxyRulesConverter();
    }

    [Fact]
    public void ShouldConvertItems()
    {
        Context.SetupGet(c => c.FieldValue).Returns(@"[
                { condition: 'User.IsVip', target: 'App-v1.0/VIP' },
                { condition: 'User.IsForbidden' },
                { target: 'App-v1.0/Fallback' },
            ]");

        ConvertAndExpectItems( // Act
            new ProxyRule("User.IsVip", new DocumentId("id-factory/App-v1.0/VIP", culture: Context.Object.Culture)),
            new ProxyRule("User.IsForbidden", null),
            new ProxyRule(null, new DocumentId("id-factory/App-v1.0/Fallback", culture: Context.Object.Culture)));

        Context.VerifyWithAnyArgs(c => c.DocumentIdFactory.Create(null, null, null), Times.Exactly(2));
    }

    [Theory, MemberValuesData(nameof(EmptyValues))]
    public void ShouldReturnEmptyCollection_IfEmptyInput(string inputValue)
    {
        Context.SetupGet(c => c.FieldValue).Returns(inputValue);

        ConvertAndExpect(Array.Empty<ProxyRule>()); // Act

        Context.VerifyWithAnyArgs(c => c.DocumentIdFactory.Create(null, null, null), Times.Never());
    }
}
