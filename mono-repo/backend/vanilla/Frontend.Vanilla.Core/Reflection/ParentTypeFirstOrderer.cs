using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Core.Reflection;

/// <summary>
/// Orders given types so that base types will go before inherited ones.
/// </summary>
internal static class ParentTypeFirstOrderer
{
    public static IEnumerable<Type> OrderParentsFirst(this IEnumerable<Type> types)
    {
        var typeList = types.Enumerate();
        var inheritance = typeList.ToDictionary(t => t, t => typeList.Except(t).Where(x => x.IsAssignableFrom(t)).ToList());
        var alreadyReturned = new HashSet<Type>();

        return EnumerateParentsFirst(typeList);

        IEnumerable<Type> EnumerateParentsFirst(IEnumerable<Type> typesToEnumerate)
        {
            foreach (var type in typesToEnumerate)
            {
                foreach (var resultType in EnumerateParentsFirst(inheritance[type]))
                    yield return resultType;

                if (alreadyReturned.Add(type))
                    yield return type;
            }
        }
    }
}
