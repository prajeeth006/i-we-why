using System;
using System.Collections.Generic;
using System.Reflection;
using System.Threading.Tasks;
using Xunit;
using Xunit.Sdk;
using Xunit.v3;

namespace Frontend.Vanilla.Testing.Xunit;

internal sealed class InheritedMemberDataAttribute(string memberName, params object[] parameters) : MemberDataAttributeBase(memberName, parameters)
{
    public override ValueTask<IReadOnlyCollection<ITheoryDataRow>> GetData(MethodInfo testMethod, DisposalTracker disposalTracker)
    {
        MemberType = testMethod.ReflectedType ?? throw new Exception("Missing test class.");
        return base.GetData(testMethod, disposalTracker);
    }
}
