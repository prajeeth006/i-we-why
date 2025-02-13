using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.Common.Extensions
{
    public static  class CommonExtension
    {
        public static HashSet<T> ToHashSet<T>(this IEnumerable<T> source)
        {
            return new HashSet<T>(source);
        }
    }
}
