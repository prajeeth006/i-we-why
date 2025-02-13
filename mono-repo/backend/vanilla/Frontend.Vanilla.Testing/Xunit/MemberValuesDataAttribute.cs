using System.Reflection;
using Xunit;
using Xunit.v3;

namespace Frontend.Vanilla.Testing.Xunit;

internal sealed class MemberValuesDataAttribute(string memberName, params object[] parameters) : MemberDataAttributeBase(memberName, parameters)
{
    protected override ITheoryDataRow ConvertDataRow(object dataRow)
    {
        return base.ConvertDataRow(new[] { dataRow });
    }
}
