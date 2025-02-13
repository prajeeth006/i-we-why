using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection;

/// <summary>
/// Provides easy way to call a generic method when you have generic arguments avilable only in the runtime stored in variables.
/// </summary>
internal static class GenericInvocationExtensions
{
    private static readonly ConcurrentDictionary<string, CompiledMethod> CachedFuncs = new ();

    public static object InvokeGeneric(this object obj, string methodName, Type genericArgument, params object[] arguments)
        => obj.InvokeGeneric(methodName, new[] { genericArgument }, arguments);

    public static object InvokeGeneric(this object obj, string methodName, Type[] genericArguments, params object[] arguments)
    {
        Guard.NotEmpty(genericArguments, nameof(genericArguments));
        Guard.Requires(genericArguments.All(t => t != null), nameof(genericArguments), "Must contain a least one type (not null).");

        var cacheKey = $"{obj.GetType().FullName}.{methodName}<{genericArguments.Join()}>";
        var func = CachedFuncs.GetOrAdd(cacheKey, _ => CompileMethod(obj.GetType(), methodName, genericArguments));

        return func(obj, arguments);
    }

    private static CompiledMethod CompileMethod(Type objType, string methodName, Type[] genericArguments)
    {
        var allMethods = objType.GetMethods(BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic);
        var methods = allMethods.Where(m => m.Name == methodName && m.IsGenericMethodDefinition && m.GetGenericArguments().Length == genericArguments.Length).ToList();

        if (methods.Count != 1)
            throw new Exception();

        return methods[0].MakeGenericMethod(genericArguments).Compile();
    }
}
