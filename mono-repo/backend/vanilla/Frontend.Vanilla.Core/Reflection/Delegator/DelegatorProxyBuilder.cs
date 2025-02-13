using System;
using System.Collections.Generic;
using System.Reflection;
using Frontend.Vanilla.Core.Reflection.Proxy;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection.Delegator;

/// <summary>
/// Builds a proxy which delegates execution to an object resolved by <see cref="IProxyDelegator" /> in the runtime.
/// </summary>
internal sealed class DelegatorProxyBuilder(Type interfaceToProxy, Type? delegatedType = null) : IRoslynProxyBuilder
{
    private const string DelegatorField = "delegator";
    private const string TargetVariable = "target";

    public Type InterfaceToProxy { get; } = Guard.Interface(interfaceToProxy, nameof(interfaceToProxy));
    public TrimmedRequiredString ClassNameInfix { get; } = "Delegator";
    public Type DelegatedType { get; } = delegatedType ?? interfaceToProxy;
    public IReadOnlyDictionary<Type, TrimmedRequiredString> Fields { get; } = new Dictionary<Type, TrimmedRequiredString> { { typeof(IProxyDelegator), DelegatorField } };

    public RequiredString GetPropertyGetterCode(PropertyInfo property)
    {
        var targetResolutionCode = GetTargetResolutionCode(property.GetMethod);

        return $"{targetResolutionCode}return {TargetVariable}.{property.Name};";
    }

    public RequiredString GetPropertySetterCode(PropertyInfo property)
    {
        var targetResolutionCode = GetTargetResolutionCode(property.SetMethod);

        return $"{targetResolutionCode}{TargetVariable}.{property.Name} = value;";
    }

    public RequiredString GetMethodCode(MethodInfo method)
    {
        var targetResolutionCode = GetTargetResolutionCode(method);
        var code = MethodCSharpGenerator.Get(method);

        return $"{targetResolutionCode}{code.Return}{TargetVariable}.{code.Name}{code.Generics}({code.Parameters});";
    }

    private string GetTargetResolutionCode(MemberInfo? accessor)
        => $@"var {TargetVariable} = ({DelegatedType.ToCSharp()}){DelegatorField}.{nameof(IProxyDelegator.ResolveTarget)}(""{accessor?.Name}"");{Environment.NewLine}";
}
