using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using FluentAssertions;
using FluentAssertions.Primitives;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal sealed class NameValueCollectionFluentAssertions(NameValueCollection subject)
    : ReferenceTypeAssertions<NameValueCollection, NameValueCollectionFluentAssertions>(subject)
{
    protected override string Identifier => "nameValueCollection";

    public AndConstraint<NameValueCollectionFluentAssertions> Equal(NameValueCollection expected)
    {
        var actualDict = Convert(Subject);
        var expectedDict = Convert(expected);

        actualDict.Should().BeEquivalentTo(expectedDict);

        return new AndConstraint<NameValueCollectionFluentAssertions>(this);
    }

    public AndConstraint<NameValueCollectionFluentAssertions> BeEmpty()
    {
        Subject.AllKeys.Should().BeEmpty();

        return new AndConstraint<NameValueCollectionFluentAssertions>(this);
    }

    public AndConstraint<NameValueCollectionFluentAssertions> BeReadOnly()
    {
        Subject.Invoking(r => r.Set("k", "v")).Should().Throw<NotSupportedException>("should be read-only");

        return new AndConstraint<NameValueCollectionFluentAssertions>(this);
    }

    private static Dictionary<string, string[]> Convert(NameValueCollection collection)
    {
        return collection.AllKeys.ToDictionary(k => k, collection.GetValues);
    }
}
