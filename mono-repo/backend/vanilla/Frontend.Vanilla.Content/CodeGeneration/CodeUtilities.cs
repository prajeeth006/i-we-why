using System;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Content.CodeGeneration;

internal static class CodeUtilities
{
    private static readonly Dictionary<Type, string> TypeMap = new ()
    {
        { typeof(string), "string" },
        { typeof(int), "int" },
        { typeof(long), "long" },
        { typeof(short), "short" },
        { typeof(float), "float" },
        { typeof(double), "double" },
        { typeof(bool), "bool" },
        { typeof(decimal), "decimal" },
    };

    internal static IEnumerable<string> GetGenericArgumentTypeNames(Type type)
    {
        return type.IsGenericType ? type.GetGenericArguments().Select(GetTypeName) : null;
    }

    internal static string GetTypeName(Type type)
    {
        if (type.IsGenericType)
        {
            var genericType = type.GetGenericTypeDefinition();
            var genericArguments = type.GetGenericArguments();

            if (genericType == typeof(Nullable<>))
            {
                return GetTypeName(genericArguments[0]) + "?";
            }

            var genericTypeName = GetTypeNameOverrides(type);

            // Remove the strange .MSIL syntax: "´1":
            var apostropheIndex = genericTypeName.LastIndexOf('`');

            if (apostropheIndex > -1)
            {
                genericTypeName = genericTypeName.Substring(0, apostropheIndex);
            }

            var argumentNames = string.Join(",", genericArguments.Select(GetTypeName));

            return genericTypeName + "<" + argumentNames + ">";
        }

        return GetTypeNameOverrides(type);
    }

    private static string GetTypeNameOverrides(Type type)
    {
        return TypeMap.ContainsKey(type) ? TypeMap[type] : type.Name;
    }
}
