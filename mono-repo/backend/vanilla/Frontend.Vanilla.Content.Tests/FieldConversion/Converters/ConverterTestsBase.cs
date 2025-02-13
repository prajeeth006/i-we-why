using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using FluentAssertions;
using Frontend.Vanilla.Content.FieldConversion;
using Frontend.Vanilla.Content.FieldConversion.Converters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;

namespace Frontend.Vanilla.Content.Tests.FieldConversion.Converters;

public abstract class ConverterTestsBase<TField>
{
    protected IFieldConverter<TField> Target { get; set; }
    protected Mock<IFieldConversionContext> Context { get; set; }
    internal Mock<IBwinNameValueCollectionParser> BwinCollectionParser { get; set; }

    public ConverterTestsBase()
    {
        CultureInfoHelper.SetCurrent(new CultureInfo("zh-CN"));
        Context = new Mock<IFieldConversionContext>();
        BwinCollectionParser = new Mock<IBwinNameValueCollectionParser>();

        Context.SetupGet(c => c.Culture).Returns(new CultureInfo("sw-KE")); // Make sure it's different from current
        Context.SetupWithAnyArgs(f => f.DocumentIdFactory.Create(null, null, null))
            .Returns((RequiredString p, CultureInfo c, string id) => new DocumentId("id-factory/" + p.Value.TrimStart('/'), default, c, id));
    }

    public static readonly IEnumerable<string> EmptyValues = new[] { null, "", "  " };

    public static readonly IEnumerable TestUrls = new[]
    {
        "http://absolute-url.tld/path?q=1",
        "//protocol-relative-url.tld/path?q=1",
        "/rooted-relative-url?q=1",
        "relative-url?q=1",
        "mailto:gmail@chucknorris.com",
    };

    protected Func<TField> Target_Convert => () => Target.Convert(Context.Object);

    protected void ConvertAndExpect(TField expected)
    {
        var actual = Target_Convert(); // Act
        actual.Should().BeEquivalentTo(expected);
    }
}

public abstract class CollectionConverterTestsBase<TItem> : ConverterTestsBase<IReadOnlyList<TItem>>
{
    protected void ConvertAndExpectItems(params TItem[] expectedItems)
    {
        var actual = Target_Convert(); // Act
        actual.Should().BeEquivalentOrderedTo(expectedItems);
    }
}
