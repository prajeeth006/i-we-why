using System;
using System.Collections.Generic;
using System.Reflection;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

/// <summary>
/// Defines how proxy class should be built.
/// </summary>
internal interface IRoslynProxyBuilder
{
    Type InterfaceToProxy { get; }
    TrimmedRequiredString ClassNameInfix { get; }
    IReadOnlyDictionary<Type, TrimmedRequiredString> Fields { get; }

    RequiredString GetMethodCode(MethodInfo method);
    RequiredString GetPropertyGetterCode(PropertyInfo property);
    RequiredString GetPropertySetterCode(PropertyInfo property);
}
