using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Core.Reflection.Proxy;

/// <summary>
/// Helper for generating C# code of a method.
/// </summary>
internal static class MethodCSharpGenerator
{
    public static (string Return, string Name, string Generics, string Parameters) Get(MethodInfo method)
    {
        var @return = method.ReturnType != typeof(void) ? "return " : "";
        var name = method.Name;
        var generics = method.GetGenericArguments() is var args && args.Length > 0 ? $"<{args.Join()}>" : "";
        var parameters = GetPassParametersCode(method.GetParameters());

        return (@return, name, generics, parameters);
    }

    public static string GetPassParametersCode(IEnumerable<ParameterInfo> parameters)
        => parameters.Select(p => GetParameterModifier(p) + p.Name).Join();

    public static string GetParameterModifier(ParameterInfo parameter)
    {
        if (parameter.IsOut)
            return "out ";
        if (parameter.ParameterType.IsByRef)
            return "ref ";

        return "";
    }
}
