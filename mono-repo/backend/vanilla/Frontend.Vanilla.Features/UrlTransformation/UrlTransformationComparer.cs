using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal class UrlTransformationComparer : IEqualityComparer<UrlTransformation>
    {
        private bool StringEquals(string first, string second) => StringComparer.OrdinalIgnoreCase.Equals(first, second);

        public bool Equals(UrlTransformation? x, UrlTransformation? y) => StringEquals(x!.Matcher, y!.Matcher) && StringEquals(x.Output, y.Output);

        public int GetHashCode(UrlTransformation obj) => obj.GetHashCode();
    }
}
