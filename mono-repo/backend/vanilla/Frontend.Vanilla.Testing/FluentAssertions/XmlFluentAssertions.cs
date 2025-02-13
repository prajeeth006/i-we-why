using System.Xml.Linq;
using FluentAssertions;
using FluentAssertions.Primitives;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal static class XmlFluentAssertions
{
    public static AndConstraint<StringAssertions> BeWellFormedXml(this StringAssertions assertions)
    {
        XElement.Parse(assertions.Subject);

        return new AndConstraint<StringAssertions>(assertions);
    }
}
