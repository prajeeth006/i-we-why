using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Core.Reflection;

/// <summary>
/// Extension methods for <see cref="Type" />.
/// </summary>
internal static class TypeExtensions
{
    /// <summary>Checks if the type is final non-abstract class which can be instantiated.</summary>
    public static bool IsFinalClass(this Type type)
        => type is { IsClass: true, IsAbstract: false, IsGenericTypeDefinition: false };

    /// <summary>
    /// Gets null for reference types and default value for value types.
    /// </summary>
    public static object? GetDefaultValue(this Type type)
        => type.CanBeNull() ? null : Activator.CreateInstance(type);

    internal static bool CanBeNull(this Type type)
        => !type.IsValueType || Nullable.GetUnderlyingType(type) != null;

    internal static IEnumerable<MemberInfo> GetFlattenedInterfaceMembers(this Type @interface)
        => LazyEnumerable.Get(@interface.GetInterfaces)
            .Prepend(@interface)
            .SelectMany(t => t.GetMembers())
            .Where(x => !(x is MethodBase m) || !m.IsSpecialName) // Skip e.g. get/set methods, properties are listed anyway
            .OrderBy(m => m.Name); // So that we get always same results

    internal static string ToCSharp(this Type type)
    {
        if (type == typeof(void))
            return "void";

        if (type.DeclaringType != null && !type.IsGenericParameter)
        {
            if (type.GetGenericArguments().Length > type.DeclaringType.GetGenericArguments().Length)
                throw new ArgumentException("Nested generic types aren't supported: " + type, nameof(type));

            return $"{ToCSharp(type.DeclaringType)}.{type.Name}";
        }

        if (!type.IsGenericType)
            return type.ToString();

        var fullName = type.ToString();
        fullName = fullName.Substring(0, fullName.IndexOf("`", StringComparison.Ordinal));

        var genericArguments = type.GetGenericArguments().Select(ToCSharp).Join();

        return $"{fullName}<{genericArguments}>";
    }

    public static TMember GetRequired<TMember>(this Type type, string name)
        where TMember : MemberInfo
    {
        var allMembers = type.GetMembers(BindingFlags.Static | BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
        var matchedMembers = allMembers.OfType<TMember>().Where(m => m.Name == name).ToList();

        return matchedMembers.Count switch
        {
            0 => throw new Exception($"Missing required {GetMemberKind()} '{name}' on {type}. Existing {GetMemberKind()}-s: {allMembers.OfType<TMember>().Dump()}."),
            1 => matchedMembers[0],
            _ => throw new Exception(
                $"Multiple {GetMemberKind()}-s with name '{name}' found on {type}. Change names or retrieve desired {GetMemberKind()} using different API."
                + $" Found methods: {matchedMembers.Dump()}."),
        };

        static string GetMemberKind()
            => typeof(TMember).Name.RemoveSuffix("Info").ToLowerInvariant();
    }
}
